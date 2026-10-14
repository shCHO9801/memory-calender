# Memory Calendar

AI를 활용해 자연어 메모를 분석하고, 일정(EVENT)과 할 일(TODO) 후보를 추출한 뒤 사용자가 확인·수정하여 실제 일정과 할 일로 등록할 수 있는 개인 기록 및 일정 관리 서비스입니다.

사용자가 작성한 Note를 AI가 직접 저장하지 않고,
AI는 후보만 제안하며 최종 등록은 사용자가 확인한 뒤 수행하는 구조를 사용합니다.

---

## 주요 기능

### Authentication

- 회원가입
- 이메일 중복 확인
- 로그인 / 로그아웃
- JWT 기반 인증
- JWT `exp` 기반 만료 여부 사전 확인
- API `401 Unauthorized` 발생 시 access token 제거 및 로그인 페이지 이동
- 보호 라우트 공통 AuthGuard 적용

### Notes

- Note 작성 / 조회 / 수정 / 삭제
- AI 기반 Note 분류
- EVENT / TODO 후보 추출
- AI 후보 수정
- 사용자 확인 후 Event / Todo 등록
- `needsConfirmation` 후보 표시
- Note 삭제 후 이미 생성된 Event / Todo 유지

### Events

- Event 직접 생성
- Event 조회 / 수정 / 삭제
- 장소(Location) 관리
- List View
- Month Calendar View
- 일정 상세 조회
- 지난 일정 표시 / 숨기기
- 월별 일정 요약

### Todos

- Todo 직접 생성
- Todo 조회 / 수정 / 삭제
- 완료 / 미완료 상태 변경
- 마감일 관리
- TODO / DONE 필터

### Dashboard

- 오늘 일정 조회
- 진행 중인 Todo 조회
- 월간 캘린더
- Dashboard에서 Event 상세 조회
- 빠른 메모 진입

### UI / UX

- 공통 Toast
- 공통 ErrorMessage
- 공통 LoadingState
- 공통 EmptyState
- 데스크톱 Sidebar 접기 / 펼치기
- 모바일 햄버거 메뉴
- 모바일 Sidebar Overlay
- 반응형 레이아웃

### Infrastructure

- Docker Compose 기반 실행 환경
- PostgreSQL + Flyway
- Caddy Reverse Proxy
- GitHub Actions 기반 CI/CD
- 개인 홈서버 배포

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- FullCalendar
- pnpm
- Node.js 22

## Backend

- Spring Boot 4
- Java 21
- Gradle
- Spring Security
- Spring AI
- JWT

## AI

- Google Gemini
- Spring AI Google GenAI

사용 모델:

```text
gemini-3.5-flash-lite
```

## Database

- PostgreSQL 17
- Flyway

## Infrastructure

- Docker
- Docker Compose
- Caddy
- GitHub Actions

---

# Project Structure

```text
memory-calendar/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── (main)/
│   │   │       ├── dashboard/
│   │   │       ├── events/
│   │   │       ├── todos/
│   │   │       └── notes/
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── events/
│   │   │   ├── notes/
│   │   │   └── todo/
│   │   │
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   │
│   └── package.json
│
├── backend/
│   └── src/
│       └── main/
│           ├── java/
│           └── resources/
│               └── db/migration/
│
├── compose.yaml
├── .env.example
└── README.md
```

---

# Core Architecture

Memory Calendar의 핵심 원칙은:

```text
AI는 후보를 제안하고,
최종 저장은 사용자가 결정한다.
```

입니다.

전체 흐름:

```text
User
 ↓
Note 작성
 ↓
AI Classification
 ↓
EVENT / TODO 후보 생성
 ↓
사용자 확인 / 수정
 ↓
Classification Confirm
 ↓
Event / Todo 생성
```

AI가 직접 Event나 Todo를 데이터베이스에 저장하지 않습니다.

---

# AI Classification Flow

## 1. Note 작성

사용자가 자유 형식의 메모를 작성합니다.

예:

```text
내일 오후 3시에 수원역에서 철수 만나고
금요일까지 보고서 제출해야 함
```

---

## 2. AI 분류 요청

```http
POST /api/notes/{noteId}/classification
```

AI는 Note 내용을 분석하여 EVENT 또는 TODO 후보를 반환합니다.

예:

