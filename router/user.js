const express = require("express");
const USER = require("../model/user");

const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", async (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  await USER.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await USER.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Invalid Password Or Email",
    });
  }
});

router.get("/logout", (req, res) => {
  if (!req.cookies.token) {
    return res.redirect("/");
  }

  res.clearCookie("token");
  return res.redirect("/");
});

module.exports = router;
