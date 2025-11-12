const {Router} = require("express");
const courseRouter = Router();
const {userMiddleware}= require("../Middlewares/user");
const {purchasemodel,coursemodel} = require("../db");

courseRouter.post("/purchase",userMiddleware,async(req,res)=>{
const userId = req.userId;
  const courseId = req.body.courseId;
  await purchasemodel.create({
  userId,
    courseId

  })
res.json({
  message : "purchaseed successfully "

})

})
courseRouter.get("/preview",async(req,res)=>{
const courses = await coursemodel.find({});
res.json({
courses
})

})

module.exports = {
  courseRouter : courseRouter

}
