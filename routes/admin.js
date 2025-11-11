const {Router} = require ("express");
const adminRouter = Router();
const{ adminmodel} = require("../db");
console.log("MOngo");
adminRouter.post("/signin",(req,res)=>{
res.json(
  {
  message : "admin signin endpoint"
  })


})

adminRouter.post("/signup",(req,res)=>{
res.json(
  {
  message : "adminsignup endpoint"
  })


})
adminRouter.post("/createcourse",(req,res)=>{
res.json(
  {
  message : "createcourse endpoint"
  })


})
adminRouter.put("/createcourse",(req,res)=>{
res.json(
  {
  message : "createcourse endpoint"
  })


})
adminRouter.get("/getcourses",(req,res)=>{
res.json(
  {
  message : "getcourse endpoint"
  })


})


module.exports = {
  adminRouter : adminRouter

}
