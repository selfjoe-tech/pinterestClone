import React, { useState } from 'react';
import { redirect } from 'next/navigation';
import { apiFetch } from "..//app/utilitis/apis/fetchWrapper"
import useAuthStore from "../app/utilitis/apis/useAuthStore"
import { Spinner } from 'react-bootstrap';



const VerifyEmail = () => {
  const [verificationError, setVerificationError] = useState("");
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    const [loading, setLoading] = useState(false);
    

  const [formData, setFormData] = useState({
    userCode: ""
  });

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true)
    const userInputCode = formData.userCode; 

    let response;
    isLoggedIn ? (
      response = await apiFetch('/api/verifyCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInputCode })
    })) 
    : 
    (response = await fetch('/api/verifyCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInputCode })
    }))


    // const response = await apiFetch('/api/verifyCode', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userInputCode })
    // });

    const data = await response.json();
    if (response.ok) {
      redirect("/login")
    } else {
      setLoading(false)
      setVerificationError(data.error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setVerificationError("");
  };

  return (
    <form key="verifyForm" onSubmit={handleVerification}>
      <div className="inner-flex-box">
        <p className="title">Verify Email</p>
        <p className='verify-instruction'>A 6-digit code was sent to your email.</p>
        <div className="formGroup">
          <input
            type="text"
            placeholder="Enter Code"
            required
            name="userCode"  // Changed from "veificationCode" to "userCode"
            id="verificationCode"
            onChange={handleChange}
          />
        </div>
        <p className="error-instruction">{verificationError}</p>
        {loading ? 
                        (     
                          <button 
                            className="submit-button" 
                            type="submit"
                            disabled
                          >
                          <Spinner 
                            animation="border" 
                            variant="secondary"
                            size="sm" 
                          />
                          </button> 
                        ) 
                        : 
                        (
                        <button 
                          className="submit-button" 
                          type="submit"
                        >
                          Confirm Email
                        </button>
                        )      
                      }      </div>
      <div className="log-in-column">
        {/* Additional instructions if needed */}
      </div>
    </form>
  );
};

export default VerifyEmail;