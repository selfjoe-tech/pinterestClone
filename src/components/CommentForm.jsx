import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import Image from 'next/image';
import useAuthStore from '@/app/utilitis/apis/useAuthStore';
import { apiFetch } from '@/app/utilitis/apis/fetchWrapper';
import { Spinner } from 'react-bootstrap';
import { Modal, Button, CloseButton } from 'react-bootstrap';


const CommentForm = ({ onNewComment, pinId }) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const containerRef = useRef(null);
  const [showSendButton, setShowSendButton] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => {
    const value = e.target.value;
    setComment(value);
    if (value.trim().length > 0) {
      setShowSendButton(true);
    } else {
      setShowSendButton(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleEmojiPanel = () => {
    setOpen(prev => !prev);
  };

  const handleEmojiClick = (emojiData, event) => {
    setComment(prev => prev + emojiData.emoji);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      setLoading(true)
      try {
        let response;
          response = await apiFetch('/api/addComment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            pinId, 
            text: comment, 
            postedById: user?._id
          })
          
        })


        // const response = await fetch('/api/addComment', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ pinId, 
        //     text: comment, 
        //     postedById: useAuthStore.getState().user?._id 
        //   })
        // });
        const newComment = await response.json();
        if (response.ok) {
          onNewComment(newComment);
          setComment(""); 
          setShowSendButton(false);
          setLoading(false)
        } else {
          console.error(newComment.error);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setShow(true)
    }
    
  };

  return (
    <div className="formContainer" ref={containerRef}>
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
      <form className="commentForm" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          name="comment"
          onChange={handleChange}
        />
        {showSendButton && (loading ? 
            (
              <Spinner 
                animation="border" 
                variant="secondary"
                size="sm"  
              />
            ) 
            : 
            (
              <button 
                className="send-comment" 
                type="submit"
              >
                <Image src="/images/Send button.png" 
                width={20} 
                height={20} 
                alt="Send Comment Button" />
              </button>
            ))
        }
      </form>
      <div className="emoji">
        <div onClick={toggleEmojiPanel} style={{ cursor: 'pointer' }}>
          😊
        </div>
        {open && (
          <div className="emojiPicker">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentForm;