import React from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { toast, Toaster } from "react-hot-toast"
import { useFormik } from "formik"
import { resetPassword } from "../helper/helper"
import styles from "../styles/Username.module.css"
import { resetPasswordValidate } from "../helper/validate"
import { useAuthStore } from "../store/store"
import useFetch from "../hooks/fetch.hook"
//
export default function Reset() {
  const navigate = useNavigate()
  const username = useAuthStore((state) => state.auth.username)
  const [{ isLoading, status, serverError }] = useFetch("createResetSession")
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let resetPasswordPromise = resetPassword({
        username,
        password: values.password,
      })
      toast.promise(resetPasswordPromise, {
        loading: "Updating...",
        success: <b>Your password has been reset successfully</b>,
        error: <b>Could not reset. Please try again</b>,
      })
      resetPasswordPromise.then(() => {
        navigate("/password")
      })
    },
  })
  // useEffect(() => {
  //   console.log(apiData)
  // })
  if (isLoading) return <h1 className="text-2xl font-semibold ">Loading...</h1>
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>
  if (status && status !== 201)
    return <Navigate to={"/password"} replace={true}></Navigate>
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen ">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-gray-500 text-center">
              Enter your password and don't forgot it
            </span>
            <form className="py-2" onSubmit={formik.handleSubmit}>
              <div className="textbox flex flex-col items-center gap-6">
                <input
                  type="password"
                  className={styles.textbox}
                  placeholder="New Password"
                  name="password"
                  {...formik.getFieldProps("password")}
                />
                <input
                  type="password"
                  className={styles.textbox}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  {...formik.getFieldProps("confirmPassword")}
                />
                <button className={styles.btn} type="submit">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
