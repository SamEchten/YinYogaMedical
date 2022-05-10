const express = require("express");
const app = express();
const path = require("path");
const validator = require("./middleware/validator");
const mongoose = require("mongoose");

const port = 3030;

//Database connection ->
const dbpass = "EH4cSD4JSCbuDei4";
const dburi = "mongodb://admin:"+dbpass+"@localhost:27017/YinYogaMedical";
mongoose.connect(dburi, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Database connected");
    app.listen(port, () => {
        console.log("App is running");
    });
});

//Middleware ->
app.use(express.static("/public"));
app.use(express.json());

//Routers ->
const userRouter = require("./routes/userRouter");
const sessionRouter = require("./routes/sessionRouter");

//Routers ->
app.get("/", (req, res) => res.render("home"));

app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);