import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import useAuthStore from '../app/utilitis/apis/useAuthStore';
import { apiFetch } from "../app/utilitis/apis/fetchWrapper"
import { Button, Spinner } from 'react-bootstrap';


    
const EditProfile = ( {profileId, onSuccess} ) => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [imageAsset, setImageAsset] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [wrongImageType, setWrongImageType] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
          const next = { ...prev };
          if (value.trim()) {
            next[name] = value;
          } else {
            delete next[name];
          }
          return next;
        });
    };

      const uploadImage = (e) => {
        
        const file = e.target.files[0];
        if (!file) return;
    
        const isSupported =
          file.type === 'image/png' ||
          file.type === 'image/svg+xml' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/gif' ||
          file.type === 'image/tiff';
    
        if (!isSupported) {
          setWrongImageType(true);
          return;
        }
    
        setWrongImageType(false);
        setLoading(true);
        setImageAsset(file);
    
        // generate a local preview URL
        const url = URL.createObjectURL(file);
        setImagePreviewUrl(url);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    // build a FormData payload
    const fd = new FormData();
    fd.append('userId', profileId);
    // append all of your formData keys/values
    Object.entries(formData).forEach(([key, val]) => {
        // only append non‐empty
        if (val != null && val !== '') {
        fd.append(key, val);
        }
    });
    // if the user picked an image file…
    if (imageAsset) {
        fd.append('profileImage', imageAsset);
    }

    let res;
    if (fd !== null) {
        (isLoggedIn  ? 
            (
                res = await apiFetch('/api/updateProfile', {
                    method: 'POST',
                    body: fd
                    }
                )
            ) 
            : 
            (
                res = await fetch('/api/updateProfile', {
                    method: 'POST',
                    body: fd
                    }
                )
            )
        )
    } else {
        setLoading(false)
    }
    

    if (res.ok) {
        setTimeout(() => {
            onSuccess?.();
            window.location.reload()
          }, 10_000);


    } else {
        const text = await res.text();
        console.error('update failed payload:', [...fd.entries()], 'server said:', text);
    }
    };
    
      // clean up the object URL when the component unmounts or preview URL changes
      useEffect(() => {
        return () => {
          if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        };
      }, [imagePreviewUrl]);


    const removeImage = () => {
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
        
      };

  return (
    <div className="createPage">
      <div className="createTop">
        <h1>Edit Profile</h1>
      </div>
      <div className="createBottom">
        {wrongImageType && <div className="uploadInfo">Incorrect file type</div>}

        {imagePreviewUrl ? (
          // since Next’s <Image> won’t accept blob:// URLs by default,
          // use a standard <img> for preview
          <div className="imageContainer">
            <img
                src={imagePreviewUrl}
                className="upload-image"
                alt="uploaded preview"
                style={{ maxWidth: '100%', height: 'auto' }}
            />
            <button 
                onClick={removeImage}
                title='remove image'
                className="profileButton edit-profile-button remove-button">
                <Image 
                    src="/images/bs-trash3.png"
                    height={16}
                    width={16}
                    alt="Edit Profile Button"
                />
            </button>
          </div>
        ) : (
          <label className="upload">
            <div className="uploadtitle">
              <img src="/images/ri-arrow-up-line.png" alt="" />
            </div>
            <div className="uploadInfo">
              We recommend using high quality .jpg, .webp and .png files less than
              10 MB
            </div>
            <input
              type="file"
              name="upload-image"
              onChange={uploadImage}
              className="upload-image-input"
            />
          </label>
        )}

        <form onSubmit={handleSubmit} className='editForm'>
          <div className="createFormContainer">
            <div className="createFormItem">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                placeholder="Change Username"
                name="userName"
                id="username"
                onChange={handleChange}
                
              />
            </div>
            <div className="createFormItem">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="Change Email"
                name="email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="createFormItem">
              <label htmlFor="email">Bio</label>
              <textarea
                rows={6} 
                type="text" 
                placeholder='Tell us about yourself...' 
                name="bio" 
                id="description" 
                onChange={handleChange}
                />
            </div>
            <div className="createFormItem">
              <label htmlFor="email">Instagram Link</label>
              <input
                type="text"
                placeholder="Add Instagram Link"
                name="instagram"
                id="instagramlink"
                onChange={handleChange}
              />
            </div>

            <div className="createFormItem">
              <label htmlFor="email">X Link</label>
              <input
                type="text"
                placeholder="Add X Link"
                name="x"
                id="xlink"
                onChange={handleChange}
              />
            </div>

            <div className="createFormItem">
              <label htmlFor="email">YouTube Link</label>
              <input
                type="text"
                placeholder="Add YouTube Link"
                name="youtube"
                id="youtubelink"
                onChange={handleChange}
              />
            </div>
            <div className="createFormItem">
              <label htmlFor="email">Onlyfans Link</label>
              <input
                type="text"
                placeholder="Add Onlyfans Link"
                name="onlyfans"
                id="onlyfanslink"
                onChange={handleChange}
              />
            </div>
            <div className="passwordFormItemContainer">
              <label htmlFor="password">Password</label>
              <div className="passwordFormItem">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Edit Password"
                  name="password"
                  id="password"
                  className="password-input change-password"
                  onChange={handleChange}
                />
                <div>
                  <Image
                    className="show-password"
                    src={showPassword ? '/images/bs-eye-fill.png' : '/images/bs-eye-slash-fill.png'}
                    width={25}
                    height={25}
                    onClick={() => setShowPassword((p) => !p)}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="decision-buttons">
            <Button 
             variant="secondary" 
             onClick={() => onSuccess()}
            >
                Cancel
            </Button>

            <Button variant="danger" type="submit" disabled={loading}>
                {loading ? 
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    : 
                    'Save'
                }
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
