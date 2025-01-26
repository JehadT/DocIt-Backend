const { StatusCodes } = require("http-status-codes");

const verifyTrainee = (req, res, next) => {
  if (req.user.userType == 1) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Only trainees are allowed to upload files" });
  }
  next();
};

module.exports = verifyTrainee;
