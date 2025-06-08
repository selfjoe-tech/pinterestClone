import React from 'react'
import { useState } from "react";
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import useAuthStore from '../app/utilitis/apis/useAuthStore';
import { apiFetch } from "../app/utilitis/apis/fetchWrapper"
import { Spinner } from 'react-bootstrap';

const Login = () => {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(
        { 
        email: "",
        password: "" 
        }
    );
    const [error, setError] = useState("");
    const setAuth = useAuthStore(state => state.setAuth);
    
    const handleChange = (e) => {
        setFormData(
            { 
                ...formData,
                [e.target.name]: e.target.value 
            }
        );
        
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        let response;
        isLoggedIn ? (
                response = await apiFetch('api/verifyLogin/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                    })
                ) 
                : 
                (
                    response = await fetch('api/verifyLogin/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                        })
                )

        const data = await response.json();
        if (response.ok) {
            setAuth({
                isLoggedIn: data.isLoggedIn,
                user: data.user,
                accessToken: data.accessToken || "",  // Make sure your API includes it if needed
                tokenExpiry: data.tokenExpiry || ""
              });
            redirect("/")
        } else {
        setError(data.error || "Login failed");
        setLoading(false)
        }
    };

    return (
        <form  onSubmit={handleSubmit} key="loginForm">
            <div className="inner-flex-box">
                <p className='title'>Login</p>
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
                        alt=''
                        />
                    </div>   
                    
                </div>
                    <div className='forgot-password'>
                        <Link href="/forgot-password">
                            <p className="instruction" >Forgot password?</p>
                        </Link>
                    </div>
                    <button className="submit-button" type="submit">
                        {loading ? 
                        (      
                            <Spinner 
                                animation="border" 
                                variant="secondary"
                                size="sm"  
                            />
                        ) : 
                            "Login"
                        }
                    </button>
                    <p className='error-instruction'>{error}</p>
                </div>
            </form>
    )
}

export default Login
