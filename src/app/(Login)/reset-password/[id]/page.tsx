import React from 'react'
import ResetPassword from "../../../../components/ResetPassword"
import Image from 'next/image'

export default async function Page({ params }: { params: { id: string } }) {
  // If needed, you can await any async work here.
  // In our case, params.id is synchronous, so we can use it directly.
  return (
    <div className="image-container">
      <div className="log-in-column">
        
        <div className="log-in-sign-in-form">
          <ResetPassword id={params.id} />
        </div>
      </div>
    </div>
  );
}

