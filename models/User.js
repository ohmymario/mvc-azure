const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  microsoftId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
});

// This file has no real ties to the DB
// It's just the structure to follow when creating a "User"
// The true connection is in the server.js - connectDB();

module.exports = mongoose.model("User", UserSchema);
