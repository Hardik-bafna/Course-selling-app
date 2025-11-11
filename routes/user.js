const {Router} = require ("express");
const userRouter = Router();
userRouter.post("/signin",(req,res)=>{
res.json(
  {
  message : "signin endpoint"
  })


})

userRouter.post("/signup",(req,res)=>{
res.json(
  {
  message : "signup endpoint"
  })


})
userRouter.get("/purchases",(req,res)=>{
res.json(
  {
  message : "purchases endpoint"
  })
})

module.exports = {
  userRouter : userRouter

}
