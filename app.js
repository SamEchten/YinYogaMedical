const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-Parser");
const config = require("./config").config;

//Validator ->
const {validateJwt} = require("./middleware/validator");
const {validateAdmin} = require("./middleware/validator");

const port = 3030;

//Database connection / launch server->
const dbpass = config.database.password;
const dbuser = config.database.user;
const dburi = "mongodb://"+dbuser+":"+dbpass+"@localhost:27017/YinYogaMedical";

mongoose.connect(dburi, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Database connected");
    app.listen(port, () => {
        console.log("App is running");
    });
});

//Middleware ->
app.use(express.static("/public"));
app.use(express.json());
app.use(cookieParser());

//Api routers / routes ->
const userRouter = require("./routes/userRouter");
const sessionRouter = require("./routes/sessionRouter");

app.use("/api/session", sessionRouter);
app.use("/api/user", validateJwt, userRouter);

//View routers / routes->
const sessionViewRouter = require("./routes/viewRoutes/sessionViewRouter");

app.use(sessionViewRouter);
app.get("/", (req, res) => res.render("home"));