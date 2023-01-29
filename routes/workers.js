const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth")
const { WorkerModel, validateWorker, validateLogin, createToken, validateRoleChange } = require("../models/workerModel")

const router = express.Router();

// מאזין לכניסה לראוט של העמוד בית לפי מה שנקבע לראוטר
// בקובץ הקונפיג
router.get("/", async (req, res) => {
  res.json({ msg: "Workers work" });
})



// מחזיר למשתמש את הפרטים שלו
router.get("/workerInfo", auth, async (req, res) => {
  try {
    let worker = await WorkerModel.findOne({ _id: req.tokenData._id }, { password: 0 });
    res.json(worker);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.get("/allWorker", authAdmin, async (req, res) => {
  try {
    let worker = await WorkerModel.find({}, { password: 0 });
    res.json(worker);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

// sign up
router.post("/", authAdmin ,async (req, res) => {
  let validBody = validateWorker(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new WorkerModel(req.body);
    // להצפין את הסיסמא במסד עם מודול ביקריפט
    // 10 -> רמת הצפנה
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    // להסתיר את ההצפנה לצד לקוח
    user.password = "***"
    res.json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ msg: "user name already in system", code: 11000 })
    }
    console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/logIn", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // לבדוק אם בכלל יש רשומה עם המייל שנשלח
    let user = await WorkerModel.findOne({ user_name: req.body.user_name })
    if (!user) {
      return res.status(401).json({ msg: "User name Worng." })
    }
    // לבדוק אם הרשומה שנמצאה הסיסמא המוצפנות בתוכה מתאימה 
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "Password Worng." })
    }
    // לשלוח טוקן
    let token = createToken(user._id,user.role ,user.user_name)
    // res.json({token:token})
    res.json({ token })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.put("/:id/:role", authAdmin, async (req, res) => {
   // לשאול את עופר אם זה תקין
   WorkerModel.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      user.role = req.params.role;
      user.save((err, updatedUser) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(updatedUser);
        }
      });
    }
  });

  // let validBody = validateWorker(req.body);
  // console.log(validBody);
  // if (validBody.error) {
  //   return res.status(400).json(validBody.error.details);
  // }
  // try {
  //   let id = req.params.id;
  //   let data;
  //   data = await WorkerModel.updateOne({ _id: id }, req.body);
  //   data.role = "admin";
  //   res.json(data);
  // }
  // catch (err) {
  //   console.log(err);
  //   res.status(502).json({ err })
  // }
})

router.delete("/:user_name", authAdmin, async (req, res) => {
  try {
    let user_name = req.params.user_name;
    let data;
    data = await WorkerModel.deleteOne({ user_name: user_name });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})



module.exports = router;