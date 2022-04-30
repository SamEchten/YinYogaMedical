const express = require("express");
const app = express();
const path = require("path");
const validate = require("./middleware/validate");

const port = 3030;

//Routes ->
const userRouter = require("./routes/userRouter");

//Use routes at ->
app.use("/api/users", userRoutes);


app.listen(port, () => {
    console.log("app is running");
});