import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import avatar from "../assets/profile.png"
import { toast, Toaster } from "react-hot-toast"
import { useFormik } from "formik"
import { profileValidation } from "../helper/validate"
import convertToBase64 from "../helper/convert"

import styles from "../styles/Username.module.css"
import extend from "../styles/Profile.module.css"
import { updateUser } from "../helper/helper"
import { useAuthStore } from "../store/store"
import useFetch from "../hooks/fetch.hook"

//===============================
export default function Profile() {
  const navigate = useNavigate()
  const [file, setFile] = useState()
  const [{ isLoading, apiData, serverError }] = useFetch()

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      mobile: apiData?.mobile || "",
      email: apiData?.email || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = Object.assign(values, {
        profile: file || apiData?.profile || "",
      })
      let updateProfilePromise = updateUser(values)
      toast.promise(updateProfilePromise, {
        loading: "Updating...",
        success: <b>Updated successfully</b>,
        error: <b>Failed to update profile</b>,
      })
      updateProfilePromise.then((res) => {
        console.log(res.data.data.msg)
      })
    },
  })

  /** formik doesn't support file upload so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0])
    setFile(base64)
  }

  const userLogout = (e) => {
    localStorage.removeItem("token")
    navigate("/")
  }
  if (isLoading) return <h1 className="text-2xl font-semibold ">Loading...</h1>
  if (serverError) {
    console.log("server error  : ", serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>
  }
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div
          className={styles.glass_register}
          style={{ width: "45%", paddingTop: "3em" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              You can update the details
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || file || avatar}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </label>

              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("firstName")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                />
                <input
                  {...formik.getFieldProps("lastName")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                />
              </div>

              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Mobile number"
                  name="mobile"
                />
                <input
                  {...formik.getFieldProps("email")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Email"
                  name="email"
                />
              </div>

              <input
                {...formik.getFieldProps("address")}
                className={styles.textbox}
                type="text"
                placeholder="Address"
                name="address"
              />
              <button className={styles.btn} type="submit">
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Come back later?{" "}
                <Link onClick={userLogout} className="text-red-500" to="/">
                  Logout
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
