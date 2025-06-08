"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "../app/utilitis/apis/fetchWrapper";
import useAuthStore from "../app/utilitis/apis/useAuthStore";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "react-bootstrap";
import Image from "next/image";

export default function CreatePage() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [wrongType, setWrongType] = useState(false);
  const user = useAuthStore.getState().user;
  const [type, setType] = useState("Single");

  // preview
  useEffect(() => {
    if (!mediaFile) return
    const url = URL.createObjectURL(mediaFile)
    setPreviewUrl(url)
    // set mediaType based on file MIME
    if (mediaFile.type.startsWith('image/')) setMediaType('image')
    else if (mediaFile.type.startsWith('video/')) setMediaType('video')
    return () => URL.revokeObjectURL(url)
  }, [mediaFile])

  function handleMediaChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const ok = file.type.startsWith('image/') || file.type.startsWith('video/')


    if (!ok) {
      setWrongType(true);
      return;
    }
    setWrongType(false);
    setMediaFile(file);
  }

  function addTag(e) {
    e.preventDefault();
    const v = tagInput.trim();
    if (v && !tags.includes(v)) setTags((t) => [...t, v]);
    setTagInput("");
  }
  function removeTag(i) {
    setTags((t) => t.filter((_, idx) => idx !== i));
  }

  async function handlePublish(e) {
    e.preventDefault();
    if (!title.trim() || !mediaFile) return;

    setLoading(true);
    const fd = new FormData();
    fd.append("userId", user._id)
    fd.append("title", title.trim());
    if (link.trim()) fd.append("link", link.trim());
    fd.append("mediaType", mediaType);
    fd.append("file", mediaFile);
    tags.forEach((tg) => fd.append("tags[]", tg));

    // send the FormData to our API
    const res = isLoggedIn
      ? await apiFetch("/api/createPin", 
            { 
                method: "POST", 
                body: fd 
            }
        )
      : await fetch("/api/createPin", 
            { 
                method: "POST", 
                body: fd 
            }
        );

    if (res.ok) {
      router.push("/"); // or wherever
    } else {
      console.error("Publish failed", await res.text());
      setLoading(false);
    }
  }
    const removeMedia = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        
    };

  return (
    <div className="createPage">
      <div className="createTop">
        <h1>Create Pin</h1>
        
        <Button 
            onClick={handlePublish} 
            disabled={loading}
            variant="secondary"
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Publish"}
        </Button>
      </div>
        
        
      <div className="createBottom">
          {previewUrl ? (
            mediaType === "image" ? (
                <div className="upload-image-container">
                    <div className="new-image-container">
                        <img src={previewUrl} style={{ maxWidth: "100%" }} />
                    </div>
                    <button 
                        onClick={removeMedia}
                        title='remove image'
                        className="profileButton remove-media"
                    >
                        <Image 
                            src="/images/bs-trash3.png"
                            height={16}
                            width={16}
                            alt="Edit Profile Button"
                    />
                    </button>
                </div>
              
            ) : (
            <div className="upload-video-container">
                <div className="new-video-container">
                    <video
                        src={previewUrl}
                        style={{ maxWidth: "100%" }}
                        controls
                    />
              </div>
              <button 
                        onClick={removeMedia}
                        title='remove image'
                        className="profileButton remove-media"
                    >
                        <Image 
                            src="/images/bs-trash3.png"
                            height={16}
                            width={16}
                            alt="Edit Profile Button"
                    />
                </button>
              </div>
            )
          ) : (
            <div className="upload">
                <div className="uploadtitle">
                    <img src="/images/ri-arrow-up-line.png" alt="" />
                    
                </div>
                <div className="uploadInfo">
                    We recommend using high quality .jpg, .webp and .png files less than
                    10 MB
                </div>
                <label className="upload-label">
                <p>Click to upload an image or video</p>
                <input
                    type="file"
                    onChange={handleMediaChange}
                    className="upload-image-input"
                />
                </label>
            </div>
          )}
        

      <form onSubmit={handlePublish}>
        <div className="createForm">

        {wrongType && (
          <div className="uploadInfo text-danger">
            Wrong file type for {mediaType}
          </div>
        )}


        {/* 2) title & link */}
        <div className="createFormItem">
          <label>Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="createFormItem">
          <label>Link (optional)</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* 3) tags */}
        <div className="createFormItem">
          <label htmlFor="tags">Tagged topics</label>
          <div className="input-tag-container">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Type a tag and click '+'"
            />
            <Button onClick={addTag} 
                className="remove-button"
                title="Add Tag"
            >
                <span className="add-tag-sign">+</span>
            </Button>
          </div>
          <div className="tag-container">
            {tags.map((t, i) => (
              <span key={i} className="tag-item">
                {t}
                <button 
                    onClick={() => removeTag(i)}
                    className="remove-button"
                >
                    ×
                </button>
              </span>
            ))}
          </div>
        </div>
        </div>
      </form>
      </div>





    </div>
  );
}


