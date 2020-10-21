require("../db/mongoose.js");
const Task = require("../models/task");

Task.findByIdAndUpdate("5f761a7b4a6f67123901da32", {
  description: "yodel behind the shed",
})
  .then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: true });
  })
  .then((numDocs) => {
    console.log(numDocs);
  })
  .catch((err) => {
      console.log(err)
  });
