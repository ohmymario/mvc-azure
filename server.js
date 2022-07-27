// Handle CRUD API
const express = require("express");
const app = express();

// Methods to talk to the database
// Built on top of MongoDB
const mongoose = require("mongoose");

// Authentication
const passport = require("passport");

// Keep users logged in
const session = require("express-session");

// Pass the session to the Database
// Enables users to stay logged in even when the server needs to restart
// Uses cookies to keep the session alive
const MongoStore = require("connect-mongo")(session);

// Function to connect to DB
const connectDB = require("./config/database");

// Routes
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
const todoRoutes = require("./routes/todos");

// Loads environment variables from .env file.
require("dotenv").config({ path: "./config/.env" });

// Function that takes in passport
// using Microsoft Azure Active Directory
require("./config/passport")(passport);

connectDB();

// Express Setup Middleware
// ejs templating
app.set("view engine", "ejs");
// automatically serve anything in the public folder
app.use(express.static("public"));
// parses incoming requests with urlencoded payload - body parser
app.use(express.urlencoded({ extended: true }));
// parses incoming requests with JSON payload - body parser
app.use(express.json());

// Sessions Middleware
// Once a user is logged in they can stay logged in
app.use(
  sessions({
    // from docs need to change later
    secret: "keyboard cat",
    // force save even if no activity
    resave: false,
    // Forces a session that is "uninitialized" to be saved to the store.
    saveUninitialized: false,
    // The session store instance
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport Middleware
// Starts the functionality of passport
app.use(passport.initialize());
app.use(passport.session());

// Direct to correct Route
app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

// Indicate the server is running and what PORT
app.listen(process.env.PORT, () => {
  console.log(`Server is running! on Port ${process.env.PORT}`);
});
