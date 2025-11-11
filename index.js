const express = require("express");
const app = express();
const {userRouter} = require ("./routes/user");
const {courseRouter} = require("./routes/course");
const {adminRouter} = require ("./routes/admin");
const mongoose = require("mongoose");
app.use(express.json());

app.use("/user",userRouter);
app.use("/course",courseRouter);
app.use("/admin",adminRouter);


async function main(){

await mongoose.connect("mongodb+srv://hardik:Navkar%40786@cluster0.ut4l6wj.mongodb.net/courseapp");
app.listen(3000);
  console.log("Listening to port 3000");
}
main();
