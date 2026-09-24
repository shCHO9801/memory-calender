# Memory Calendar

AI를 활용해 메모에서 일정 후보를 추출하고, 사용자가 확인·수정한 일정을 저장할 수 있는 개인 기록 및 일정 관리 프로젝트입니다.

## 주요 기능

- 회원가입 / 로그인
- JWT 기반 인증
- Note 작성 / 조회 / 수정 / 삭제
- AI 기반 일정 후보 추출
- 일정 후보 확인 및 수정
- Event 등록 / 조회 / 수정 / 삭제
- 인증 가드 및 로그아웃
- Docker Compose 기반 운영 환경 구성
- GitHub Actions 기반 CI/CD

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- pnpm

### Backend

- Spring Boot 4
- Java 21
- Gradle
- Spring Security
- Spring AI
- JWT

### AI

- Google Gemini
- Spring AI Google GenAI

### Database

- PostgreSQL 17
- Flyway

### Infrastructure

- Docker
- Docker Compose
- Caddy
- GitHub Actions

## Project Structure

```text
memory-calendar/
├── frontend/
├── backend/
├── compose.yaml
├── .env.example
└── README.md
```

## Environment Variables

프로젝트 실행을 위해 환경변수 설정이 필요합니다.

필요한 환경변수 목록은 루트의 `.env.example`을 참고합니다.

주요 환경변수:

```env
APP_FRONTEND_URL=

POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

SPRING_DATASOURCE_URL=
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=

JWT_SECRET=
GEMINI_API_KEY=

NEXT_PUBLIC_API_BASE_URL=
```

실제 비밀번호, JWT Secret, Gemini API Key 등은 Git에 커밋하지 않습니다.

## Local Development

### PostgreSQL

루트 디렉터리에서:

```bash
docker compose up -d postgres
```

### Backend

```bash
cd backend
./gradlew bootRun
```

기본 주소:

```text
http://localhost:8080
```

Health Check:

```text
http://localhost:8080/api/health
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

기본 주소:

```text
http://localhost:3000
```

## Production Docker

Frontend, Backend, PostgreSQL을 Docker Compose로 실행할 수 있습니다.

```bash
docker compose up -d --build
```

컨테이너 구성:

```text
Frontend
    ↓
Backend
    ↓
PostgreSQL
```

운영 환경에서는 PostgreSQL을 외부에 직접 공개하지 않고 Docker 내부 네트워크를 통해 Backend에서 접근합니다.

## Deployment

현재 개인 홈서버에 Docker Compose 기반으로 배포되어 있습니다.

```text
Client
  ↓
HTTPS
  ↓
Caddy
  ├── Frontend
  └── /api/* → Backend
               ↓
            PostgreSQL
```

서비스 주소:

```text
https://calendar.shhome.synology.me
```

## CI/CD

GitHub Actions를 사용합니다.

### CI

PR 및 주요 브랜치 변경 시 다음 검증을 자동 수행합니다.

Backend:

```text
Gradle Test
```

Frontend:

```text
pnpm install
Lint
Type Check
Production Build
```

### CD

`main` 브랜치에 변경이 반영되면 GitHub Actions가 홈서버에 SSH로 접속하여 자동 배포합니다.

```text
main push
→ GitHub Actions
→ Home Server SSH
→ git pull
→ docker compose up -d --build
```

## Release

현재 MVP 버전:

```text
v0.1.0
```

## MVP Flow

```text
회원가입
→ 로그인
→ Note 작성
→ AI 일정 추출
→ 일정 후보 확인 / 수정
→ Event 등록
→ Event 조회 / 수정 / 삭제
→ 로그아웃
```

## Known Limitations

현재 MVP 기준으로 다음 기능은 추후 개선 대상입니다.

- 별도 캘린더 UI 고도화
- 일정 중복 등록에 대한 서버 수준 방지
- Event 기간 조회 시 범위와 겹치는 일정 처리 개선
- Location 영속화
- Refresh Token 기반 인증
- 다중 Timezone 지원
- RAG 기반 메모 검색 및 활용
