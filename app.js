require("dotenv").config();
require("express-async-errors");

// security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");


const express = require("express");
const app = express();

// frontend
app.use(express.static("dist"))

// Database
const connectDB = require("./db/connect");

// Authorization
const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const userInfoRouter = require("./routes/userInfo");
const formRouter = require("./routes/forms");
const fileRouter = require("./routes/files");

// error handler
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
// use packages
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());


// routes
app.use("/api/auth", authRouter);
app.use("/api", authenticateUser, userInfoRouter);
app.use("/api", authenticateUser, formRouter);
app.use("/api", authenticateUser, fileRouter);

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