```json
{
  "noteId": 14,
  "items": [
    {
      "type": "EVENT",
      "content": "철수 만나기",
      "startAt": "2026-10-15T15:00:00",
      "endAt": null,
      "dueAt": null,
      "location": "수원역",
      "needsConfirmation": false
    },
    {
      "type": "TODO",
      "content": "보고서 제출",
      "startAt": null,
      "endAt": null,
      "dueAt": "2026-10-16T23:59:59",
      "location": null,
      "needsConfirmation": true
    }
  ]
}
```

후보 타입:

```text
EVENT
TODO
```

---

## 3. 사용자 확인 및 수정

사용자는 AI가 생성한 후보를 확인하고 필요한 내용을 직접 수정할 수 있습니다.

EVENT 후보:

```text
내용
시작 시간
종료 시간
장소
```

TODO 후보:

```text
내용
마감 시간
```

추가 확인이 필요한 후보는:

```text
확인 필요
```

상태로 표시됩니다.

---

## 4. 후보 확정

```http
POST /api/notes/{noteId}/classification/confirm
```

사용자가 확인한 후보만 서버에 전달합니다.

서버는 후보 타입에 따라 실제 Event 또는 Todo를 생성합니다.

---

# Note Delete Policy

Note는 Event / Todo 생성의 원본 메모 역할을 합니다.

하지만 Note를 삭제하더라도 이미 확정된 Event / Todo는 유지합니다.

```text
Note 삭제
 ↓
Event 유지
events.note_id = NULL

Todo 유지
todos.note_id = NULL
```

이를 위해 Foreign Key 정책에:

```sql
ON DELETE SET NULL
```

을 사용합니다.

관련 Flyway migration:

```text
V4
→ events.note_id

V5
→ todos.note_id
```

---

# Authentication Flow

## 보호 라우트

다음 페이지는 `(main)` 영역에 포함되어 있으며 AuthGuard가 적용됩니다.

```text
/dashboard
/events
/todos
/notes
```

인증 흐름:

```text
페이지 접근
 ↓
access token 존재 여부 확인
 ↓
JWT exp 확인
 ↓
만료됨
→ token 제거
→ /login

유효함
→ 페이지 렌더링
```

API 요청 이후 서버가 `401 Unauthorized`를 반환하는 경우:

```text
401
→ access token 제거
→ /login
```

즉 인증은:

```text
Frontend JWT 만료 사전 검사
+
Backend 401 최종 검증
```

두 단계로 처리합니다.

---

# API Client

Frontend의 HTTP 요청은 공통 `apiFetch()`를 사용합니다.

```text
Page / Component
 ↓
Domain API
 ↓
apiFetch
 ↓
Backend
```

공통 처리:

```text
API Base URL
Authorization Header
Content-Type
API Error
401 Unauthorized
204 No Content
JSON Response
```

주요 API 모듈:

```text
src/lib/
├── api.ts
├── auth.ts
├── auth-storage.ts
├── events-api.ts
├── todos-api.ts
├── note.ts
└── schedule.ts
```

---

# Dashboard

Dashboard에서는 다음 정보를 한 화면에서 확인할 수 있습니다.

```text
월간 Calendar
오늘 일정
진행 중 Todo
Quick Memo
```

월간 Calendar의 Event를 클릭하면 Dashboard 전용 상세 Modal에서 내용을 확인할 수 있습니다.

Dashboard에서는 일정 수정/삭제를 제공하지 않고,
요약 및 조회 중심으로 사용합니다.

---

# Events

Events 페이지는 두 가지 View를 제공합니다.

## List View

기본 View입니다.

```text
월별 일정 그룹
예정 일정
지난 일정
전체 일정 요약
```

지난 일정은 기본적으로 접혀 있으며 사용자가 필요할 때 펼칠 수 있습니다.

## Month View

FullCalendar를 사용한 월간 Calendar View입니다.

지원 기능:

```text
월 이동
날짜 클릭 → 일정 생성
Event 클릭 → 상세 조회
Event 수정
Event 삭제
```

모바일에서도 Calendar 컴포넌트를 유지한 상태에서 데이터만 갱신하여
월 변경 시 불필요한 unmount / mount 반복을 방지합니다.

---

# Todos

Todo 페이지에서는 다음 기능을 제공합니다.

```text
Todo 생성
Todo 수정
Todo 삭제
Todo 완료
완료 취소
마감일 관리
```

