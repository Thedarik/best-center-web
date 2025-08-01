from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import ReadingTest, ReadingAttempt
from schemas import (
    ReadingTestCreate, 
    ReadingTest as ReadingTestSchema,
    ReadingTestUpdate,
    ReadingAttemptCreate,
    ReadingAttempt as ReadingAttemptSchema,
    TestStats
)
from auth import get_current_active_user
from datetime import datetime

router = APIRouter()

@router.get("/reading-tests", response_model=List[ReadingTestSchema])
async def get_reading_tests(
    type: Optional[str] = Query(None, description="Filter by test type"),
    status: Optional[str] = Query(None, description="Filter by test status"),
    level: Optional[str] = Query(None, description="Filter by test level"),
    limit: Optional[int] = Query(100, description="Limit number of results"),
    offset: Optional[int] = Query(0, description="Offset for pagination"),
    db: Session = Depends(get_db)
):
    query = db.query(ReadingTest)
    
    # Apply filters
    if type and type != "all":
        query = query.filter(ReadingTest.type == type)
    if status and status != "all":
        query = query.filter(ReadingTest.status == status)
    if level and level != "all":
        query = query.filter(ReadingTest.level == level)
    
    # Apply pagination
    tests = query.offset(offset).limit(limit).all()
    
    # Convert to response format
    result = []
    for test in tests:
        passages = test.passages
        total_questions = sum(len(passage.get("questions", [])) for passage in passages)
        
        result.append({
            "id": test.id,
            "title": test.title,
            "type": test.type,
            "level": test.level,
            "passages": len(passages),
            "questions": total_questions,
            "timeLimit": test.time_limit,
            "status": test.status,
            "attempts": test.attempts,
            "avgScore": test.avg_score,
            "createdAt": test.created_at,
            "updatedAt": test.updated_at,
            "passages_data": passages
        })
    
    return result

@router.post("/reading-tests", response_model=ReadingTestSchema)
async def create_reading_test(
    test: ReadingTestCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    # Calculate total questions
    total_questions = sum(len(passage.questions) for passage in test.passages_data)
    
    # Create test
    db_test = ReadingTest(
        title=test.title,
        type=test.type,
        level=test.level,
        time_limit=test.timeLimit,
        passages=test.passages_data
    )
    
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    
    # Return in expected format
    passages = db_test.passages
    return {
        "id": db_test.id,
        "title": db_test.title,
        "type": db_test.type,
        "level": db_test.level,
        "passages": len(passages),
        "questions": total_questions,
        "timeLimit": db_test.time_limit,
        "status": db_test.status,
        "attempts": db_test.attempts,
        "avgScore": db_test.avg_score,
        "createdAt": db_test.created_at,
        "updatedAt": db_test.updated_at,
        "passages_data": passages
    }

@router.get("/reading-tests/{test_id}", response_model=ReadingTestSchema)
async def get_reading_test(
    test_id: int,
    db: Session = Depends(get_db)
):
    test = db.query(ReadingTest).filter(ReadingTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Reading test not found")
    
    passages = test.passages
    total_questions = sum(len(passage.get("questions", [])) for passage in passages)
    
    return {
        "id": test.id,
        "title": test.title,
        "type": test.type,
        "level": test.level,
        "passages": len(passages),
        "questions": total_questions,
        "timeLimit": test.time_limit,
        "status": test.status,
        "attempts": test.attempts,
        "avgScore": test.avg_score,
        "createdAt": test.created_at,
        "updatedAt": test.updated_at,
        "passages_data": passages
    }

@router.put("/reading-tests/{test_id}", response_model=ReadingTestSchema)
async def update_reading_test(
    test_id: int,
    test_update: ReadingTestUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    test = db.query(ReadingTest).filter(ReadingTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Reading test not found")
    
    # Update fields
    update_data = test_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "timeLimit":
            setattr(test, "time_limit", value)
        elif field == "passages_data":
            test.passages = value
        else:
            setattr(test, field, value)
    
    test.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(test)
    
    # Return in expected format
    passages = test.passages
    total_questions = sum(len(passage.get("questions", [])) for passage in passages)
    
    return {
        "id": test.id,
        "title": test.title,
        "type": test.type,
        "level": test.level,
        "passages": len(passages),
        "questions": total_questions,
        "timeLimit": test.time_limit,
        "status": test.status,
        "attempts": test.attempts,
        "avgScore": test.avg_score,
        "createdAt": test.created_at,
        "updatedAt": test.updated_at,
        "passages_data": passages
    }

@router.patch("/reading-tests/{test_id}/toggle-status", response_model=ReadingTestSchema)
async def toggle_reading_test_status(
    test_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    test = db.query(ReadingTest).filter(ReadingTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Reading test not found")
    
    # Toggle status
    if test.status == "Active":
        test.status = "Draft"
    else:
        test.status = "Active"
    
    test.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(test)
    
    # Return in expected format
    passages = test.passages
    total_questions = sum(len(passage.get("questions", [])) for passage in passages)
    
    return {
        "id": test.id,
        "title": test.title,
        "type": test.type,
        "level": test.level,
        "passages": len(passages),
        "questions": total_questions,
        "timeLimit": test.time_limit,
        "status": test.status,
        "attempts": test.attempts,
        "avgScore": test.avg_score,
        "createdAt": test.created_at,
        "updatedAt": test.updated_at,
        "passages_data": passages
    }

@router.delete("/reading-tests/{test_id}")
async def delete_reading_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    test = db.query(ReadingTest).filter(ReadingTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Reading test not found")
    
    db.delete(test)
    db.commit()
    return {"message": "Reading test deleted successfully"}

@router.post("/reading-tests/{test_id}/attempt")
async def record_reading_attempt(
    test_id: int,
    attempt: ReadingAttemptCreate,
    db: Session = Depends(get_db)
):
    test = db.query(ReadingTest).filter(ReadingTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Reading test not found")
    
    # Create attempt
    db_attempt = ReadingAttempt(
        test_id=test_id,
        student_id=attempt.studentId,
        score=attempt.score,
        time_spent=attempt.timeSpent or 0
    )
    
    db.add(db_attempt)
    
    # Update test statistics
    test.attempts += 1
    
    # Calculate new average score
    all_attempts = db.query(ReadingAttempt).filter(ReadingAttempt.test_id == test_id).all()
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

@router.get("/reading-tests/stats", response_model=TestStats)
async def get_reading_stats(db: Session = Depends(get_db)):
    total_tests = db.query(ReadingTest).count()
    active_tests = db.query(ReadingTest).filter(ReadingTest.status == "Active").count()
    
    # Get total attempts and average score
    attempts_query = db.query(ReadingAttempt)
    total_attempts = attempts_query.count()
    
    if total_attempts > 0:
        avg_score = db.query(ReadingAttempt.score).all()
        average_score = sum(score[0] for score in avg_score) / total_attempts
    else:
        average_score = 0.0
    
    return TestStats(
        totalTests=total_tests,
        activeTests=active_tests,
        totalAttempts=total_attempts,
        averageScore=average_score
    ) 