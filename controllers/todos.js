const Todo = require("../models/Todo");

module.exports = {
  // GRAB ALL TODOS
  getTodos: async (req, res) => {
    console.log(req.user);
    try {
      // Grab only the todos from the user
      // This is done filtering by the MS Azure User ID
      const todoItems = await Todo.find({ microsoftId: req.user.microsoftId });
      // countDocuments - Count documents that match options
      // Using MS Azure User ID and completed to find itemsLeft
      const itemsLeft = await Todo.countDocuments({
        microsoftId: req.user.microsoftId,
        completed: false,
      });

      // todoItems - All user todos
      // itemsLeft - items not completed by User
      // allUser - data from MS Azure
      // All passed into todo.ejs file
      res.render("todos.ejs", {
        todos: todoItems,
        left: itemsLeft,
        user: req.user,
      });
    } catch (err) {
      console.log(err);
    }
  },
  // CREATE SINGLE TODO
  createTodo: async (req, res) => {
    try {
      // Take Item, mark it false, and add MS Azure ID
      await Todo.create({
        todo: req.body.todoItem,
        completed: false,
        microsoftId: req.user.microsoftId,
      });
      console.log("Todo has been added!");
      // After adding item then refresh page
      res.redirect("/todos");
    } catch (err) {
      console.log(err);
    }
  },
  // MARK A SINGLE TODO COMPLETE
  markComplete: async (req, res) => {
    try {
      // Find by mongoDB ID and update completed to true
      await Todo.findOneAndUpdate(
        { _id: req.body.todoIdFromJSFile },
        {
          completed: true,
        }
      );
      console.log("Marked Complete");
      // Respond with "Marked Complete"
      res.json("Marked Complete");
    } catch (err) {
      console.log(err);
    }
  },
  // MARK A SINGLE TODO INCOMPLETE
  markIncomplete: async (req, res) => {
    try {
      // Find by the mongoDB ID and mark incomplete
      await Todo.findOneAndUpdate(
        { _id: req.body.todoIdFromJSFile },
        {
          completed: false,
        }
      );
      // Respond with success
      // log success to the console
      console.log("Marked Incomplete");
      res.json("Marked Incomplete");
    } catch (err) {
      console.log(err);
    }
  },
  // DELETE A SINGLE TODO
  deleteTodo: async (req, res) => {
    console.log(req.body.todoIdFromJSFile);
    try {
      // Find todo to delete using ID given by mongoDB
      await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile });
      // Respond with success
      // log success to the console
      console.log("Deleted Todo");
      res.json("Deleted It");
    } catch (err) {
      console.log(err);
    }
  },
};
