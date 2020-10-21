const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
    if (!user) {
      throw new Error(); //this will trigger catch statement
    }
    req.user = user; //this... stores user info?
    req.token = token; //doing this gives route handlers access to these variables
    next(); // this allows route handler to run
  } catch {
    res.status(401);
    res.send({ error: "Please authenticate" });
  }
};

module.exports = auth;
