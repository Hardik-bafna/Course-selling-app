const { Router } = require("express");
const { usermodel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");

const userRouter = Router();
const JWT_USER_PASSWORD = "FUDge";

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

// SIGNUP
userRouter.post("/signup", async (req, res) => {
  try {
    const parsed = signupSchema.parse(req.body);
    const { email, password, firstName, lastName } = parsed;

    const normalizedEmail = email.toLowerCase();
    const existingUser = await usermodel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usermodel.create({
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
});

// SIGNIN
userRouter.post("/signin", async (req, res) => {
  try {
    const parsed = signinSchema.parse(req.body);
    const { email, password } = parsed;

    const normalizedEmail = email.toLowerCase();
    const user = await usermodel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);

    return res.status(200).json({ token });
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({ message: e.errors.map(err => err.message) });
    }
    console.error("Signin error:", e);
    return res.status(500).json({ message: "Signin failed" });
  }
});

// TEST ROUTE
userRouter.get("/purchases", (req, res) => {
  res.json({ message: "purchases endpoint" });
});

module.exports = {
  userRouter,
};

