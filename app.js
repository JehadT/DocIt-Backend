require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Database
const connectDB = require("./db/connect");

// Authorization
const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const userInfoRouter = require("./routes/userInfo");
const formRouter = require("./routes/forms");

// routes
app.use("/api/auth", authRouter);
app.use("/api", authenticateUser, userInfoRouter);
app.use("/api/forms", authenticateUser, formRouter);

// error handler
const errorHandlerMiddleware = require("./middleware/error-handler");

app.get("/", (req, res) => {
  res.status(200).send("DocIt is running!");
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
