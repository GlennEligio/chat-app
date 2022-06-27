const express = require("express");
const path = require("path");
const app = express();

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT;

app.use(express.json());
app.use(express.static(publicPath));

app.listen(process.env.PORT, () => {
  console.log("Server listening to port 3000");
});
