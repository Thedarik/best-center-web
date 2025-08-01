# IELTS Test Management API

Bu FastAPI asosida yaratilgan IELTS test tizimi uchun backend API.

## Xususiyatlar

- **Listening Tests** - Audio testlarini boshqarish
- **Reading Tests** - O'qish testlarini boshqarish  
- **Writing Tests** - Yozish testlarini boshqarish
- **User Management** - Foydalanuvchilarni boshqarish
- **Authentication** - JWT token asosida autentifikatsiya
- **Statistics** - Test statistikalarini ko'rish

## O'rnatish

1. **Python virtual environment yarating:**
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# yoki
venv\Scripts\activate  # Windows
```

2. **Dependencies o'rnating:**
```bash
pip install -r requirements.txt
```

3. **Environment faylini sozlang:**
```bash
cp env.example .env
# .env faylini tahrirlang
```

## Ishga tushirish

```bash
# Development mode
python main.py

# yoki
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Foydalanuvchi ro'yxatdan o'tkazish
- `POST /api/auth/token` - Login (token olish)
- `GET /api/auth/me` - Joriy foydalanuvchi ma'lumotlari

### Users
- `GET /api/users` - Barcha foydalanuvchilar (admin)
- `GET /api/users/{id}` - Foydalanuvchi ma'lumotlari
- `PUT /api/users/{id}` - Foydalanuvchi ma'lumotlarini yangilash
- `DELETE /api/users/{id}` - Foydalanuvchini o'chirish (admin)

### Listening Tests
- `GET /api/listening-tests` - Barcha listening testlar
- `POST /api/listening-tests` - Yangi listening test yaratish
- `GET /api/listening-tests/{id}` - Listening test ma'lumotlari
- `PUT /api/listening-tests/{id}` - Listening testni yangilash
- `PATCH /api/listening-tests/{id}/toggle-status` - Status o'zgartirish
- `DELETE /api/listening-tests/{id}` - Listening testni o'chirish
- `POST /api/listening-tests/{id}/attempt` - Natija yozish
- `GET /api/listening-tests/stats` - Listening test statistikasi

### Reading Tests
- `GET /api/reading-tests` - Barcha reading testlar
- `POST /api/reading-tests` - Yangi reading test yaratish
- `GET /api/reading-tests/{id}` - Reading test ma'lumotlari
- `PUT /api/reading-tests/{id}` - Reading testni yangilash
- `PATCH /api/reading-tests/{id}/toggle-status` - Status o'zgartirish
- `DELETE /api/reading-tests/{id}` - Reading testni o'chirish
- `POST /api/reading-tests/{id}/attempt` - Natija yozish
- `GET /api/reading-tests/stats` - Reading test statistikasi

### Writing Tests
- `GET /api/writing-tests` - Barcha writing testlar
- `POST /api/writing-tests` - Yangi writing test yaratish
- `GET /api/writing-tests/{id}` - Writing test ma'lumotlari
- `PUT /api/writing-tests/{id}` - Writing testni yangilash
- `PATCH /api/writing-tests/{id}/toggle-status` - Status o'zgartirish
- `DELETE /api/writing-tests/{id}` - Writing testni o'chirish
- `POST /api/writing-tests/{id}/attempt` - Natija yozish
- `GET /api/writing-tests/stats` - Writing test statistikasi

## Database

SQLite database ishlatiladi. Database fayli `ielts_tests.db` nomi bilan yaratiladi.

### Jadvallar:
- `users` - Foydalanuvchilar
- `listening_tests` - Listening testlar
- `reading_tests` - Reading testlar  
- `writing_tests` - Writing testlar
- `listening_attempts` - Listening natijalari
- `reading_attempts` - Reading natijalari
- `writing_attempts` - Writing natijalari

## Frontend bilan integratsiya

Frontend Next.js da `NEXT_PUBLIC_API_URL=http://localhost:8000/api` environment variable orqali backend ga ulanish mumkin.

## Swagger Documentation

API documentation: `http://localhost:8000/docs`

## Foydali komandalar

```bash
# Server ishga tushirish
python main.py

# Health check
curl http://localhost:8000/api/health

# Database yaratish
python -c "from models import create_tables; create_tables()"

# Test o'tkazish
pytest
``` 