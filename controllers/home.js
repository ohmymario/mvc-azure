module.exports = {
  // Get Homepage
  // Only need to render the EJS
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
};
