"use client";

import React from 'react'
import { useState } from 'react';
import mailLink from "../app/utilitis/apis/sendResetLink"

const ForgotPassword = () => {
    const [formData, setFormData] = useState(
        { 
            email: "",
        }
        
    );
    const [message, setMessage] = useState("");
    const [error, setError] = useState()
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call the login API route with credentials
        const response = await mailLink({
            email: formData.email
        });

        if (response.error) {
            setMessage(response.message)
            setError(true)
        } else {
            setMessage(response.message)
            setError(false)
        }
    };

    return (
        <form  onSubmit={handleSubmit} key="forgotPassWordForm">
            <div className="inner-flex-box">
                <p className='verify-instruction'>A link will be sent to the email that you used to register to reset your password</p>
                <div className="formGroup">
                    <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    id="email"
                    onChange={handleChange}
                    />
                    
                </div>
                    <button className="submit-button"type="submit">Send Email</button>
                    <p className={error? "error-instruction" : "ok-instruction"} >{message}</p>
                    
                </div>
            </form>

        )
    };
export default ForgotPassword
