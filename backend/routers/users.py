from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User
from schemas import User as UserSchema
from auth import get_current_active_user

router = APIRouter()

@router.get("/users", response_model=List[UserSchema])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Only admin can see all users
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Users can only see their own profile, admin can see all
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: int,
    user_update: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Users can only update their own profile, admin can update all
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user fields
    for field, value in user_update.items():
        if hasattr(user, field):
            setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Only admin can delete users
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"} 