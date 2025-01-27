const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const userInfo = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "-password -__v -_id"
  );
  if (!user) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Something went wrong, please try again later." });
  }
  res.status(StatusCodes.OK).json(user);
};

module.exports = { userInfo };
