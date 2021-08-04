const jwt = require("jsonwebtoken");

String.prototype.encodeDecode = function () {
  var nstr = "";

  for (var i = 0; i < this.length; i++) {
    nstr += String.fromCharCode(
      this.charCodeAt(i) ^ Number(process.env.ENCODENUM)
    );
  }

  return nstr;
};

module.exports = function (req, res, next) {
  const token = req.cookies["authToken"];
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token.encodeDecode(), process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
