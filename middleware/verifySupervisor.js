const { StatusCodes } = require("http-status-codes");

const verifySupervisor = (req, res, next) => {
  if (req.user.userType == 2) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "This is only for Supervisors." });
  }
  next();
};

module.exports = verifySupervisor;
