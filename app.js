const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
//# Nunjucks 설정
const nunjucks = require("nunjucks");

dotenv.config();
const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const errorRouter = require("./routes/error");

//# 설정
// express 모듈을 사용하여 서버를 생성합니다.
const app = express();
app.set("port", process.env.PORT || 3000);

// # 퍼그 설정
// app.set("views", path.join(__dirname, "views")); // views 폴더 경로 설정
// app.set("view engine", "pug"); // 뷰 엔진 설정
//# Nunjucks 설정
app.set("view engine", "html"); // 뷰 엔진 설정
nunjucks.configure("views", {
  express: app,
  watch: true, // 개발 모드
});

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    morgan("combined")(req, res, next); // 운영용 로그
  }
  if (process.env.NODE_ENV === "development") {
    morgan("dev")(req, res, next); // 개발용 로그
  }
});
app.use("/", express.static(path.join(__dirname, "public"))); // 정적 파일 미들웨어

app.use(express.json()); // JSON 파싱 미들웨어
app.use(express.urlencoded({ extended: false })); // URL-encoded 파싱 미들웨어, extended: true로 설정하면 qs 모듈을 사용하여 중첩된 객체를 지원합니다.
//extended: false로 설정하면 querystring 모듈을 사용하여 중첩된 객체를 지원하지 않습니다.
app.use(bodyParser.raw()); // Raw 형식의 데이터 파싱 미들웨어
app.use(bodyParser.text()); // Text 형식의 데이터 파싱 미들웨어

app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 파싱 미들웨어
app.use(
  session({
    resave: false, // 세션이 수정되지 않아도 세션을 다시 저장할지 여부
    saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true, // 자바스크립트에서 접근 불가
      secure: false, // HTTPS를 사용할 경우 true로 설정
    },
    name: "session-cookie",
  })
);

app.use("/", indexRouter); // 라우터 미들웨어
app.use("/user", userRouter); // 라우터 미들웨어
app.use("/error", errorRouter); // 라우터 미들웨어

const multer = require("multer");
const fs = require("fs");

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/"); // 업로드할 경로
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자
      done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일 이름
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "multipart.html"));
});
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file); // 업로드된 파일 정보
  console.log(req.body); // 폼 데이터
  res.send("업로드 완료");
});

app.use((req, res, next) => {
  console.log("모든 요청에 다 실행됩니다.");
  // res.status(404).send("404 Not Found");
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404; // 에러 상태 코드
  next(error); // 에러 처리 미들웨어로 넘깁니다.
  // next(); // 다음 미들웨어로 넘어갑니다.
});
app.get(
  "/",
  (req, res, next) => {
    console.log("GET / 요청에서만 실행됩니다.");
    res.locals.data = "Hello, World!"; // res.locals에 데이터를 저장합니다.
    next(); // 다음 미들웨어로 넘어갑니다.
  },
  (req, res) => {
    console.log("로컬 데이터: ", res.locals.data);
    //* 세션 설정
    // req.session.name = "jungwoo"; // 세션에 name 속성 추가
    // req.sessionID; // 세션 ID
    // console.log(req.session); // 세션 정보
    // req.session.destroy(); // 세션 모두 삭제

    //* 쿠키 설정
    // res.cookie("name", "jungwoo", {
    //   expires: new Date(Date.now() + 900000), // 15분 후 만료
    //   httpOnly: true, // 자바스크립트에서 접근 불가
    //   secure: false, // HTTPS를 사용할 경우 true로 설정
    //   signed: true, // 서명된 쿠키
    // });
    //* 쿠키 삭제
    // res.clearCookie("name", "jungwoo", {
    //   httpOnly: true,
    //   secure: true,
    //   signed: true,
    // });
    res.send("Hello, Cookie!");
    // throw new Error("에러는 에러 처리 미들웨어로 갑니다.");
  }
);
app.use((err, req, res, next) => {
  // console.error(err);
  // res.status(500).send(err.message);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error"); // error.html 파일을 렌더링합니다.
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
