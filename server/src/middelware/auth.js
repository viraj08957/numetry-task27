import jwt from "jsonwebtoken"
import UserModel from "../model/User.model.js"
import * as dotenv from "dotenv"
dotenv.config()

// middleware for verify user
export const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == "GET" ? req.query : req.body
    console.log(req.query)
    //check if user exist
    const exist = await UserModel.findByCredentials(username, undefined)
    if (!exist) return res.status(404).send({ message: "Can't found user" })
    next()
  } catch (error) {
    res.status(400).send({ error: "Unable to found user" })
  }
}

export const auth = async (req, res, next) => {
  try {
    // access authorized header to validate request
    const token = req.headers.authorization.split(" ")[1]
    if (!token) throw new Error("Invalid authorization header")
    // verify authorization header
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
    if (!decodedToken) throw new Error("Invalid authorization header")
    req.user = decodedToken
    //     res.json(decodedToken)
    next()
  } catch (err) {
    res.status(401).send({ err: "Unauthorized" })
  }
}

export const localVariables = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  }
  next()
}
