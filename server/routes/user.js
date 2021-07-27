const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { JWT_SECRET } = require("../connect");
const router = express.Router();
const User = require("../models/user");
const Addpost = require("../models/post");
const Authentic = require("../auth/authentic");
const { find } = require("../models/user");
const authentic = require("../auth/authentic");

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

router.post("/signup", upload.single("Photo"), (req, res) => {
  const {
    Firstname,
    Lastname,
    Email,
    Username,
    Password,
    Cpassword,
  } = req.body;
  const Photo = req.file.filename;
  console.log("req.body.Photo", req.file.filename);
  if (
    !Firstname ||
    !Lastname ||
    !Email ||
    !Username ||
    !Password ||
    !Cpassword
  ) {
    return res.status(422).json({
      error: "please add all field",
    });
  }
  User.findOne({ Email: Email })
    .then((saveuser) => {
      if (saveuser) {
        return res.status(401).json({
          error: "Email alerady used",
        });
      } else {
        bcrypt
          .hash(Password, 12)
          .then((hashpassword) => {
            const newuser = new User({
              Firstname,
              Lastname,
              Email,
              Username,
              Photo,
              Password: hashpassword,
              Cpassword: hashpassword,
            });
            newuser
              .save()
              .then((data) => {
                return res.status(200).json({
                  message: "successfuly add user",
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.user.id })
    .select("-Password")
    .then((user) => {
      Addpost.find({ Postedby: req.params.id })
        .populate("Postedby", " _id Username")
        .exec((error, posts) => {
          if (error) {
            return res.status(422).json({
              error: error,
            });
          }
          res.json({ user, posts });
        });
    })
    .catch((error) => {
      console.log("user not found");
    });
});

router.get("/profile", Authentic, async (req, res) => {
  User.findOne(req.user._id)
    .then((data) => {
      res.json({ data });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/login", (req, res) => {
  const { Username, Password } = req.body;
  if (!Username || !Password) {
    return res.status(422).json({
      error: "please add all field",
    });
  }
  User.findOne({ Username: Username })
    .then((saveuser) => {
      if (!saveuser) {
        return res.status(401).json({
          error: "Invalid Username",
        });
      } else {
        bcrypt
          .compare(Password, saveuser.Password)
          .then((domatch) => {
            if (domatch) {
              const token = jwt.sign({ _id: saveuser._id }, JWT_SECRET);
              const { _id, Username } = saveuser;
              res.json({ token, user: { _id, Username } });
              return res.status(200).json({
                message: "login sucess",
              });
            } else {
              return res.status(401).json({
                error: "Invalid Password",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/logout", Authentic, async (req, res) => {
  const ruser = req.user;
  const token = req.token;
  const remainToken = await ruser.tokens.filter(
    (tokenobj) => tokenobj.token !== token
  );
  ruser.tokens = remainToken;
  ruser.save();
  res.status(200).send("logout success");
});

router.post("/follow", Authentic, (req, res) => {
  const followID = req.body.followId;
  const authuser = req.user;
  const inid = authuser._id;
  const idinrecord = authuser.Following.find(
    (inid) => inid.request_by == followID
  );
  if (idinrecord) {
    return res.status(208).json({ message: "you already send request" });
  }
  authuser.Following.push({ request_by: followID,    Postedby: req.user, accept: 0});
  authuser
    .save()
    .then(() => {
      User.findById(followID).then((data) => {
        data.Followers.push({ request_by: inid,  Postedby: req.user, accept: 0});
        data.save().then(() => {});
      });
      res.status(200).json({ message: "request send succesfully" });
    })
    .catch((err) => {
      res.status(400).json({ error: " there is some error" });
    });
});

router.post("/accept", Authentic, (req, res) => {
  const acceptID = req.body.acceptId;
  const authuser = req.user;
  const authid = authuser._id;
  const fol = authuser.Followers.findIndex(
    (inid) => inid.request_by == acceptID
  );
  authuser.Followers.set(fol, { request_by: acceptID, accept: 1 });
  authuser
    .save()
    .then(() => {
      User.findById(acceptID).then((data) => {

        const fols = data.Following.findIndex(
          (inidd) => inidd.request_by.toString() == authid.toString()
        );
        data.Following.set(fols, { request_by: authid, accept: 1 });
        data.save().then(() => {});
      });
      res.status(200).json({ message: "request accept succesfully" });
    })
    .catch((err) => {
      res.status(400).json({ error: " there is some error" });
    });
});

router.get("/getrequest", Authentic, async (req, res) => {
  const user = req.user;
  User.findById(user._id)
    .populate("Followers.request_by")
    .then((data) => {
      const UserData = data.Followers.filter((user) => user.accept === 0);
      res.status(200).json({ request:UserData});
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

router.post("/unfollow", Authentic, (req, res) => {
  const unfollowID = req.body.unfollowId;
  console.log(unfollowID);
  const authuser = req.user;
  const authid = authuser._id;
  const fol = authuser.Following.findIndex(
    (inid) => inid.request_by == unfollowID
  );
  authuser.Following.splice(fol, 1);
  authuser
    .save()
    .then(() => {
      User.findById(unfollowID).then((data) => {
        console.log(data);
        const fols = data.Followers.findIndex(
          (inidd) => inidd.request_by.toString() == authid.toString()
        );
        data.Followers.splice(fols, 1);
        data.save().then(() => {});
      });
      res.status(200).json({ message: "unfollow user succesfully" });
    })
    .catch((err) => {
      res.status(400).json({ error: " there is some error" });
    });
});

router.get("/search",Authentic,(req,res)=>{
  const Userdata=User.find()
  .then((data)=>{  
    res.status(200).json({ data : data });
  }).catch((error)=>{
    return res.status(401).json({
      error:"there is some error"
    })
  })
})

module.exports = router;
