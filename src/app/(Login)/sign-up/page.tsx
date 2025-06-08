"use client";
import SignUp from "../../../components/Sign_up";
import Link from "next/link.js";


export default function Home() {

  return (
    <div className="image-container">
      <div className="log-in-column">
        <div className="log-in-sign-in-form">
          <SignUp />
          <Link href="/login">
            <p className="instruction" >Have an account? Login</p>
          </Link>
        </div>
      </div>
    </div>
  );
}