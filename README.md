# Memory Calendar

AI를 활용해 메모에서 일정 정보를 추출하고, 사용자가 확인한 일정을 캘린더에 저장하는 개인 기록·일정 관리 프로젝트입니다.

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- pnpm

### Backend
- Spring Boot
- Java 21
- Gradle

### Database
- PostgreSQL 예정

## Local Development

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
- http://localhost:3000
```

### Backend
```bash
cd backend
./gradlew bootRun
- http://localhost:8080
- Health Check: http://localhost:8080/api/health
```
## Ports
- Frontend: 3000
- Backend: 8080
- PostgreSQL: 5432 (예정)널