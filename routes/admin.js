const { Router } = require("express");
const { adminmodel, coursemodel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const {adminMiddleware} = require("../Middlewares/admin");

const adminRouter = Router();
const {JWT_ADMIN_PASSWORD} = require("../config");

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

//Signin
adminRouter.post("/signin",async(req,res)=>{
 try {
    const parsed = signinSchema.parse(req.body);
    const { email, password } = parsed;

    const normalizedEmail = email.toLowerCase();
    const admin = await adminmodel.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);

    return res.status(200).json({ token });
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({ message: e.errors.map(err => err.message) });
    }
    console.error("Signin error:", e);
    return res.status(500).json({ message: "Signin failed" });
  }

})
//Signup
adminRouter.post("/signup",async(req,res)=>{
 try {
    const parsed = signupSchema.parse(req.body);
    const { email, password, firstName, lastName } = parsed;

    const normalizedEmail = email.toLowerCase();
    const existingAdmin = await adminmodel.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await adminmodel.create({
      email: normalizedEmail,
      password: hashedPassword,
      firstName,
      lastName,
    });

    return res.status(201).json({ message: "Signup successful" });
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({ message: e.errors.map(err => err.message) });
    }
    console.error("Signup error:", e);
    return res.status(500).json({ message: "Signup failed" });
  }
})
adminRouter.post("/createcourse",adminMiddleware,async(req,res)=>{
const adminId = req.adminId;
  const {title ,description ,price ,imgurl}= req.body;
const course = await coursemodel.create({

  title : title,
  description : description,
  price : price,
  imgurl : imgurl,//create web3 saas
  creatorId : adminId


});
  res.json(
  {
  message : "course created",
    courseId : course._id
  })


})
adminRouter.put("/createcourse",adminMiddleware,async(req,res)=>{
  const adminId = req.adminId;
  const {title ,description ,price ,imgurl,courseId}= req.body;
const course = await coursemodel.updateOne({
  _id : courseId,
  creatorId : adminId

},{  title : title,
  description : description,
  price : price,
  imgurl : imgurl


});
  res.json(
  {
  message : "course updated",
    courseId : course._id
  })


})
adminRouter.get("/getcourses",adminMiddleware,async(req,res)=>{
  const adminId = req.adminId;

const course = await coursemodel.find({
  creatorId : adminId

});
  res.json(
  {
  message : "courses",
    course
  })
})


module.exports = {
  adminRouter : adminRouter

}
