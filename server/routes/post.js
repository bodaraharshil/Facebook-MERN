const express = require("express");
const multer = require("multer");
const router = express.Router();

const Authentic = require("../auth/authentic");
const Addpost = require("../models/post");
const User = require("../models/user");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  },
});

var upload = multer({ storage: storage });

router.get("/allpost",(req, res) => {
  
  const user = req.user;
  console.log("sdsdsdsd",user);
  Addpost.find()
    .populate("Postedby", "_id Username Email Photo")
    .then((data) => {
      res.json({ data });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/addpost", upload.single("Photo"), Authentic, (req, res) => {
  const Photo = req.file.filename;
  // console.log('req.body.Photo', req.file.filename);
  console.log(Photo);
  const { Title, Body } = req.body;
  if (!Title || !Body) {
    return res.status(422).json({
      error: "please add all field",
    });
  }
  req.user.Password = undefined;
  req.user.Cpassword = undefined;
  const addpost = new Addpost({
    Title,
    Body,
    Photo,
    Postedby: req.user,
    Postedusername: req.user.Username,
  });
  addpost
    .save()
    .then((data) => {
      // console.log("hihihihihihihi",data);
      return res.status(200).json({
        msg: "successfuly add post",
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/mypost", Authentic, (req, res) => {
  const user = req.user;
  const data = Addpost.find({ Postedby: user._id });
  data
    .then((data) => {
      res.json({ data });
      // res.json("success");
    })
    .catch((error) => {
      res.json({
        error: "no post avilable",
      });
    });
});

router.put("/like", Authentic, (req, res) => {
  Addpost.findOneAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({
        error: err,
      });
    } else {
      res.json(result);
    }
  });
});

router.delete("/deletepost/:id", Authentic, (req, res) => {
  Addpost.findOne({ _id: req.params.id })
    .populate("Postedby", "_id")
    .exec((error, post) => {
      if (error || !post) {
        return res.status(422).json({
          error: error,
        });
      } else {
        if (post.Postedby._id.toString() === req.user._id.toString()) {
          post
            .remove()
            .then((data) => {
              res.status(200).json({
                message: "successfuly deleted",
              });
            })
            .catch((error) => {
              console.log("errorerror", error);
            });
        }
      }
    });
});

router.put("/unlike", Authentic, (req, res) => {
  Addpost.findOneAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({
        error: err,
      });
    } else {
      res.json(result);
    }
  });
});

router.put("/comment", Authentic, (req, res) => {
  // const {com}=req.body.com;
  // console.log(req.body.postId);
  console.log("req.body.text", req.body.text);
  const comment = {
    text: req.body.text,
    Postedby: req.user._id,
    Postedus: req.user.Username,
  };
  Addpost.findOneAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.Postedby", "_id Username")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({
          error: err,
        });
      } else {
        res.json(result);
        //  console.log(result);
      }
    });
});

router.post(
  "/userupdateprofile",
  Authentic,
  upload.single("Photo"),
  (req, res) => {
    // id = req.params.id;
    var id = req.user._id;
    if (req.file) {
      const updateimage = {
        Photo: req.file.filename,
      };
      // console.log("idididid", id);
      User.findOneAndUpdate({ _id: id }, { Photo: req.file.filename })
        .then((response) => {
          // console.log("response",response);
          return res.status(200).json({
            message: "image updated",
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      console.log("no image");
    }
  }
);

module.exports = router;
