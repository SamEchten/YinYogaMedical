const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-Parser");
const config = require("./config").config;
const https = require("https");
const fs = require("fs");

//Server port ->
const port = 443;

//Optinos for https connection
const httpsOptions = {
    key: fs.readFileSync("./security/cert.key"),
    cert: fs.readFileSync("./security/cert.pem")
};

//View engine
app.set('view engine', 'ejs');

//Database connection / launch server ->
const dbpass = config.database.password;
const dbuser = config.database.user;
const dburi = "mongodb://" + dbuser + ":" + dbpass + "@localhost:27017/YinYogaMedical";

const server = https.createServer(httpsOptions, app);

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Database connected");
    server.listen(port, () => {
        console.log("Server is running");
    })
});

//Middleware ->
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serving css and js files -> 
app.use("/static", express.static(path.join(__dirname, "public/css")));
app.use("/static", express.static(path.join(__dirname, "public/js")));
app.use("/static", express.static(path.join(__dirname, "public/images/")));
app.use("/static", express.static(path.join(__dirname, "public/images/thumbnails")));
app.use("/static", express.static(path.join(__dirname, "views/dashboard")));

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
const productRouter = require("./routes/productRouter");
const videoRouter = require("./routes/videoRouter");
const podcastRouter = require("./routes/podcastRouter");
const dashboardRouter = require("./routes/dashboardRouter");

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/session", sessionRouter);
app.use("/api/product", productRouter);
app.use("/api/video", videoRouter);
app.use("/api/podcast", podcastRouter);
app.use("/api/dashboard", dashboardRouter);
app.use(viewRouter);