const path = require("path");

module.exports.viewDashboard = async (req, res) => {
    res.render(path.join(__dirname, "../views/dashboard"));
}