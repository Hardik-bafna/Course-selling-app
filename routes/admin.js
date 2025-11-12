const { Router } = require("express");
const { adminmodel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");

const adminRouter = Router();
const JWT_ADMIN_PASSWORD = "FUDgeYOU";

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
