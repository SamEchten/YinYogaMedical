const express = require("express");
const app = express();
const path = require("path");
const validator = require("./middleware/validator");

const port = 3030;

//Routes ->
const userRouter = require("./routes/userRouter");
const sessionRouter = require("./routes/sessionRouter");

//Use routes at ->
app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);

app.listen(port, () => {
    console.log("app is running");
});