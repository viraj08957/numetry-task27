import UserModel from "../model/User.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import otpGenerator from "otp-generator"
import * as dotenv from "dotenv"
dotenv.config()

// POST : http://localhost:5000/api/register
export const register = async (req, res) => {
  try {
    const { username, password, profile, email } = req.body
    // check the existing user
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username }, function (err, user) {
        if (err) reject(new Error(err))
        if (user) reject({ error: "Please use unique username" })
        resolve()
      })
    })

    // check the existing email
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email }, function (err, email) {
        if (err) reject(new Error(err))
        if (email) reject({ error: "Please use unique email" })
        resolve()
      })
    })

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 8)
            .then((hashedPass) => {
              const user = new UserModel({
                username,
                password: hashedPass,
                profile: profile || "",
                email,
              })
              // return save result as response
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User register successful" })
                )
                .catch((err) => res.status(500).send({ err }))
            })
            .catch((err) =>
              res.status(500).send({ error: "Enable to hashed password" })
            )
        }
      })
      .catch((error) => res.status(500).send({ error }))
  } catch (error) {
    res.status(404).send(error)
  }
}

// POST : http://localhost:5000/api/login
export const login = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserModel.findByCredentials(username, password)
    if (!user) res.status(404).send({ message: "Unable to login " })
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )
    res.status(200).send({ msg: "Login successful..", token })
  } catch (error) {
    res.status(401).send({ error: "Unable to login " })
  }
}

// POST : http://localhost:5000/api/:username
export const getUser = async (req, res) => {
  //   res.send({ msg: "Its work" })
  const { username } = req.params
  try {
    if (!username) return res.status(501).send({ error: "Invalid username" })

    const user = await UserModel.findOne({ username })
    if (!user) return res.status(404).send({ error: "User not found" })
    //remove password from from returned data
    //mongoose return unnecessary data we need to to convert to javascript object
    const { password, ...rest } = Object.assign({}, user.toJSON())

    res.status(200).send({ user: rest })
  } catch (error) {
    res.status(404).send({ error: "Cannot find User Data" })
  }
}

//PUT : http://localhost:5000/api/user-update?id=123123
export const updateUser = async (req, res) => {
  try {
    // const id = req.query.id
    const { userId: id } = req.user
    if (!id) return res.status(400).send({ error: "User not found ..!" })
    const bodyData = req.body
    const user = await UserModel.updateOne({ _id: id }, bodyData)
    if (!user) return res.status(404).send({ error: "No user with that id" })
    const userUpdated = await UserModel.findById(id)
    const { password, ...rest } = Object.assign({}, userUpdated.toJSON())
    res.status(200).send({ msg: "User updated successfully", user: rest })
  } catch (error) {
    res.status(500).send({ error })
  }
}

// GET http://localhost:5000/api/generateOTP
export const generateOTP = async (req, res) => {
  try {
    req.app.locals.OTP = await otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    })
    return res.status(201).send({ code: req.app.locals.OTP })
  } catch (error) {
    console.log(error)
  }
}

// GET http://localhost:5000/api/verifyOTP
export const verifyOTP = async (req, res) => {
  const { code } = req.query
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null //  reset the OTP value
    req.app.locals.resetSession = true // start the session of reset pass
    return res.status(201).send({ msg: "Verify Success " })
  }
  return res.status(400).send({ error: "Invalid OTP" })
}

// successfully redirect user when OTP is valid
// GET http://localhost:5000/api/createResetSession
export const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession })
  }
  return res.status(440).send({ msg: "session expired!" })
}

export const resetPassword = async (req, res) => {
  if (!req.app.locals.resetSession)
    return res.status(440).send({ msg: "session expired!" })
  try {
    const { username, password } = req.body
    console.log("reset password body sented : ", req.body)
    const user = await UserModel.findByCredentials(username, undefined)
    if (!user) return res.status(404).send({ error: "User not found" })
    const passwordHash = await bcrypt.hash(password, 10)
    const updatingCredentials = await UserModel.updateOne(
      { username: user.username },
      { password: passwordHash }
    )
    if (!updatingCredentials) {
      return res.status(400).send({ error: "Error updating credentials" })
    }
    req.app.locals.resetSession = false
    res
      .status(200)
      .send({ msg: "Successfully updated credentials", updatingCredentials })
  } catch (error) {
    return res.status(401).send({ error: "Something went wrong" })
  }
}
