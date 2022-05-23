const path = require("path");

module.exports.viewProfile = (req, res) => {
    res.render(path.join(__dirname, "../views/profile"));
}

module.exports.viewMyProfile = (req, res) => {
    res.render(path.join(__dirname, "../views/profile/myProfile"));
}

module.exports.viewMyProducts = (req, res) => {
    res.render(path.join(__dirname, "../views/profile/myProducts"));
}

module.exports.viewMyEnrollments = (req, res) => {
    res.render(path.join(__dirname, "../views/profile/myEnrollments"));
}