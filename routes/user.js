const express = require("express");

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.send("GET user");
  })
  .post((req, res) => {
    res.send("POST user");
  })
  .put((req, res) => {
    res.send("PUT user");
  })
  .delete((req, res) => {
    res.send("DELETE user");
  });

module.exports = router;
