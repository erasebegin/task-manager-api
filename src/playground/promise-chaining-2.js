require("../db/mongoose");
const Task = require("../models/task");

//PROMISE CHAINING

// Task.findByIdAndRemove("5f787cb5d2dd18213693fa8d")
//   .then((task) => {
//     console.log(task);
//     return Task.countDocuments({});
//   })
//   .then((numDocs) => {
//     console.log(numDocs);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

//ASYNC AWAIT

const removeAndCount = async (id) => {
  const remove = await Task.findByIdAndRemove(id);
  const count = await Task.countDocuments({ completed: true });

  return count;
};

removeAndCount("5f787cf4bc5fae214bf8e6d8")
  .then((count) => {
    console.log(count);
  })
  .catch((err) => {
    console.error(err);
  });
