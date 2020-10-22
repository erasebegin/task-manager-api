const express = require("express");
const Comment = require("/home/chris/task-manager-api/src/models/comment.js");

const auth = require("../middleware/auth");

//create new router
const router = new express.Router();

//GET COMMENTS FOR AUTHENTICATED USER
// GET /tasks?type=grammar
router.get("/comments", auth, async (req, res) => {
  const matchData = {};
    matchData.type = req.query.type
  try {
    //alternatively: const tasks = await Task.find({ author: req.user._id });
    await req.user
      .populate({ path: "usercomments", match: matchData })
      .execPopulate();
    res.send(req.user.usercomments);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

//CREATE NEW TASK (description, type, grade)
router.post("/comments", auth, async (req, res) => {
  const comment = new Comment({
    ...req.body,
    author: req.user._id,
  });

  try {
    await comment.save();
    res.status(201);
    res.send(comment);
  } catch (err) {
    res.status(400);
    res.send(err);
  }
});


// //FIND TASK BY ID
// router.get("/tasks/:id", async (req, res) => {
//   const id = req.params.id;

//   try {
//     const task = await Task.findOne({ id, author: req.user._id });
//     if (!task) {
//       return res.status(404).send();
//     }
//     res.send(task);
//   } catch (err) {
//     res.status(500);
//     res.send(err);
//   }
// });

// //UPDATE TASK DATA

// router.patch("/tasks/:id", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedToUpdate = ["description", "completed"];
//   const isValidUpdate = updates.every((value) =>
//     allowedToUpdate.includes(value)
//   );

//   if (!isValidUpdate) {
//     res.status(400);
//     return res.send({ error: "That is not a valid field" });
//   }

//   try {
//     const id = req.params.id;
//     const task = await Task.findOne({ _id: id, author: req.user._id });

//     if (!task) {
//       return res.status(404).send("Task not found");
//     }

//     updates.forEach((update) => (task[update] = req.body[update]));

//     res.status(200);
//     res.send(task);
//   } catch (err) {
//     res.status(500);
//     res.send(err);
//   }
// });

// //DELETE TASKS
// router.delete("/tasks/:id", auth, async (req, res) => {
//   try {
//     const id = req.params.id;
//     const task = await Task.findOneAndDelete({ _id: id, author: req.user._id });
//     if (!task) {
//       return res.status(404).send("This task does not appear to exist");
//     }

//     res.status(200);
//     res.send(task);
//   } catch (err) {
//     res.status(500);
//     res.send(err);
//   }
// });

module.exports = router;
