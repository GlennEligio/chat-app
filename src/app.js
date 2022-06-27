const express = require("express");
const path = require("path");
const app = express();
const publicPath = path.join(__dirname, "/../public");

app.use(express.json());
app.use(express.static(publicPath));

app.get("/chat", (req, res) => {
  res.send("Chat app");
});

module.exports = app;
