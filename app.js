const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-Parser");
const config = require("./config").config;

//Validator ->
const { validateJwt } = require("./middleware/validator");
const { validateAdmin } = require("./middleware/validator");
const { validateJson } = require("./middleware/validator");

//Server port ->
const port = 3030;

//View engine
app.set('view engine', 'ejs');

//Database connection / launch server ->
const dbpass = config.database.password;
const dbuser = config.database.user;
const dburi = "mongodb://" + dbuser + ":" + dbpass + "@localhost:27017/YinYogaMedical";

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
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
app.use("/static", express.static(path.join(__dirname, "public/images")));

// Serving bootstrap files ->
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/bicons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.use('/sweetalert', express.static(path.join(__dirname, 'node_modules/sweetalert2/dist/sweetalert2.all.min.js')));

//Routers / routes ->
const viewRouter = require("./routes/viewRouter");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const sessionRouter = require("./routes/sessionRouter");

app.use(viewRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", validateJwt, userRouter);
app.use("/api/session", sessionRouter);