import React, { useEffect, useState, useRef } from 'react';
import { apiFetch } from '../app/utilitis/apis/fetchWrapper';
import useAuthStore from '@/app/utilitis/apis/useAuthStore';
import { redirect } from 'next/navigation';
import { Modal, Button, CloseButton } from 'react-bootstrap';
import {
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";


const PostInteractions = ({ pinId, fetchedLikes, postedById }) => {
  const [likePost, setLikePost] = useState(false);
  const [likes, setLikes] = useState(fetchedLikes || 0);
  const isLoggedIn = useAuthStore.getState().isLoggedIn; 
  const [following, setFollowing] = useState(false);
  const [showFollowButton, setShowFollowButton] = useState(true);
  const user = useAuthStore.getState().user;
  const user_id = useAuthStore.getState().user?._id;
  const [showShare, setShowShare] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = "Check out this post!";
  const [copy, setCopy] = useState(false)

  const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleLogIn = () => {
            setShow(false)

        redirect("/login")
    }
    const handleSignUp = () => {
            setShow(false)

        redirect("/sign-up")
    }

  useEffect(()=>{
    if (user_id && postedById && user_id === postedById) {
      setShowFollowButton(false);
    }
    
  }, [user, user_id, postedById]);



  useEffect(() => {
    
    async function fetchPostDetails () {
    
    try {
      let res;
      if (isLoggedIn) {
        res = await apiFetch('/api/fetchPostDetails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user_id })
        });
      } 


      const { likedPins, following } = await res?.json();
      likedPins?.forEach(pin => {
        if (pin._id === pinId) return setLikePost(true);
      });

      following?.map((follower) => {
        if (follower._id === postedById) return setFollowing(true);
      })
      
    } catch (err) {
      console.error('Error fetching likedPins:', err);
      return [];
    }
}

    fetchPostDetails();
    
  }, [])

  function updateLikes(nextCount, liked) {
    
    try {
      apiFetch('/api/updateLikes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pinId: pinId,
          likes: nextCount,
          userId: user_id,
          addPin: liked
        }),
      })
      
      
    } catch (err) {
        console.error('Failed to sync likes on unmount:', err);
    }


  };

  async function updateFollowers() {
    if (!following) {
      
      try {
        await apiFetch('/api/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user_id,
            targetUserId: postedById
          }),
        })
        
        // const follow = await res.json();
        // follow.followers.map()
      } catch (err) {
          console.error('Failed to sync likes on unmount:', err);
      }
    }
    else{
      try {
          await apiFetch('/api/unfollow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              userId: user_id,
              targetUserId: postedById
            }),
          }
        )
        

        // const unFollow = await res.json();
        // console.log(unFollow)

      } catch (err) {
          console.error('Failed to sync likes on unmount:', err);
      }
    }
  }

const changeFollowButton = () => {
  if (isLoggedIn) {
    setFollowing(prev => !prev);
    updateFollowers();
  } else {
    setShow(true)
  }
  
}

  const changeHeartIcon = () => {
    if (isLoggedIn) {
      const nextIsLiked = !likePost;      
    setLikePost(nextIsLiked);

    setLikes(prev => {
      const nextCount = nextIsLiked ? prev + 1 : prev - 1;
    updateLikes(nextCount, nextIsLiked);
      return nextCount;
    });
    } else {
      setShow(true)
    }
    

  };

  return (
    <div className="postInteractions">
      <Modal show={show} onHide={handleClose} centered backdrop="static" className='logout-overlay'>
        <Modal.Header className="logout-overlay-header">
          <CloseButton variant="white" onClick={handleClose} />
        </Modal.Header>
        <Modal.Body className='logout-overlay-text'>
          <p>Please login or sign in to perform this action</p>
        </Modal.Body>
        <Modal.Footer className='logout-overlay-footer'>
          <Button variant="danger" onClick={handleLogIn}>
            Login
          </Button>
          <Button variant="secondary" onClick={handleSignUp}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="interactionIcons">
         
        <div className="like-post" onClick={changeHeartIcon}>
            <img
              src={likePost ? '/images/ri-heart3fill.png' : '/images/Like a post.png'}
              alt="like post"
            />
            {likes || 0}
          </div>
        
        
          
        <div className="share-wrapper">
          <div
            className="share-icon"
            onClick={() => setShowShare(!showShare)}
          >
            <img src="/images/bs-fill-share-fill.png" alt="share" />
          </div>

          {showShare && (
            <div className="share-tray">
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <WhatsappIcon size={32} round />
                <small>WhatsApp</small>
              </WhatsappShareButton>
              <TelegramShareButton url={shareUrl} title={shareTitle}>
                <TelegramIcon size={32} round />
                <small>Telegram</small>
              </TelegramShareButton>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <TwitterIcon size={32} round />
                <small>Twitter</small>
              </TwitterShareButton>
              <button
                className="copy-link-btn"
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl);
                  setCopy(true)
                }}
              ><img src="/images/copy_icon.jpg" width={15} height={15}/>
                { copy ? "Copied" : "Copy"}
              </button>
                
            </div>
          )}
      </div>
        
      </div>
      
      {showFollowButton && <button 
        className="button"
        style={following ? 
          {backgroundColor: "white", color: "black"}
          :
          {backgroundColor: "red", color: "white"}
        }
        onClick={changeFollowButton}
      >
        {following ? "Following" : "Follow"}
      </button> }
    </div>
  );
};

export default PostInteractions;


// import React, { useEffect } from 'react'
// import { useState } from 'react'

// const PostInteractions = ({fetchedLikes}) => {

//   const [likePost, setLikePost] = useState(false)
//   const [likes, setLikes] = useState(0);

//   useEffect(()=>{
//     setLikes(fetchedLikes)
//   }, []);

//   function changeHeartIcon() {
//     setLikePost((prev)=>!prev)
//     if (likePost) {
//       setLikes((prev)=>prev-1)
//     }
//     else {
//       setLikes((prev)=>prev+1)
//     }
//   }

//   return (
//     <div className='postInteractions'>
//       <div className="interactionIcons">
//         <div className='like-post' onClick={changeHeartIcon}>
//           {!likePost ?
//             (<img src="/images/Like a post.png"  alt="like post" />) 
//           : 
//             (<img src="/images/ri-heart3fill.png"  alt="like post" />)
//           }
//           {likes}
//         </div>

//         <div>
//           <img src="/images/bs-fill-share-fill.png"  alt="share"/>
//         </div>
//         <div>
//           <img src="/images/bs-three-dots.png"  alt="options"/>
//         </div>

//       </div>
//       <button>Save</button>
//     </div>
//   )
// }

// export default PostInteractions
