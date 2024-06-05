import axios from "axios"
import jwt_decode from "jwt-decode"

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

//* Make API Requests

/** To get username from Token */
export async function getUsername() {
  const token = localStorage.getItem("token")
  if (!token) return Promise.reject("Cannot find Token")
  let decode = jwt_decode(token)
  return decode
}

// authenticate a user
export async function authenticate(username) {
  try {
    const { status } = await axios.post("/api/authenticate", { username })
    return status
  } catch (error) {
    return { error: "Username does not exist" }
  }
}

// get user details
export async function getUser(username) {
  try {
    const { data } = await axios.get(`/api/user/${username}`)
    return data
  } catch (error) {
    return { error: "Password does'nt match" }
  }
}

// Register user function
export async function registerUser(credentials) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/register`, credentials)

    let { username, email: userEmail } = credentials

    // send email if user registered successfully
    if (status === 201) {
      await axios.post("/api/registerMail", { username, userEmail, text: msg })
    }
    return Promise.resolve(msg)
  } catch (error) {
    return Promise.reject({ error })
  }
}

// login function

export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post("/api/login", { username, password })
      return Promise.resolve({ data })
    }
  } catch (error) {
    return Promise.reject({ error: "Password does not match" })
  }
}

// update user profile function

export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token")
    const data = await axios.put("/api/update-user", response, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return Promise.resolve({ data })
  } catch (error) {
    return Promise.reject({ error: "Couldn't update profile " })
  }
}

// generate OTP
export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/api/generateOTP", {
      params: { username },
    })
    console.log("code : ", code)
    // send mail with otp code
    if (status === 201) {
      let {
        user: { email },
      } = await getUser(username)
      let text = `Your OTP : ${code}\nVerify and recover your Password`
      console.log("user email : ", email)
      await axios.post("/api/registerMail/", {
        username,
        userEmail: email,
        text,
      })
    }
    return Promise.resolve(code)
  } catch (error) {
    return Promise.reject({ error })
  }
}

// verify otp
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get(`/api/verifyOTP`, {
      params: {
        username,
        code,
      },
    })
    return { data, status }
  } catch (error) {
    return Promise.reject({ error })
  }
}

export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/reset-password", {
      username,
      password,
    })
    return Promise.resolve({ data, status })
  } catch (error) {
    return Promise.reject({ error })
  }
}
