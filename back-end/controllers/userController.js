const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

const allUser = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    messsage: "all user:",
    users,
  });
});

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = { allUser, getUserById };
