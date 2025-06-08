"use client";
import Login from "../../../components/Login"
import Link from "next/link.js";

export default function Home() {
  
  return (
    <div className="image-container">
      <div className="log-in-column">
        <div className="log-in-sign-in-form">
          <Login />
          <Link href="/sign-up">
            <p className="instruction" >No account? Sign Up</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
