const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  microsoftId: {
    type: String,
    required: true,
  },
});

// This file has no real ties to the DB
// It's just the structure to follow when creating a "Todo"
// The true connection is in the server.js - connectDB();

module.exports = mongoose.model("Todo", TodoSchema);
