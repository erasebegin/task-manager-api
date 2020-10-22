const express = require("express");
require("./db/mongoose"); //even if not calling in this file, this ensures mongoose connects to database
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const commentRouter = require("./routers/comment");

const app = express();
const port = process.env.PORT;

const maintenanceMode = false;

app.use((req, res, next) => {
  //creating and running simple Express middleware
  if (maintenanceMode === true) {
    res.status(503);
    res.send("Sorry, the site is currently down for maintenance");
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json()); //for parsing JSON in body of POST request

//register routers with app
app.use(userRouter);
app.use(taskRouter);
app.use(commentRouter);

//SET LISTENING PORT
app.listen(port, () => {
  console.log("Server is up on ", port);
});
