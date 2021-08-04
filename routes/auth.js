const router = require("express").Router();
const User = require("../model/User");
const ResetPass = require("../model/ResetPass");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const verify = require("./verifyToken");
const nodemailer = require("nodemailer");

String.prototype.encodeDecode = function () {
  var nstr = "";

  for (var i = 0; i < this.length; i++) {
    nstr += String.fromCharCode(
      this.charCodeAt(i) ^ Number(process.env.ENCODENUM)
    );
  }

  return nstr;
};

const tokenGen = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      ageName: req.body.ageName,
      ageDate: req.body.ageDate,
      loggedIn: true,
    },
    (err, data) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const token = jwt.sign({ _id: data._id }, process.env.TOKEN_SECRET);
        res.json({ token: token.encodeDecode() });
      }
    }
  );
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is wrong");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Email or password is wrong");

  User.findOneAndUpdate(
    { email: req.body.email },
    { $set: { loggedIn: true } },
    (err, data) => {
      if (err) return res.status(400).send("An error occured");

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.json({ token: token.encodeDecode() });
    }
  );
});

router.get("/logout", verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { loggedIn: false } },
    (err, data) => {
      if (err) return res.status(400).send("An error occured");
      res.send("Logged Out");
    }
  );
});

router.post("/resetpass-request", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Email");

  const salt = await bcrypt.genSalt(10);
  const genToken = tokenGen(10);
  const token = await bcrypt.hash(genToken, salt);

  ResetPass.create(
    {
      userId: user._id,
      token: token,
      email: req.body.email,
    },
    async (err, data) => {
      if (err) return res.status(500).send(err);

      const fromMail = `WhyBook <${process.env.RESETPASS_EMAIL}>`;
      const subject = "Password Reset For WhyBook";
      const resetUrl = `${process.env.WEBSITE2_URL}/reset-password?token=${genToken}&email=${req.body.email}`;
      const toMail = req.body.email;
      const text = `<div
      style="
        padding: 3.5px;
        background-color: #f1895c;
        border: 3.5px solid #00c7d1;
        border-radius: 15px;
      "
    >
      <div
        style="
          background-color: white;
          color: #00c7d1;
          padding: 0.8rem;
          border-radius: 15px;
        "
      >
        <p style="font-family: comic sans ms; font-size: 18px;">
          Hello! <br />Follow this link to reset your WhyBook password for your
          <span style="color: #f1895c !important;"> ${req.body.email}</span>
          account. <br />
          <br /><span style="color: #f1895c !important;"> ${resetUrl}</span>
          <br />
          <br />If you didn’t ask to reset your password, you can ignore this email.
          <br />Thank You! <br /><span
            style="color: #f1895c; font-weight: 900; text-shadow: 1px 0 #00c7d1;"
            >Why Book</span
          >
        </p>
      </div>
    </div>
    `;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.RESETPASS_EMAIL,
          pass: process.env.RESETPASS_PASS,
        },
      });
      const mailOptions = {
        from: fromMail,
        to: toMail,
        subject: subject,
        html: text,
      };

      transporter.sendMail(mailOptions, (error, response) => {
        if (error) return res.status(500).send(error);
        res.status(200).send("Reset Email sent");
      });
    }
  );
});

router.get("/resetpass-verify", async (req, res) => {
  const token = req.query.token;
  const email = req.query.email;
  const resetPassData = await ResetPass.findOne({ email: email });
  if (!resetPassData) return res.status(400).send("Invalid Request");

  const validToken = await bcrypt.compare(token, resetPassData.token);
  if (!validToken) return res.status(400).send("Invalid Token");
  res.status(200).send("Valid");
});

router.post("/reset-password", async (req, res) => {
  const token = req.query.token;
  const email = req.query.email;

  const resetPassData = await ResetPass.findOne({ email: email });
  if (!resetPassData) return res.status(400).send("Invalid Request");

  const validToken = await bcrypt.compare(token, resetPassData.token);
  if (!validToken) return res.status(400).send("Invalid Token");

  const newPass = req.body.password;
  ResetPass.deleteOne({ email: email }, async (err, data) => {
    if (err) return res.status(500).send(err);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);
    User.updateOne(
      { email: email },
      { $set: { password: hashedPassword } },
      (err, data) => {
        if (err) res.status(500).send(err);
        res.status(200).send("Password Updated");
      }
    );
  });
});

router.get("/find", verify, (req, res) => {
  const userId = req.user._id;

  User.findById(userId, (err, data) => {
    if (err) return res.stauts(500).send(err);
    if (!data.name) return res.status(500).send("Unable to fetch Username");
    res.send({ name: data.name });
  });
});

module.exports = router;
