const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-Parser");
const config = require("./config").config;

//Validator ->
const {validateJwt} = require("./middleware/validator");
const {validateAdmin} = require("./middleware/validator");
const {validateJson} = require("./middleware/validator");

//Server port ->
const port = 3030;

//View engine
app.set('view engine', 'ejs');

//Database connection / launch server ->
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
app.use(express.json());
app.use(cookieParser());

// Serving css and js files -> 
app.use("/static", express.static(path.join(__dirname, "public/css")));
app.use("/static", express.static(path.join(__dirname, "public/js")));
app.use("/static", express.static(path.join(__dirname, "public/images")))

// Serving bootstrap files ->
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

//Api routers / routes ->
const userRouter = require("./routes/userRouter");
const sessionRouter = require("./routes/sessionRouter");

app.use("/api/session", validateJson, sessionRouter);
app.use("/api/user", validateJson, validateJwt, userRouter);

//View routers / routes ->
const sessionViewRouter = require("./routes/viewRoutes/sessionViewRouter");

app.use(sessionViewRouter);
app.get("/", (req, res) => res.render("home"));
