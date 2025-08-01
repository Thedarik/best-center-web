from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import json

def create_tables():
    from database import engine
    Base.metadata.create_all(bind=engine)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(20), default="student")  # admin, teacher, student
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ListeningTest(Base):
    __tablename__ = "listening_tests"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False)
    level = Column(String(20), nullable=False)
    time_limit = Column(Integer, nullable=False)
    status = Column(String(20), default="Draft")  # Draft, Active, Inactive
    attempts = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)
    sections_data = Column(Text)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    attempts_rel = relationship("ListeningAttempt", back_populates="test")
    
    @property
    def sections(self):
        if self.sections_data:
            return json.loads(self.sections_data)
        return []
    
    @sections.setter
    def sections(self, value):
        self.sections_data = json.dumps(value)

class ReadingTest(Base):
    __tablename__ = "reading_tests"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False)
    level = Column(String(20), nullable=False)
    time_limit = Column(Integer, nullable=False)
    status = Column(String(20), default="Draft")  # Draft, Active, Inactive
    attempts = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)
    passages_data = Column(Text)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    attempts_rel = relationship("ReadingAttempt", back_populates="test")
    
    @property
    def passages(self):
        if self.passages_data:
            return json.loads(self.passages_data)
        return []
    
    @passages.setter
    def passages(self, value):
        self.passages_data = json.dumps(value)

class WritingTest(Base):
    __tablename__ = "writing_tests"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False)  # Task 1, Task 2
    category = Column(String(50), nullable=False)  # Academic, General Training
    prompt = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)
    time_limit = Column(Integer, nullable=False)
    word_limit = Column(Integer, nullable=False)
    criteria = Column(Text)  # JSON string for scoring criteria
    status = Column(String(20), default="Draft")  # Draft, Active, Inactive
    attempts = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    attempts_rel = relationship("WritingAttempt", back_populates="test")
    
    @property
    def scoring_criteria(self):
        if self.criteria:
            return json.loads(self.criteria)
        return {
            "taskAchievement": 25,
            "coherenceCohesion": 25,
            "lexicalResource": 25,
            "grammaticalRange": 25
        }
    
    @scoring_criteria.setter
    def scoring_criteria(self, value):
        self.criteria = json.dumps(value)

class ListeningAttempt(Base):
    __tablename__ = "listening_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("listening_tests.id"))
    student_id = Column(String(100))
    score = Column(Float, nullable=False)
    time_spent = Column(Integer, default=0)
    answers = Column(Text)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    test = relationship("ListeningTest", back_populates="attempts_rel")

class ReadingAttempt(Base):
    __tablename__ = "reading_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("reading_tests.id"))
    student_id = Column(String(100))
    score = Column(Float, nullable=False)
    time_spent = Column(Integer, default=0)
    answers = Column(Text)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    test = relationship("ReadingTest", back_populates="attempts_rel")

class WritingAttempt(Base):
    __tablename__ = "writing_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("writing_tests.id"))
    student_id = Column(String(100))
    score = Column(Float, nullable=False)
    time_spent = Column(Integer, default=0)
    essay = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    test = relationship("WritingTest", back_populates="attempts_rel") 