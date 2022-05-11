const jwt = require("jsonwebtoken");
const config = require("../config").config;

//validateJwt
//Params:   req
//          res
//          next
//Validates the jwt token from the cookie, 
//if token is not valid or not provided -> redirect to login page
const validateJwt = (req, res, next) => {
    let token = req.cookies.jwt;
    //Token is provided ->
    if(token) {
        jwt.verify(token, config.secret, (err, decodedToken) => {
            if(err) {
                //Token has an error ->
                res.redirect("/login");
            } else {
                //Check if token has been expired ->
                if(decodedToken.exp > decodedToken.iat) {
                    next();
                } else {
                    //Token has expired ->
                    res.redirect("/login");
                }
            }
        });
    } else {
        //Token is not provided ->
        res.redirect("/login");
    }
}

const validateAdmin = (req, res, next) => {
    
}

module.exports = {
    validateJwt,
    validateAdmin
};