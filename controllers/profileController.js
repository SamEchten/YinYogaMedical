const path = require("path");

module.exports.viewProfile = (req, res) => {
    res.render(path.join(__dirname, "../views/profile"));
}

module.exports.viewMyProfile = (req, res) => {
    res.render(path.view(__dirname, "../view/profile/myProfile"));
}