// import React, { useState } from 'react';

// const CreatePage = () => {
//   // State for the input value and the list of tags
//   const [inputValue, setInputValue] = useState('');
//   const [tags, setTags] = useState([]);

//   // Handler to add a new tag

//   const handleSubmit = (e) => {
//     e.preventDefault();
    


//     }
//   const handleAddTag = (e) => {
//     e.preventDefault();
//     const trimmed = inputValue.trim();
//     if (trimmed && !tags.includes(trimmed)) {
//       setTags([...tags, trimmed]);
//     }
//     setInputValue('');
//   };

//   // Handler to remove a tag by index
//   const handleRemoveTag = (indexToRemove) => {
//     setTags(tags.filter((_, i) => i !== indexToRemove));
//   };

//   return (
//     <div>
//       <div className="createTop">
//         <h1>Create</h1>
//         <button type="submit">Publish</button>
//       </div>
//       <div className="createBottom">
//         <div className="upload">
//           <div className="uploadtitle">
//             <img src="/images/ri-arrow-up-line.png" alt="" />
//           </div>
//           <div className="uploadInfo">
//             We recommend using high quality .jpg files less than 10 MB or .mp4 less than 50 MB
//           </div>
//         </div>
//         <form onSubmit={handleSubmit}>
//         <div className="createForm">
            
        
//           <div className="createFormItem">
//             <label htmlFor="title">Title</label>
//             <input
//               type="text"
//               placeholder="Add a title..."
//               name="title"
//               id="title"
//               required
//             />
//           </div>

//           <div className="createFormItem">
//             <label htmlFor="link">Link</label>
//             <input
//               type="text"
//               placeholder="Add a link..."
//               name="link"
//               id="link"
//             />
//           </div>

//           <div className="createFormItem">
//             <label htmlFor="tags">Tagged topics</label>

//             {/* Input + Add Button */}
//             <div className="input-tag-container">
//               <input
//                 type="text"
//                 placeholder="Add tags"
//                 name="tags"
//                 id="tags"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//               />
//               <button className="remove-button" onClick={handleAddTag}>
//                 Add
//               </button>
//             </div>

//             {/* Render tags */}
//             <div className="tag-container">
//               {tags.map((tag, idx) => (
//                 <div key={idx} className="tag-item">
//                   {tag}
//                   <button
//                     type="button"
//                     className="remove-button"
//                     onClick={() => handleRemoveTag(idx)}
//                   >
//                     X
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreatePage;




// import React from 'react'

// const CreatePage = () => {
//   return (
//     <div>
//       <div className="createTop">
//         <h1>Create</h1>
//         <button>Publish</button>
//       </div>
//       <div className="createBottom">
//         <div className="upload">
//             <div className="uploadtitle">
//                 <img src="/images/ri-arrow-up-line.png" alt=''/>
//             </div>
//             <div className="uploadInfo">
//                 We recommend using high quality 
//                 .jpg files less than 10 MB or 
//                 .mp4 less than 50 MB
//             </div>
//         </div>
//         <form action="createForm">
//             <div className="createFormItem">
//                 <label htmlFor="title">Title</label>
//                 <input 
//                     type="text" 
//                     placeholder='Add a title...' 
//                     name="title" 
//                     id="title" 
//                 />
//             </div>
            
//             <div className="createFormItem">
//                 <label htmlFor="link">Link</label>
//                 <input 
//                     type="text" 
//                     placeholder='Add a link...' 
//                     name="link" 
//                     id="link" 
//                 />
//             </div>
            
//             <div className="createFormItem">
//                 <label htmlFor="tags">Tagged topics</label>
//                 <div className="input-tag-container">
//                     <input 
//                     type="text" 
//                     placeholder='Add tags' 
//                     name="tags" 
//                     id="tags" 
//                     />
//                     <button className="remove-button" >
//                         Add
//                     </button>
//                 </div>
                

//                 <div className="tag-container">
//                     <div className="tag-item">
//                         Register
//                         <button className="remove-button" >X</button>
//                     </div>
                    
//                 </div>
//             </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default CreatePage
