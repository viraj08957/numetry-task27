import mongoose from "mongoose"
import * as dotenv from "dotenv"
dotenv.config()
import { MongoMemoryServer } from "mongodb-memory-server"

async function connectDB() {
  try {
    // const mongod = await MongoMemoryServer.create()
    // const getUri = mongod.getUri()
    // console.log("uri : ", getUri)
    mongoose.set("strictQuery", true)
    const db = await mongoose.connect(process.env.ATLAS_URI)
    console.log("Database connection successful")
    return db
  } catch (error) {
    console.log(error)
  }
}

export default connectDB
