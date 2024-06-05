import React from "react"
import { Link, useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import { useFormik } from "formik"
import avatar from "../assets/profile.png"
import styles from "../styles/Username.module.css"
import { passwordValidate } from "../helper/validate"
import useFetch from "../hooks/fetch.hook"
import { useAuthStore } from "../store/store"
import { verifyPassword } from "../helper/helper"
export default function Password() {
  const navigate = useNavigate()
  const username = useAuthStore((state) => state.auth.username)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({ username, password: values.password })
      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>login successfully</b>,
        error: <b>Password not match</b>,
      })
      loginPromise
        .then((res) => {
          let { token } = res.data
          localStorage.setItem("token", token)
          navigate("/profile")
        })
        .catch((err) => console.log(err))
    },
  })
  if (isLoading) return <h1 className="text-2xl font-semibold ">Loading...</h1>
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen ">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">
              Hello {apiData?.firstName || username}
            </h4>
            <span className="py-4 text-xl w-2/3 text-gray-500 text-center">
              Type your password and enjoy .
            </span>
            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-4">
                <img
                  className={styles.profile_img}
                  src={apiData?.profile || avatar}
                  alt="avatar"
                />
              </div>
              <div className="textbox flex flex-col items-center gap-6">
                <input
                  type="password"
                  className={styles.textbox}
                  placeholder="Password"
                  name="password"
                  {...formik.getFieldProps("password")}
                />
                <button className={styles.btn} type="submit">
                  Sign in
                </button>
              </div>
              <div className="text-center py-4">
                <span className="text-gray-500">
                  Forgot password{" "}
                  <Link className="text-red-500" to="/recovery">
                    Recover now
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
