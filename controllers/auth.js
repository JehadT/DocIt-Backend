const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  if (process.env.ALLOW_REGISTRATION === "false") {
    return res.status(StatusCodes.UNAUTHORIZED).send('UNAUTHORIZED')
  }
  try {
    await User.create({ ...req.body });
    res.status(StatusCodes.CREATED).send("User Created!");
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      userType: user.userType,
      email: user.email,
      name: user.name,
      track: user.track,
      phoneNumber: user.phoneNumber,
      nationalId: user.nationalId,
      gender: user.gender,
      major: user.major,
      id: user._id,
      hasSubmittedForm: user.hasSubmittedForm,
    },
    token,
  });
};

module.exports = {
  register,
  login,
};
