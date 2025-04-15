const express = require("express");

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    // res.send("GET /");
    res.render("error", {
      message: "템플릿 엔진 에러!",
      error: { status: 444, stack: "stack" },
    }); // 템플릿 엔진 사용
  })
  .post((req, res) => {
    res.send("POST /");
  })
  .put((req, res) => {
    res.send("PUT /");
  })
  .delete((req, res) => {
    res.send("DELETE /");
  });

module.exports = router;
