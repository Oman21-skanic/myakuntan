const fs = require("fs");
const path = require("path");
const User = require("../models/User");

// redirect dari dashboard ke dashboard user
const redirectDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.redirect(`/dashboard/user/${user._id}`);
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
};

// dashboard user page
const userDashboard = (req, res) => {
  const dashboardPage = fs.readFileSync(
    path.resolve(__dirname, "../../front-end/dashboard.html"),
    "utf-8"
  );
  res.send(dashboardPage);
};

module.exports = { redirectDashboard, userDashboard };
