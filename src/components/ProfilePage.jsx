"use client";
import React, { useEffect, useState } from 'react'
import useAuthStore from "../app/utilitis/apis/useAuthStore"
import { urlFor } from "../sanity/client"
import Image from 'next/image';
import LikedPinsGallery from "./LikedPinsGallery"
import { apiFetch } from '../app/utilitis/apis/fetchWrapper';
import { redirect } from 'next/navigation';
import { Modal, Button, CloseButton } from 'react-bootstrap';
import EditProfile from "./EditProlfile"            
import Loading from "./Loading"
import CreatePinsGallery from "./CreatedPinsGallery"

const ProfilePage = ({ profileId }) => {
  const [type, setType] = useState("saved");
  const [userData, setUserData] = useState();
  const [show, setShow] = useState(false);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const userId = user?._id;
  const showButtons = userId && userId === profileId;
  console.log(profileId)

  // useEffect(() => {
  //     if (!id) return;
  //     (async () => {
  //       const res = isLoggedIn
  //         ? await apiFetch('/api/fetchPost', {
  //             method: 'POST',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify({ pinId: id }),
  //           })
  //         : await fetch('/api/fetchPost', {
  //             method: 'POST',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify({ pinId: id }),
  //           });
  //       const data = await res.json();
  //       setPinData(data[0]);
  //       setComments(data.comments || []);
  //     })();
  //   }, [id, isLoggedIn]);



  useEffect( () => {
    if (!profileId) return;
    (async () => {
      const res = isLoggedIn
        ? await apiFetch("/api/fetchUserData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: profileId }),
          })
        : await fetch("/api/fetchUserData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: profileId }),
          });

      const data = await res.json();
      console.log(data)
      setUserData(data);
    })() 
    }, [profileId])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleShowForm = () => setShowEditProfileForm(true);
    const handleCloseForm = () => setShowEditProfileForm(false);

  function handleLogout() {
    logout();
    redirect("/login");
  }
  
  if (!userData) {
    return <Loading />
  } 

  return ( 
    <div className='profilePage'>
      {showButtons && 
          <button onClick={handleShow} className="profileButton log-out-button" title='Log out'>
              <Image 
                src="/images/ri-logout-box-rline.png"
                height={20}
                width={20}
                alt="Logout icon"
              />
          </button>
      }
      
      <Modal show={show} onHide={handleClose} centered backdrop="static" className='logout-overlay'>
        <Modal.Header className="logout-overlay-header">
          <CloseButton variant="white" onClick={handleClose} />
        </Modal.Header>
        <Modal.Body className='logout-overlay-text'>
          <p>Are you sure you want to Log out?</p>
        </Modal.Body>
        <Modal.Footer className='logout-overlay-footer'>
          <Button variant="danger" onClick={handleLogout}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>



      <Modal show={showEditProfileForm} 
        onHide={handleCloseForm} 
        centered backdrop="static" 
        className='logout-overlay'
      >
        <Modal.Header 
          className="logout-overlay-header"
        >
            <CloseButton 
              variant="white" 
              onClick={handleCloseForm} 
            />

        </Modal.Header>
        <Modal.Body 
          className='logout-overlay-text'
        >

          <EditProfile 
            profileId={profileId}
            onSuccess={() => setShowEditProfileForm(false)}
          />

        </Modal.Body>
        <Modal.Footer className='logout-overlay-footer'>
        
          
        </Modal.Footer>
      </Modal>


      <div className="profileImage">
        
        <Image 
          src={ userData && (userData.profileImage ? 
            urlFor(userData.profileImage).url() 
            :
            "/images/noAvatar.png" )
            
            }
          alt="profile Image" 
          height={175}
          width={175}
          className="profile-pic"
        />
        {/* <button className="edit-button">
          <Image
            src="/images/Edit button.png"
            alt="edit button" 
            height={40}
            width={40}
          />
        </button> */}
        {showButtons && 
          <button 
          onClick={handleShowForm}
          className="profileButton edit-profile-button">
            <Image 
              src="/images/bs-pencil.png"
              height={25}
              width={25}
              alt="Edit Profile Button"
            />
          </button>
        }
        
      </div>
      
      <h1 className='profileName'>{userData?.userName}</h1>
      <div className="followCounts">{userData.followers?.length || 0} follwers       .      {userData.following?.length || 0 } following</div>
      <span>{userData.bio || ""}</span>
      <div className="profileInteractions">
        
        <div className="profileButtons">
          
          {userData.instagram && (
              <button className="profileButton" title='Instagram'>
                <Image 
                  src="/images/instagram.png"
                  height={20}
                  width={20}
                  alt="instagram link button"
                />
              </button>
            )
          }
          {userData.x && (
              <button className="profileButton" title='X' onClick={() => redirect(userData.x)}>
                <Image 
                  src="/images/x.png"
                  height={20}
                  width={20}
                  alt="x link button"
                />
              </button>
            )
          }
          {userData.onlyfans && (
              <button className="profileButton" title='Onlyfans' onClick={() => redirect(userData.onlyfans)}>
                <Image 
                  src="/images/onlyfans.png"
                  height={20}
                  width={20}
                  alt="onlyfans link button"
                />
              </button>
            )
          }
          {userData.youtube && (
              <button className="profileButton" title='YouTube' onClick={() => redirect(userData.youtube)}>
                
                <Image 
                  src="/images/youtube.png"
                  height={15}
                  width={20}
                  alt="youtube link button"
                />
              </button>
            )
          }
        </div>

        
      </div>
      {/* <div className="col">
        <div className="card mb-4 rounded-3 shadow-sm">
          <div className="card-header py-3">
            <h4 className="my-0 fw-normal">Premium Experience</h4>
          </div>
          <div className="card-body">
            <h1 className="card-title pricing-card-title">$2</h1>
            <ul className="list-unstyled mt-3 mb-4">
              <li>Once-off payment</li>
              <li>No Ads</li>
            </ul>
            <button type="button" className="w-100 btn btn-lg btn-outline-primary">Get Started</button>
          </div>
        </div>
      </div> */}
      <div className="profileOptions">
        
        <span onClick={() => setType("created")} className={type==="created" ? "active": ""}>Created</span>
        <span onClick={() => setType("saved")}className={type==="saved" ? "active": ""}>Liked Pins</span>
      </div>
        {type==="saved" ? <LikedPinsGallery pins={userData?.likedPins}/> : <CreatePinsGallery pins={userData?.myPins}/> }
      
    </div>
  )
}

export default ProfilePage