Frontend에서는 현재:

```text
TODO
DONE
```

상태를 중심으로 관리합니다.

Backend에는 추가 상태로:

```text
IN_PROGRESS
```

가 존재합니다.

---

# Common Feedback UI

여러 페이지에서 동일한 사용자 피드백을 제공하기 위해 공통 컴포넌트를 사용합니다.

```text
src/components/common/
├── ToastProvider.tsx
├── ErrorMessage.tsx
├── LoadingState.tsx
└── EmptyState.tsx
```

적용 페이지:

```text
Notes
Todos
Events
Dashboard
```

성공 작업은 Toast로 표시하고,
API 오류 발생 시 페이지 전체를 제거하지 않고 ErrorMessage를 표시합니다.

---

# Responsive Navigation

## Desktop

Sidebar는 사용자가 직접 접거나 펼칠 수 있습니다.

```text
Expanded
→ 224px

Collapsed
→ 72px
→ 아이콘 메뉴 유지
```

## Mobile

모바일에서는 Sidebar 대신 상단 Header가 표시됩니다.

```text
☰ Memory Calendar
```

햄버거 메뉴를 누르면 Sidebar Overlay가 열립니다.

닫기 방식:

```text
X 버튼
바깥 영역 클릭
메뉴 선택
ESC
```

---

# Environment Variables

프로젝트 실행을 위해 환경변수 설정이 필요합니다.

필요한 환경변수 목록은 루트의:

```text
.env.example
```

을 참고합니다.

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

---

# Local Development

## PostgreSQL

루트 디렉터리에서:

```bash
docker compose up -d postgres
```

---

## Backend

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

Backend Test:

```bash
./gradlew test
```

---

## Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

기본 주소:

```text
http://localhost:3000
```

Frontend 검증:

```bash
pnpm lint
pnpm build
```

---

# Production Docker

Frontend, Backend, PostgreSQL을 Docker Compose로 실행할 수 있습니다.

```bash
docker compose up -d --build
```

구성:

```text
Frontend
   ↓
Backend
   ↓
PostgreSQL
```

운영 환경에서는 PostgreSQL을 외부에 직접 공개하지 않고,
Docker 내부 네트워크를 통해 Backend에서 접근합니다.

---

# Deployment

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

---

# CI/CD

GitHub Actions를 사용합니다.

## CI

PR 및 주요 브랜치 변경 시 다음 검증을 수행합니다.

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

---

## CD

`main` 브랜치에 변경이 반영되면 GitHub Actions가 홈서버에 SSH로 접속하여 자동 배포합니다.

```text
main push
→ GitHub Actions
→ Home Server SSH
→ git pull
→ docker compose up -d --build
```

---

# Main User Flow

```text
회원가입
 ↓
로그인
 ↓
Dashboard
 ↓
Note 작성
 ↓
AI Classification
 ↓
EVENT / TODO 후보 확인
 ↓
후보 수정
 ↓
Classification Confirm
 ↓
Event / Todo 생성
 ↓
Events / Todos에서 관리
```

사용자는 AI 기능을 거치지 않고 직접 Event 또는 Todo를 등록할 수도 있습니다.

---

# Validation

Frontend:

```bash
pnpm lint
pnpm build
```

Backend:

```bash
./gradlew test
```

주요 수동 테스트:

```text
회원가입
로그인
로그아웃

JWT 만료 처리
401 처리

Note 작성
Note 수정
Note 삭제

AI Classification
EVENT 후보 수정 / 등록
TODO 후보 수정 / 등록

Event 생성 / 조회 / 수정 / 삭제
Todo 생성 / 조회 / 수정 / 삭제 / 완료

Dashboard 조회
Dashboard Event 상세 조회

Desktop Sidebar 접기 / 펼치기
Mobile Sidebar
Events Month 모바일 화면
```

---

# Known Limitations

현재 개선 가능 항목:

- Refresh Token 기반 인증
- 다중 Timezone 지원
- 일정 중복 등록에 대한 서버 수준 방지
- AI 후보 일괄 확인 UX
- Event / Todo 검색 및 필터 고도화
- RAG 기반 Note 검색 및 활용
- 사용자 설정 기능
- 알림 / Reminder 기능

---

# Release

현재 프로젝트는 MVP 이후 Dashboard / Todo / Events / Notes / 인증 / 반응형 UI까지 확장된 상태입니다.
