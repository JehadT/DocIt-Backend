const { StatusCodes } = require("http-status-codes");

const verifySupervisor = (req, res, next) => {
  if (req.user.userType == 2) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Only Supervisors can fetch forms" });
  }
  next();
};

module.exports = verifySupervisor;
