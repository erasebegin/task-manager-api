const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

//create new router
const router = new express.Router();

//CREATE NEW USER (SIGN UP)
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201);
    res.send({ user, token });
  } catch (err) {
    res.status(400); //important that status is set first
    res.send(err); //could also chain by doing res.status(400).send(error)
  }
});

//LOG IN
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken(); //see user model for this method
    res.send({ user, token });
  } catch (err) {
    res.status(400).send("no puedes");
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

//FETCH ALL USERS
router.get("/users", auth, async (req, res) => {
  //the second argument here (auth) is for middleware
  //all routes refactored to use async await
  try {
    const users = await User.find({});
    res.status(201);
    res.send(users);
  } catch (err) {
    res.status(400);
    res.send(err);
  }

  // User.find({})
  //   .then((users) => {
  //     res.send(users);
  //   })
  //   .catch((err) => {
  //     res.status(500);
  //     res.send(err);
  //   });
});

//FETCH USER PROFILE

router.get("/users/me", auth, (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

//FETCH SINGLE USER BY ID
// router.get("/users/:id", async (req, res) => {
//   const id = req.params.id;

//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(500);
//     res.send(err);
//   }
// });

//UPDATE USER DATA
router.patch("/users/me/", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedToUpdate = ["name", "age", "password", "email"];
  const isValidUpdate = updates.every((value) =>
    allowedToUpdate.includes(value)
  );

  if (!isValidUpdate) {
    res.status(400);
    return res.send({ error: "That is not a valid field" });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    //this is different to the update method for tasks because middleware is required for hashing passwords for the user route
    //doing it this way ensures that middleware is not bypassed

    if (!req.user) {
      return res.status(404).send();
    }
    res.status(200);
    res.send(req.user);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

//DELETE USER
router.delete("/users/me", async (req, res) => {
  // const id = req.user._id;
  try {
    // const user = await User.findByIdAndDelete(id);
    // if (!user) {
    //   return res.status(404).send("This user does not appear to exist");
    // }
    //
    // This is still legit, but the below method is more succinct and can be used because of the auth middleware

    await req.user.remove();
    res.status(200); //No need to send 200 since this is the default
    res.send(req.user);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

module.exports = router;
