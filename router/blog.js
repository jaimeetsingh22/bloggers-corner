const express = require("express");
// const multer = require("multer");
// const path = require("path");
const router = express.Router();

const Blog = require("../model/blog");
const Comment = require("../model/comment");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve(`./public/uploads`));
//   },

//   filename: function (req, file, cb) {
//     const fileName = `${Date.now()}-${file.originalname}`;
//     cb(null, fileName);
//   },
// });

// const upload = multer({ storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", {
    user: req.user,
  });
});

router.post("/", /* upload.single("coverImage"), */ async (req, res) => {
  const { title, body,imgURL } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImage: imgURL,
  });

  return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy"); // iss populate method se ye hoga ki jo refrence id humne uss model me diya hai ye uss id se juda data object ko return kar dega means wo person ka object return kar dega
    const comments = await Comment.find({blogId:req.params.id}).populate('createdBy');
    // console.log("blog",blog);
    // console.log(comments);
    res.render("blog", {
      user: req.user,
      blog,
      comments,
    });
  } catch (error) {
    console.log("there is some error: ", error);
  }
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
