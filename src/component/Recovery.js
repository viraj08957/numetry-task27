import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
// import { useFormik } from "formik"
import { generateOTP, verifyOTP } from "../helper/helper"
import { useAuthStore } from "../store/store"
import styles from "../styles/Username.module.css"

export default function Recovery() {
  const navigate = useNavigate()

  const { username } = useAuthStore((state) => state.auth)
  console.log("username : ", username)
  const [OTP, setOTP] = useState()
  useEffect(() => {
    setTimeout(async () => {
      const OTP = await generateOTP(username)

      console.log("OTP: ", OTP)
      if (!OTP) {
        return toast.error("Problem while generating OTP. Please try again")
      }
      return toast.success("OTP has been send to your email")
    }, 2000)
  }, [username])

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      let { status } = await verifyOTP({ username, code: OTP })

      if (status === 201) {
        toast.success("Verified OTP successfully")
        setTimeout(() => {
          return navigate("/reset")
        }, 1000)
        return
      }
      return toast.error("Wrong OTP check your email agin")
    } catch (error) {
      console.log(error)
    }
  }
  //   handler function of resend
  const resendHandler = (e) => {
    setTimeout(async () => {
      const OTP = await generateOTP(username)

      console.log("OTP: ", OTP)
      if (!OTP) {
        return toast.error("Problem while generating OTP. Please try again")
      }
      return toast.success("OTP has been send to your email")
    }, 2000)
  }
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen ">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h5 className="text-5xl font-bold">Recovery </h5>
            <span className="py-4 text-xl w-2/3 text-gray-500 text-center">
              Enter OTP to recover password
            </span>
            <form onSubmit={onSubmit} className="py-20">
              <div className="py-1 text-center">
                <span className="py-4  text-sm text-gray-500">
                  Enter 6 digits OTP to your email address
                </span>
              </div>
              <div className="textbox flex flex-col items-center gap-6">
                <input
                  type="number"
                  className={styles.textbox}
                  placeholder="OTP"
                  onChange={(e) => setOTP(e.target.value)}
                />
                <button className={styles.btn} type="submit">
                  Send
                </button>
              </div>
              <div className="text-center py-4">
                <span className="text-gray-500">
                  Can't get OTB{" "}
                  <p
                    onClick={resendHandler}
                    className="text-red-500 cursor-pointer"
                  >
                    Resend
                  </p>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
