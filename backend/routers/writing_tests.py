from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import WritingTest, WritingAttempt
from schemas import (
    WritingTestCreate, 
    WritingTest as WritingTestSchema,
    WritingTestUpdate,
    WritingAttemptCreate,
    WritingAttempt as WritingAttemptSchema,
    TestStats
)
from auth import get_current_active_user
from datetime import datetime

router = APIRouter()

@router.get("/writing-tests", response_model=List[WritingTestSchema])
async def get_writing_tests(
    type: Optional[str] = Query(None, description="Filter by test type"),
    status: Optional[str] = Query(None, description="Filter by test status"),
    category: Optional[str] = Query(None, description="Filter by test category"),
    limit: Optional[int] = Query(100, description="Limit number of results"),
    offset: Optional[int] = Query(0, description="Offset for pagination"),
    db: Session = Depends(get_db)
):
    query = db.query(WritingTest)
    
    # Apply filters
    if type and type != "all":
        query = query.filter(WritingTest.type == type)
    if status and status != "all":
        query = query.filter(WritingTest.status == status)
    if category and category != "all":
        query = query.filter(WritingTest.category == category)
    
    # Apply pagination
    tests = query.offset(offset).limit(limit).all()
    
    # Convert to response format
    result = []
    for test in tests:
        criteria = test.scoring_criteria
        
        result.append({
            "id": test.id,
            "title": test.title,
            "type": test.type,
            "category": test.category,
            "prompt": test.prompt,
            "instructions": test.instructions,
            "timeLimit": test.time_limit,
            "wordLimit": test.word_limit,
            "status": test.status,
            "attempts": test.attempts,
            "avgScore": test.avg_score,
            "createdAt": test.created_at,
            "updatedAt": test.updated_at,
            "criteria": criteria
        })
    
    return result

@router.post("/writing-tests", response_model=WritingTestSchema)
async def create_writing_test(
    test: WritingTestCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    # Create test
    db_test = WritingTest(
        title=test.title,
        type=test.type,
        category=test.category,
        prompt=test.prompt,
        instructions=test.instructions,
        time_limit=test.timeLimit,
        word_limit=test.wordLimit,
        scoring_criteria=test.criteria.dict()
    )
    
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    
    # Return in expected format
    criteria = db_test.scoring_criteria
    return {
        "id": db_test.id,
        "title": db_test.title,
        "type": db_test.type,
        "category": db_test.category,
        "prompt": db_test.prompt,
        "instructions": db_test.instructions,
        "timeLimit": db_test.time_limit,
        "wordLimit": db_test.word_limit,
        "status": db_test.status,
        "attempts": db_test.attempts,
        "avgScore": db_test.avg_score,
        "createdAt": db_test.created_at,
        "updatedAt": db_test.updated_at,
        "criteria": criteria
    }

@router.get("/writing-tests/{test_id}", response_model=WritingTestSchema)
async def get_writing_test(
    test_id: int,
    db: Session = Depends(get_db)
):
    test = db.query(WritingTest).filter(WritingTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Writing test not found")
    
    criteria = test.scoring_criteria
    
    return {
        "id": test.id,
        "title": test.title,
        "type": test.type,
        "category": test.category,
        "prompt": test.prompt,
        "instructions": test.instructions,
        "timeLimit": test.time_limit,
        "wordLimit": test.word_limit,
        "status": test.status,
        "attempts": test.attempts,
        "avgScore": test.avg_score,
        "createdAt": test.created_at,
        "updatedAt": test.updated_at,
        "criteria": criteria
    }

@router.put("/writing-tests/{test_id}", response_model=WritingTestSchema)
async def update_writing_test(
    test_id: int,
    test_update: WritingTestUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    test = db.query(WritingTest).filter(WritingTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Writing test not found")
    
    # Update fields
    update_data = test_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "timeLimit":
            setattr(test, "time_limit", value)
        elif field == "wordLimit":
            setattr(test, "word_limit", value)
        elif field == "criteria":
            test.scoring_criteria = value.dict()
        else:
            setattr(test, field, value)
    
    test.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(test)
    
    # Return in expected format
    criteria = test.scoring_criteria
    return {
        "id": test.id,
        "title": test.title,
        "type": test.type,
        "category": test.category,
        "prompt": test.prompt,
        "instructions": test.instructions,
        "timeLimit": test.time_limit,
        "wordLimit": test.word_limit,
        "status": test.status,
        "attempts": test.attempts,
        "avgScore": test.avg_score,
        "createdAt": test.created_at,
        "updatedAt": test.updated_at,
        "criteria": criteria
    }

@router.patch("/writing-tests/{test_id}/toggle-status", response_model=WritingTestSchema)
async def toggle_writing_test_status(
    test_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    test = db.query(WritingTest).filter(WritingTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Writing test not found")
    
    # Toggle status
    if test.status == "Active":
        test.status = "Draft"
    else:
        test.status = "Active"
    
    test.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(test)
    
    # Return in expected format
    criteria = test.scoring_criteria
    return {
        "id": test.id,
        "title": test.title,
        "type": test.type,
        "category": test.category,
        "prompt": test.prompt,
        "instructions": test.instructions,
        "timeLimit": test.time_limit,
        "wordLimit": test.word_limit,
        "status": test.status,
        "attempts": test.attempts,
        "avgScore": test.avg_score,
        "createdAt": test.created_at,
        "updatedAt": test.updated_at,
        "criteria": criteria
    }

@router.delete("/writing-tests/{test_id}")
async def delete_writing_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    test = db.query(WritingTest).filter(WritingTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Writing test not found")
    
    db.delete(test)
    db.commit()
    return {"message": "Writing test deleted successfully"}

@router.post("/writing-tests/{test_id}/attempt")
async def record_writing_attempt(
    test_id: int,
    attempt: WritingAttemptCreate,
    db: Session = Depends(get_db)
):
    test = db.query(WritingTest).filter(WritingTest.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Writing test not found")
    
    # Create attempt
    db_attempt = WritingAttempt(
        test_id=test_id,
        student_id=attempt.studentId,
        score=attempt.score,
        time_spent=attempt.timeSpent or 0,
        essay=attempt.essay
    )
    
    db.add(db_attempt)
    
    # Update test statistics
    test.attempts += 1
    
    # Calculate new average score
    all_attempts = db.query(WritingAttempt).filter(WritingAttempt.test_id == test_id).all()
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
        "essay": db_attempt.essay,
        "created_at": db_attempt.created_at
    }

@router.get("/writing-tests/stats", response_model=TestStats)
async def get_writing_stats(db: Session = Depends(get_db)):
    total_tests = db.query(WritingTest).count()
    active_tests = db.query(WritingTest).filter(WritingTest.status == "Active").count()
    
    # Get total attempts and average score
    attempts_query = db.query(WritingAttempt)
    total_attempts = attempts_query.count()
    
    if total_attempts > 0:
        avg_score = db.query(WritingAttempt.score).all()
        average_score = sum(score[0] for score in avg_score) / total_attempts
    else:
        average_score = 0.0
    
    return TestStats(
        totalTests=total_tests,
        activeTests=active_tests,
        totalAttempts=total_attempts,
        averageScore=average_score
    ) 