"use client";
import React from 'react'
import Image from 'next/image';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { apiFetch } from "..//app/utilitis/apis/fetchWrapper"
import useAuthStore from '@/app/utilitis/apis/useAuthStore';


const ResetPassword = (params) => {
  const isLoggedIn = useAuthStore.getState().isLoggedIn;
    const [showPassword, setShowPassword] = useState(false);
    const [verificationError, setVerificationError] = useState("");
    const [formData, setFormData] = useState({
      password: '',
      confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response;
      
        if (formData.password !== formData.confirmPassword) {
          setVerificationError("Your passwords don't match");
          return;
        }
        
        isLoggedIn ? (
          response = await apiFetch('api/resetPassword/', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            password: formData.password,
            id: params.id
          })
        })) 
        : 
        (response = await fetch('api/resetPassword/', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            password: formData.password,
            id: params.id
          })
        }))

        // const response = await apiFetch('api/resetPassword/', {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ 
        //     password: formData.password,
        //     id: params.id
        //   })
        // });


        const data = await response.json();
        if (response.ok) {
          redirect('/login');
        } else {
          setVerificationError(data.error);
        }
      };
      
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setVerificationError("")
      };
    
  return (
    <form onSubmit={handleSubmit} key="resetPasswordForm">
        <div className="inner-flex-box">
            <p className="title">Reset Password</p>
            <div className="passwordGroup">
                    <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    name="password"
                    id="password"
                    className='password-input'
                    onChange={handleChange}
                    />
                    
                    <div>
                        <Image className="show-hide-button" src={showPassword ? "/images/bs-eye-fill.png":"/images/bs-eye-slash-fill.png" } width={25} height={25} onClick={() => setShowPassword(prev => !prev)} alt=''/>
                    </div>
            </div>
            <div className="passwordGroup">
                    <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    name="confirmPassword"
                    id="password"
                    className='password-input'
                    onChange={handleChange}
                    />
                    
                    <div>
                        <Image className="show-hide-button" src={showPassword ? "/images/bs-eye-fill.png":"/images/bs-eye-slash-fill.png" } width={25} height={25} onClick={() => setShowPassword(prev => !prev)} alt=''/>
                    </div>
            </div>
            <div>
                <p className="error-instruction">{verificationError}</p>
            </div>
            <div>
                <button className="submit-button" type="submit">Reset</button>
            </div>
            </div>
    </form>
       
  )
}

export default ResetPassword
