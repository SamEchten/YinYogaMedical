const express = require("express");
const app = express();
const path = require("path");
const validator = require("./middleware/validator");

const port = 3030;

//Middleware ->
app.use(express.statis("/public"));

//Routers ->
const userRouter = require("./routes/userRouter");
const sessionRouter = require("./routes/sessionRouter");

//Routers ->
app.get("/", (req, res) => res.render("home"));

app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);


//Database connection ->


app.listen(port, () => {
    console.log("app is running");
});

