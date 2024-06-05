import mongoose from "mongoose"
import * as bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide unique Username"],
    unique: [true, "Username Exist"],
  },
  password: {
    type: String,
    required: [true, "Please provide aPassword"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide Email"],
    unique: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  mobile: { type: Number },
  address: { type: String },
  profile: { type: String },
})

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await UserModel.findOne({ username })
  if (!user) throw new Error(`Could not find user ${username}`)
  // for use findByCredentials method only check if the username is already exist or not
  if (!password) {
    return user
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error("Password mismatch")
  return user
}

const UserModel = mongoose.model("User", userSchema)
export default UserModel

/**
 *  this command is used to to export collections if not exported export model but we have a problem with it 
// * export default mongoose.model.Users || mongoose.model("User", userSchema)
  
  when use statics methods instead of UserModel didn't work like findByCredentials
*/
//
