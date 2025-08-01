from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import ListeningTest, ListeningAttempt
from schemas import (
    ListeningTestCreate, 
    ListeningTest as ListeningTestSchema,
    ListeningTestUpdate,
    ListeningAttemptCreate,
    ListeningAttempt as ListeningAttemptSchema,
    TestStats
)
from auth import get_current_active_user
from datetime import datetime

router = APIRouter()

@router.get("/listening-tests", response_model=List[ListeningTestSchema])
async def get_listening_tests(
    type: Optional[str] = Query(None, description="Filter by test type"),
    status: Optional[str] = Query(None, description="Filter by test status"),
    level: Optional[str] = Query(None, description="Filter by test level"),
    limit: Optional[int] = Query(100, description="Limit number of results"),
    offset: Optional[int] = Query(0, description="Offset for pagination"),
    db: Session = Depends(get_db)
):
    query = db.query(ListeningTest)
    
    # Apply filters
    if type and type != "all":
        query = query.filter(ListeningTest.type == type)
    if status and status != "all":
        query = query.filter(ListeningTest.status == status)
    if level and level != "all":
        query = query.filter(ListeningTest.level == level)
    
    # Apply pagination
    tests = query.offset(offset).limit(limit).all()
    
    # Convert to response format
    result = []
    for test in tests:
        sections = test.sections
        total_questions = sum(len(section.get("questions", [])) for section in sections)
        
        result.append({
            "id": test.id,
            "title": test.title,
            "type": test.type,
            "level": test.level,
            "sections": len(sections),
            "questions": total_questions,
            "timeLimit": test.time_limit,
            "status": test.status,
            "attempts": test.attempts,
            "avgScore": test.avg_score,
            "createdAt": test.created_at,
            "updatedAt": test.updated_at,
            "sections_data": sections
        })
    
    return result

@router.post("/listening-tests", response_model=ListeningTestSchema)
async def create_listening_test(
    test: ListeningTestCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    # Calculate total questions
    total_questions = sum(len(section.questions) for section in test.sections_data)
    
    # Create test
    db_test = ListeningTest(
        title=test.title,
        type=test.type,
        level=test.level,
        time_limit=test.timeLimit,
        sections=test.sections_data
    )
    
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    
    # Return in expected format
    sections = db_test.sections
    return {
        "id": db_test.id,
        "title": db_test.title,
        "type": db_test.type,
        "level": db_test.level,
        "sections": len(sections),
        "questions": total_questions,
        "timeLimit": db_test.time_limit,
        "status": db_test.status,
        "attempts": db_test.attempts,
        "avgScore": db_test.avg_score,
        "createdAt": db_test.created_at,
        "updatedAt": db_test.updated_at,
        "sections_data": sections
    }

@router.get("/listening-tests/{test_id}", response_model=ListeningTestSchema)
async def get_listening_test(
    test_id: int,
    db: Session = Depends(get_db)
):
    test = db.query(ListeningTest).filter(ListeningTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Listening test not found")
    
    sections = test.sections
    total_questions = sum(len(section.get("questions", [])) for section in sections)
    
    return {
        "id": test.id,
        "title": test.title,
        "type": test.type,
        "level": test.level,
        "sections": len(sections),
        "questions": total_questions,
        "timeLimit": test.time_limit,
        "status": test.status,
        "attempts": test.attempts,
        "avgScore": test.avg_score,
        "createdAt": test.created_at,
        "updatedAt": test.updated_at,
        "sections_data": sections
    }

@router.put("/listening-tests/{test_id}", response_model=ListeningTestSchema)
async def update_listening_test(
    test_id: int,
    test_update: ListeningTestUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    test = db.query(ListeningTest).filter(ListeningTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Listening test not found")
    
    # Update fields
    update_data = test_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "timeLimit":
            setattr(test, "time_limit", value)
        elif field == "sections_data":
            test.sections = value
        else:
            setattr(test, field, value)
    
    test.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(test)
    
    # Return in expected format
    sections = test.sections
    total_questions = sum(len(section.get("questions", [])) for section in sections)
    
    return {
        "id": test.id,
        "title": test.title,
        "type": test.type,
        "level": test.level,
        "sections": len(sections),
        "questions": total_questions,
        "timeLimit": test.time_limit,
        "status": test.status,
        "attempts": test.attempts,
        "avgScore": test.avg_score,
        "createdAt": test.created_at,
        "updatedAt": test.updated_at,
        "sections_data": sections
    }

@router.patch("/listening-tests/{test_id}/toggle-status", response_model=ListeningTestSchema)
async def toggle_listening_test_status(
    test_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    test = db.query(ListeningTest).filter(ListeningTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Listening test not found")
    
    # Toggle status
    if test.status == "Active":
        test.status = "Draft"
    else:
        test.status = "Active"
    
    test.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(test)
    
    # Return in expected format
    sections = test.sections
    total_questions = sum(len(section.get("questions", [])) for section in sections)
    
    return {
        "id": test.id,
        "title": test.title,
        "type": test.type,
        "level": test.level,
        "sections": len(sections),
        "questions": total_questions,
        "timeLimit": test.time_limit,
        "status": test.status,
        "attempts": test.attempts,
        "avgScore": test.avg_score,
        "createdAt": test.created_at,
        "updatedAt": test.updated_at,
        "sections_data": sections
    }

@router.delete("/listening-tests/{test_id}")
async def delete_listening_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    test = db.query(ListeningTest).filter(ListeningTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Listening test not found")
    
    db.delete(test)
    db.commit()
    return {"message": "Listening test deleted successfully"}

@router.post("/listening-tests/{test_id}/attempt")
async def record_listening_attempt(
    test_id: int,
    attempt: ListeningAttemptCreate,
    db: Session = Depends(get_db)
):
    test = db.query(ListeningTest).filter(ListeningTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Listening test not found")
    
    # Create attempt
    db_attempt = ListeningAttempt(
        test_id=test_id,
        student_id=attempt.studentId,
        score=attempt.score,
        time_spent=attempt.timeSpent or 0
    )
    
    db.add(db_attempt)
    
    # Update test statistics
    test.attempts += 1
    
    # Calculate new average score
    all_attempts = db.query(ListeningAttempt).filter(ListeningAttempt.test_id == test_id).all()
    total_score = sum(att.score for att in all_attempts) + attempt.score
    test.avg_score = total_score / len(all_attempts)
    
    db.commit()
    db.refresh(db_attempt)
    
    return {
        "id": db_attempt.id,
        "test_id": db_attempt.test_id,
        "student_id": db_attempt.student_id,
        "score": db_attempt.score,
        "time_spent": db_attempt.time_spent,
        "created_at": db_attempt.created_at
    }

@router.get("/listening-tests/stats", response_model=TestStats)
async def get_listening_stats(db: Session = Depends(get_db)):
    total_tests = db.query(ListeningTest).count()
    active_tests = db.query(ListeningTest).filter(ListeningTest.status == "Active").count()
    
    # Get total attempts and average score
    attempts_query = db.query(ListeningAttempt)
    total_attempts = attempts_query.count()
    
    if total_attempts > 0:
        avg_score = db.query(ListeningAttempt.score).all()
        average_score = sum(score[0] for score in avg_score) / total_attempts
    else:
        average_score = 0.0
    
    return TestStats(
        totalTests=total_tests,
        activeTests=active_tests,
        totalAttempts=total_attempts,
        averageScore=average_score
    ) 