require('dotenv').config();
const express = require("express");
const path = require("path");
const userRoute = require("./router/user");
const blogRoute = require("./router/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const {
  RestrictUserToVisiteRouteAfterLogIn,
} = require("./middleware/restrictParams");
const Blog = require("./model/blog");

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongoDB connected"));

const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");

app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false })); // for access req.body and the extended false means simple key value pairs will be passed and extended: true means the data is in nested objects
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(RestrictUserToVisiteRouteAfterLogIn());
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", { user: req.user, blog: allBlogs });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}/`);
});
