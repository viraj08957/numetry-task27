import express from "express"
const router = new express.Router()
import {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
} from "../controllers/controllers.js"
import { registerMail } from "../controllers/mailer.js"
import { auth, localVariables, verifyUser } from "../middelware/auth.js"

//? POST Methods --------------------------------

router.post("/register", register)

router.post("/registerMail", registerMail)
router.post("/authenticate", verifyUser, (req, res) => {
  res.end()
})
router.post("/login", login)

//? GET Methods --------------------------------

router.get("/user/:username", getUser)
router.get("/generateOTP", verifyUser, localVariables, generateOTP)
router.get("/verifyOTP", verifyUser, verifyOTP)
router.get("/createResetSession", createResetSession)

//? PUT Methods --------------------------------

router.put("/update-user", auth, updateUser)

router.put("/reset-password", resetPassword)

export default router
