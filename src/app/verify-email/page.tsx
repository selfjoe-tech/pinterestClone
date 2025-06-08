"use client";
import Image from "next/image";
import VerifyEmail from "../../components/verifyEmail"
import Link from "next/link.js";

export default function Home() {
  
  return (
    <div className="image-container">
      <div className="log-in-column">
        <Image src="/images/Ben Dover _skirts and panties.png" alt="Ben Dover Logo" width={232} height={111}/>
        <div className="log-in-sign-in-form">
          <VerifyEmail />
          <Link href="/sign-up">
            <p className="instruction" >Entered a wrong email? Click here.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}