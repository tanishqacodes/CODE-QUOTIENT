const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  todo_id: Number,
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;