const express = require("express");
const app = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("DocIt is running!");
});

app.listen(3000, () => {
  console.log("Started on port 3000");
});
