const express = require("express");
const Task = require("../models/task");

const auth = require("../middleware/auth");

//create new router
const router = new express.Router();

//CREATE NEW TASK
router.post("/tasks", auth, async (req, res) => {
  console.log("task body: ",req.body)
  const task = new Task({
    ...req.body,
    author: req.user._id,
  });

  try {
    await task.save();
    res.status(201);
    res.send(task);
  } catch (err) {
    res.status(400);
    res.send(err);
  }
});

//GET TASKS FOR AUTHENTICATED USER
// GET /tasks?completed=true
router.get("/tasks", auth, async (req, res) => {
  const matchData = {};
  if (req.query.completed) {
    matchData.completed = req.query.completed === "true";
  }
  try {
    //alternatively: const tasks = await Task.find({ author: req.user._id });
    await req.user
      .populate({ path: "usertasks", match: matchData })
      .execPopulate();
    res.send(req.user.usertasks);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

//FIND TASK BY ID
router.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findOne({ id, author: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

//UPDATE TASK DATA

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedToUpdate = ["description", "completed"];
  const isValidUpdate = updates.every((value) =>
    allowedToUpdate.includes(value)
  );

  if (!isValidUpdate) {
    res.status(400);
    return res.send({ error: "That is not a valid field" });
  }

  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, author: req.user._id });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    updates.forEach((update) => (task[update] = req.body[update]));

    res.status(200);
    res.send(task);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

//DELETE TASKS
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOneAndDelete({ _id: id, author: req.user._id });
    if (!task) {
      return res.status(404).send("This task does not appear to exist");
    }

    res.status(200);
    res.send(task);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

module.exports = router;
