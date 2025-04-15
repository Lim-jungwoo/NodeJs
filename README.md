# 🚀 Express 프로젝트 시작하기

이 문서는 기본적인 Express 프로젝트의 구조와 설치 방법, 실행 방법을 안내합니다.

---

## 📦 프로젝트 구조

```
project-root/
├── src/
│   ├── routes/           # 라우트 정의
│   ├── controllers/      # 요청 처리 로직
│   ├── middlewares/      # 미들웨어
│   ├── services/         # 비즈니스 로직
│   ├── utils/            # 유틸 함수
│   └── app.js            # Express 앱 생성
├── public/               # 정적 파일
├── scripts/              # 자동화 스크립트
├── .env                  # 환경 변수 파일
├── .gitignore            # Git 제외 파일 목록
├── package.json          # 패키지 정보 및 스크립트
└── README.md             # 프로젝트 설명
```

---

## 📦 설치 방법

```bash
npm install
```

---

## 🚀 실행 방법

### 개발 모드

```bash
npm run dev
```

### 프로덕션 모드

```bash
npm run start
```

---

## ⚙️ 주요 스크립트

```json
"scripts": {
  "dev": "nodemon src/app.js",
  "start": "node src/app.js"
}
```

---

## 🧪 테스트

테스트 도구는 Jest 또는 Supertest 등을 사용할 수 있으며,
추후에 `tests/` 디렉토리를 추가하여 정리할 수 있습니다.

---

## 📂 환경 변수 예시 (`.env`)

```
PORT=3000
NODE_ENV=development
```

---

## ✨ 확장 아이디어

- Swagger로 API 문서화
- ESLint, Prettier 설정
- helmet, cors 등 보안 미들웨어 추가
- 로그 관리 (morgan 또는 winston)

---

Express로 빠르게 REST API 서버를 만들 수 있으며,
위 구조를 기반으로 점진적으로 기능을 확장해 나가면 좋습니다 🙌
