const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive integer");
        }
      },
    },
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
    password: {
      required: true,
      type: String,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error(
            "that is a terrible password, please choose something else"
          );
        }
      },
    },
    tokens: [
      //this is how to create sub-collection
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    //second argument to mongoose.Schema is for schema configuration options
    timestamps: true,
  }
);

//instead of adding an array for tasks to the model (a sub-collection), since tasks are stoerd in a separate collection, we will instead create a VIRTUAL PROPERTY

userSchema.virtual("usertasks", {
  //first name the virtual property (usertasks) then add a reference to the data
  ref: "Task",
  localField: "_id", //this is the field in this collection that is common to both collections
  foreignField: "author", //this is the field in the linked-to collection that is common to both collections
});

userSchema.methods.generateAuthToken = async function () {
  //NOT async
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token: token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  //toJSON allows this method to be automatically used whenever the user object is sent back (req.user)
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => { 
  //userSchema.statics is for working with the User model rather than routes
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next(); //this needs to be run in order for the function to stop executing
});

// delete all tasks when user is removed

userSchema.pre("remove", async function (next) {
  const user = this;

  await Task.deleteMany({ author: user._id });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
