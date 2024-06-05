import express from "express"
import cors from "cors"
import morgan from "morgan"
import connectDB from "./db/connect.js"
import router from "./routers/route.js"
const app = express()

// middleware
app.use(express.json())
app.use(cors())

app.use(morgan("tiny"))
app.disable("x-powered-by") // less hackers know about our stack

const port = 5000
// HTTP GET Request
app.get("/", (req, res) => {
  res.status(201).json("Home GET request")
})

// api routes
app.use("/api", router)

// start the server only when we have valid connection to DB
connectDB()
  .then(() => {
    try {
      app.listen(port, () => console.log(`server listening on port ${port}`))
    } catch (error) {
      console.log("Cannot connect to server")
    }
  })
  .catch((err) => console.log(err))
