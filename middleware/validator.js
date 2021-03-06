const jwt = require("jsonwebtoken");
const config = require("../config").config;
const User = require("../models/User");

//validateJwt
//Params:   req
//          res
//          next
//Validates the jwt token from the cookie, 
//if token is not valid or not provided -> redirect to login page
const validateJwt = (req, res, next) => {
    let token = req.cookies.jwt;
    //Token is provided ->
    if (token) {
        const decodedToken = verifyJwt(token);
        if (decodedToken != null) {
            next();
        } else {
            res.redirect("/login");
        }
    } else {
        //Token is not provided ->
        res.redirect("/login");
    }
}

//validateAdmin
//Params:   req
//          res
//          next
//Validates the jwt token from the cookie and checks if request was made by an admin, 
//if token is not valid, not provided or request was not made by admin -> redirect to login page
const validateAdmin = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        const decodedToken = verifyJwt(token);
        if (decodedToken != null) {
            //Valid token ->
            const id = decodedToken.id;
            User.findOne({ _id: id }, (err, doc) => {
                if (!err) {
                    if (doc.isEmployee) {
                        //Request was made by admin ->
                        next();
                    } else {
                        res.redirect("/login");
                    }
                } else {
                    res.redirect("/login");
                }
            });
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
}

//verifyJwt
//Params:   token
//verifies the given token
//If token is not valid -> returns null
//If token is valid -> return decoded token
const verifyJwt = (token) => {
    let decodedToken;
    jwt.verify(token, config.secret, (err, tok) => {
        if (!err) {
            if (tok.exp > tok.iat) {
                decodedToken = tok;
            }
        }
    });
    return decodedToken;
}

//validateJson
//Params:   req
//          res
//          next
//Validates the given json with the 
const validateJson = async (req, res, next) => {
    const origin = req.originalUrl.replace("/api", "");
    const json = req.body;
    const schema = require("../schemas" + origin + ".json");

    try {
        let result = val.validate(json, schema);
        if (result.valid) {
            next();
        } else {
            res.sendStatus(400);
        }
    } catch (err) {
        res.sendStatus(400);
    }
}

const validateSubscription = async (req, res, next) => {
    const origin = req.originalUrl;
    const resource = origin.split("/")[2];
    const user = JSON.parse(req.cookies.user);
    const subscriptions = user.subscriptions;

    if (isAdmin(user)) {
        next();
    } else {
        let hasSubscription = false;
        for (i in subscriptions) {
            let subscription = subscriptions[i].description;
            if (resource == "video") {
                if (subscription == "Video" || subscription == "Premium") {
                    hasSubscription = true;
                }
            }

            if (resource == "podcast") {
                if (subscription == "Podcast" || subscription == "Premium") {
                    hasSubscription = true;
                }
            }
        }

        if (hasSubscription) {
            next();
        } else {
            res.redirect("/home");
        }
    }
}

const isAdmin = (user) => {
    if (user.isEmployee) {
        return true;
    }
    return false;
}

module.exports = {
    validateJwt,
    validateAdmin,
    validateJson,
    validateSubscription
};