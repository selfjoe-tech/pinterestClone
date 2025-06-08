import React from 'react'
import Image from 'next/image'
import ForgotPassword from "../../../components/ForgotPassword"

const page = () => {
  return (
    <div className="image-container">
      <div className="log-in-column">
        <div className="log-in-sign-in-form">
          <ForgotPassword />
        </div>
      </div>
    </div>
  )
}

export default page
