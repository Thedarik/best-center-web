from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Base schemas
class UserBase(BaseModel):
    username: str
    email: str
    role: str = "student"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Listening Test Schemas
class ListeningQuestion(BaseModel):
    type: str
    question: str
    options: Optional[List[str]] = None
    correct: Optional[int] = None
    correctAnswer: Optional[str] = None
    wordLimit: Optional[int] = None
    alternativeAnswers: Optional[List[str]] = None
    startTime: Optional[int] = None
    endTime: Optional[int] = None

class ListeningSection(BaseModel):
    title: str
    audioUrl: str
    transcript: Optional[str] = None
    questions: List[ListeningQuestion]

class ListeningTestCreate(BaseModel):
    title: str
    type: str
    level: str
    timeLimit: int
    sections_data: List[ListeningSection]

class ListeningTestUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    timeLimit: Optional[int] = None
    sections_data: Optional[List[ListeningSection]] = None
    status: Optional[str] = None

class ListeningTest(BaseModel):
    id: int
    title: str
    type: str
    level: str
    sections: int
    questions: int
    timeLimit: int
    status: str
    attempts: int
    avgScore: float
    createdAt: datetime
    updatedAt: Optional[datetime] = None
    sections_data: List[ListeningSection]

    class Config:
        from_attributes = True

class ListeningAttemptCreate(BaseModel):
    score: float
    timeSpent: Optional[int] = None
    studentId: Optional[str] = None

class ListeningAttempt(BaseModel):
    id: int
    test_id: int
    student_id: Optional[str] = None
    score: float
    time_spent: int
    created_at: datetime

    class Config:
        from_attributes = True

# Reading Test Schemas
class ReadingQuestion(BaseModel):
    type: str
    question: str
    options: Optional[List[str]] = None
    correct: Optional[int] = None
    sentence: Optional[str] = None
    correctAnswer: Optional[str] = None
    wordLimit: Optional[int] = None
    truefalse: Optional[str] = None
    headings: Optional[List[str]] = None
    matchingOptions: Optional[List[str]] = None
    alternativeAnswers: Optional[List[str]] = None

class ReadingPassage(BaseModel):
    title: str
    text: str
    questions: List[ReadingQuestion]

class ReadingTestCreate(BaseModel):
    title: str
    type: str
    level: str
    timeLimit: int
    passages_data: List[ReadingPassage]

class ReadingTestUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    timeLimit: Optional[int] = None
    passages_data: Optional[List[ReadingPassage]] = None
    status: Optional[str] = None

class ReadingTest(BaseModel):
    id: int
    title: str
    type: str
    level: str
    passages: int
    questions: int
    timeLimit: int
    status: str
    attempts: int
    avgScore: float
    createdAt: datetime
    updatedAt: Optional[datetime] = None
    passages_data: List[ReadingPassage]

    class Config:
        from_attributes = True

class ReadingAttemptCreate(BaseModel):
    score: float
    timeSpent: Optional[int] = None
    studentId: Optional[str] = None

class ReadingAttempt(BaseModel):
    id: int
    test_id: int
    student_id: Optional[str] = None
    score: float
    time_spent: int
    created_at: datetime

    class Config:
        from_attributes = True

# Writing Test Schemas
class WritingCriteria(BaseModel):
    taskAchievement: int = 25
    coherenceCohesion: int = 25
    lexicalResource: int = 25
    grammaticalRange: int = 25

class WritingTestCreate(BaseModel):
    title: str
    type: str  # Task 1, Task 2
    category: str  # Academic, General Training
    prompt: str
    instructions: str
    timeLimit: int
    wordLimit: int
    criteria: WritingCriteria

class WritingTestUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    prompt: Optional[str] = None
    instructions: Optional[str] = None
    timeLimit: Optional[int] = None
    wordLimit: Optional[int] = None
    criteria: Optional[WritingCriteria] = None
    status: Optional[str] = None

class WritingTest(BaseModel):
    id: int
    title: str
    type: str
    category: str
    prompt: str
    instructions: str
    timeLimit: int
    wordLimit: int
    status: str
    attempts: int
    avgScore: float
    createdAt: datetime
    updatedAt: Optional[datetime] = None
    criteria: WritingCriteria

    class Config:
        from_attributes = True

class WritingAttemptCreate(BaseModel):
    score: float
    timeSpent: Optional[int] = None
    studentId: Optional[str] = None
    essay: Optional[str] = None

class WritingAttempt(BaseModel):
    id: int
    test_id: int
    student_id: Optional[str] = None
    score: float
    time_spent: int
    essay: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Statistics schemas
class TestStats(BaseModel):
    totalTests: int
    activeTests: int
    totalAttempts: int
    averageScore: float

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None 