const User = require("../models/User");
const Form = require("../models/Form");
const { StatusCodes } = require("http-status-codes");


const deleteFormAndSetUserFalse = async (req, res) => {
  const {
    params: { id: trainee },
  } = req;
  try {
    const user = await User.findOneAndUpdate(
      { nationalId: trainee },
      { hasSubmittedForm: false }
    );
    await Form.findOneAndDelete({ trainee: user._id });
    res
      .status(StatusCodes.OK)
      .json({ msg: "User updated and form deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { deleteFormAndSetUserFalse };
