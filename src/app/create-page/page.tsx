"use client";
import React, { useState } from 'react'
import CreatePage from "../../components/CreatePage"
import CreateStory from '@/components/CreateStory';

const Page = () => {

  const [type, setType] = useState("Single")

  return (
    <div className='createPage'>
      <div className="profileOptions">
            <span onClick={() => setType("Single")} className={type==="Single" ? "active": "inactive"}>Single Upload</span>
            <span onClick={() => setType("Collage")} className={type==="Collage" ? "active": "inactive"}>Collage</span>
        </div>

      {type === "Single" ? <CreatePage /> : <CreateStory />}
    </div>
  )
}

export default Page
