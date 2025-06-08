"use client";
import React from 'react';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import {emailExistsQuery, userNameExistsQuery} from "../app/utilitis/apis/queries";
import {client} from "../sanity/client";
import Image from 'next/image';
import { apiFetch } from "../app/utilitis/apis/fetchWrapper";
import useAuthStore from "../app/utilitis/apis/useAuthStore";
import { Spinner } from 'react-bootstrap';



const SignUp = () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    const [showPassword, setShowPassword] = useState(false);
    const [verificationError, setVerificationError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    async function checkIfexists () {
        const emailParam = {email: formData.email}
        const confirmEmail = await client.fetch(emailExistsQuery, emailParam);

        const userNameParam = {username: formData.username}
        const confirmUsername = await client.fetch(userNameExistsQuery, userNameParam);

        if (confirmEmail) {
          setVerificationError("The email is already in use")
          return true;
        } 
        else {
          if (confirmUsername){
            setVerificationError("The username is already in use")
            return true;
          }
          else {
            return false;
          }
        }
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true)

      const exists = await checkIfexists();
      if (exists) {
        return;
      }

      let response;
      isLoggedIn ? (
        response = await apiFetch('api/sendVerification/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          password: formData.password,
          username: formData.username
        })
      })) 
      : 
      (response = await fetch('api/sendVerification/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          password: formData.password,
          username: formData.username
        })
      }))

      // const response = await fetch('api/sendVerification/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     email: formData.email,
      //     password: formData.password,
      //     username: formData.username
      //   })
      // });
    
      const data = await response.json();
      if (response.ok) {
        redirect('/verify-email');
      } else {
        setLoading(false)
        setVerificationError(data.error || "Error sending verification email.");
      }
    };
    
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      if (formData.password.length < 6) {
        setVerificationError("Your password must be 6 characters long");
        return;
      } else {
        setVerificationError("");
      }
      
    };
  
  return (
    <>
        <form onSubmit={handleSubmit} key="signUpForm">
                <div className="inner-flex-box">
                    <p className="title">Sign Up</p>
                    <div className="formGroup">
                        <input
                        type="username"
                        placeholder="Username"
                        required
                        name="username"
                        id="username"
                        onChange={handleChange}
                        
                        />
                    </div>
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
                              <Image className="show-hide-button" 
                              src={showPassword ? "/images/bs-eye-fill.png":"/images/bs-eye-slash-fill.png" } 
                              width={25} 
                              height={25} 
                              onClick={() => setShowPassword(prev => !prev)} 
                              alt='Show Password'/>
                            </div>
                    </div>
                    
                    <div>
                      <p className="error-instruction">{verificationError}</p>
                    </div>
                    <div>
                      
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
                          Sign Up
                        </button>
                        )      
                      }
                      
                    </div>
                  </div>
                </form>
            
    </>
  )
}

export default SignUp
