const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["admin", "user", "categoryManager"],
    required: [true, "Role is required"],
  },
  category: {
    type: String,
    required: function () {
      return this.role === "user";
    },
    validate: {
      validator: function (value) {
        return this.role !== "user" || (value && value.trim() !== "");
      },
      message: "Category is required for users",
    },
  },
});

const User = mongoose.model("User", userSchema, "userdetails");

module.exports = User;
