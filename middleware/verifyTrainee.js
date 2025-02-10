const { StatusCodes } = require("http-status-codes");

const verifyTrainee = (req, res, next) => {
  if (req.user.userType == 1) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "This is Only for trainees." });
  }
  next();
};

module.exports = verifyTrainee;
