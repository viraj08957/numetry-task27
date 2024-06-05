import toast from "react-hot-toast"
import { authenticate } from "./helper"

// validate login page username

export async function usernameValidate(values) {
  const errors = usernameVerify({}, values)

  if (values.username) {
    // check if user exists
    const status = await authenticate(values.username)

    if (status !== 200) {
      errors.exist = toast.error("User does not exist")
    }
  }

  return errors
}

export async function passwordValidate(values) {
  const errors = passwordVerify({}, values)
  return errors
}

export async function resetPasswordValidate(values) {
  const errors = recoveryVerify({}, values)
  return errors
}

export async function registerValidation(values) {
  const errors = usernameVerify({}, values)
  passwordVerify(errors, values)
  emailVerify(errors, values)

  return errors
}

export async function profileValidation(values) {
  const errors = usernameVerify({}, values, true)
}

function recoveryVerify(error = {}, values) {
  if (values.password !== values.confirmPassword) {
    error.username = toast.error("Password not match ..!")
  }
  return error
}

/** ************************************************* */

/** validate password */
function passwordVerify(errors = {}, values) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

  if (!values.password) {
    errors.password = toast.error("Password Required...!")
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Wrong Password...!")
  } else if (values.password.length < 4) {
    errors.password = toast.error(
      "Password must be more than 4 characters long"
    )
  } else if (!specialChars.test(values.password)) {
    errors.password = toast.error("Password must have special character")
  }

  return errors
}

//validate username
function usernameVerify(error = {}, values, profile) {
  // validate field of profile
  if (profile) {
    if (!values.firstName) {
      error.username = toast.error("First Name is required...!")
    } else if (
      values.firstName.includes(" ") ||
      values.firstName.toLowerCase().includes("username")
    ) {
      error.username = toast.error("Invalid first name...!")
    }
  } //validate register field
  else {
    if (!values.username) {
      error.username = toast.error("Username is required...!")
    } else if (
      values.username.includes(" ") ||
      values.username.toLowerCase().includes("username")
    ) {
      error.username = toast.error("Invalid Username...!")
    }
  }
  return error
}

/** validate email */
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required...!")
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!")
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!")
  }

  return error
}
