import React, { useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import Image from 'next/image';
import { urlFor } from '@/sanity/client';
import { useEffect } from 'react';

const Comments = ( {newComments} ) => {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([])

  useEffect(() => {
    setComments(newComments || []);
  }, [newComments]);

  function returnNumberOfComments() {
    if (comments?.length > 0) {
      const statement = `${comments.length} Comments`
      return statement
    }
    else if (comments?.length === 1) {
      const statement = `${comments.length} Comment`
      return statement
    }
    else {
      return "No comments"
    }
  };

  return (
    <>
      <div className=" gap-1">
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="collapseComments"
          aria-expanded={open}
          variant="primary"
        >
          {returnNumberOfComments()} 
        </Button>
        <Image
          src={open ?
             "/images/ri-arrow-up-sline.png"
            : 
             "/images/ri-arrow-down-sline.png"
          }
          width={30}
          height={30}
          alt="open comment arrow"
          onClick={() => setOpen(!open)}
        />
      </div>
      <Collapse in={open}>
        <div id="collapseComments">
        {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment">
                  <Image
                    src={comment.postedBy.profileImage ? urlFor(comment.postedBy.profileImage).url() : "/images/noAvatar.png"}
                    alt={comment.postedBy.userName}
                    width={175}
                    height={175}
                  />
                  <div className="commentContent">
                    <span>{comment.postedBy.userName}</span>
                    <p className="commentText">{comment.text}</p>
                    <span className="commentTime">
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Be the first to comment</p>
          )}
        </div>
      </Collapse>
    </>
  );
};

export default Comments;
{/* <div className="commnets">
        <div className="commentList">
          <span className="commentCounter">5 comments</span>
          <div className="comment">
            <img src="/images/noAvatar.png" alt=''/>
            <div className="commentContent">
              <span>John Doe</span>
              <p className='commentText'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit qui dolores et at eum.  
              </p>
              <span className='commentTime'>1h</span>
            
            </div>
          </div>
        </div>
        
       
    </div> */}