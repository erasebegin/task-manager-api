const express = require("express");
require("./db/mongoose"); //even if not calling in this file, this ensures mongoose connects to database
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const commentRouter = require("./routers/comment");
const bodyParser = require("body-parser");

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
  const cors = ["https://comment-generator-915.netlify.app","https://my-jotter.netlify.app/"]

  const origin = cors.indexOf(req.header('origin').toLowerCase()) > -1 ? req.headers.origin : cors.default;

  // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE")
  next();
});

// app.use(cors());

app.use(express.json()); //for parsing JSON in body of POST request
app.use(bodyParser.json())

//register routers with app
app.use(userRouter);
app.use(taskRouter);
app.use(commentRouter);

//SET LISTENING PORT
app.listen(port, () => {
  console.log("Server is up on ", port);
});
