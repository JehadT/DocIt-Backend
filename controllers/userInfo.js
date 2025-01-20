const User = require('../models/User')
const { StatusCodes } = require("http-status-codes");

const userInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password -__v -_id")
        res.status(StatusCodes.OK).json(user)
    } catch (error) {
        console.error("Error fetching user info:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later." });
    }
}

module.exports = {userInfo}