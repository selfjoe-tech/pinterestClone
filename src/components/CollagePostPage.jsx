"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image';
import PostInteractions from './PostInteractions';
import Comments from './Comments';
import Link from 'next/link';
import { urlFor } from '@/sanity/client';
import Gallery from './gallery';
import { useRouter } from 'next/navigation';
import CommentForm from "./CommentForm";
import { apiFetch } from "../app/utilitis/apis/fetchWrapper";
import useAuthStore from '@/app/utilitis/apis/useAuthStore';
import Tags from "./Tags";
import Loading from './Loading';
import { StoriesCarousel } from "./Collage"


export default function CollagePostPage({ id }) {
  const [pinData, setPinData] = useState(null);
  const [comments, setComments] = useState([]);
  const [returnBackIcon, setReturnBackIcon] = useState(false);


  const router = useRouter();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  
  const addComment = useCallback(c => {
    setComments(a => [...a, c]);
  }, []);

  const categories = useMemo(
    () => pinData?.categories?.map((c) => c.title) || [],
    [pinData]
  );
  const [bgColor, setBgColor] = useState("#ffffff");
    
    function getRandomColor() {
    return "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0");
  }
  
  useEffect(() => {
      setBgColor(getRandomColor());
    }, []); 

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = isLoggedIn
        ? await apiFetch('/api/fetchPost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pinId: id }),
          })
        : await fetch('/api/fetchPost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pinId: id }),
          });
      const data = await res.json();
      console.log(data)
      console.log(data[0])
      setPinData(data[0]);
      setComments(data[0].comments || []);
      
    })();
  }, [id, isLoggedIn]);

  useEffect(() => {
    const onResize = () => setReturnBackIcon(window.innerWidth > 788);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);


  if (!pinData) {
    return <Loading />;
  };

  const imageObj = pinData.image;
  const videoObj = pinData.video;
  // const collageArray = pinData.
  const hasImage = Boolean(imageObj);
  const hasVideo = Boolean(videoObj?.asset?.url);
  const imageUrl = hasImage ? urlFor(imageObj).url() : null;
  const videoUrl = hasVideo ? videoObj.asset.url : null;


  return (
    <div className="outerPostPageContainer">
      <div className="postPageContainer">
        <div className="postPage">
          {returnBackIcon && (
            <Image
              src="/images/bs-arrow-left.png"
              width={30}
              height={30}
              alt="back"
              onClick={() => router.back()}
            />
          )}

          <div className="postContainer">
            {hasImage ? (
              <div className="postImg">
                <Image
                  src={imageUrl}
                  alt={pinData.title || 'Post Image'}
                  width={736}
                  height={1200}
                />
              </div>
            ) : hasVideo ? (
              <video
                width="100%"
                height="auto"
                preload="metadata"
                className="postVideo"
                loop
                controls
                controlsList="nodownload"
                onContextMenu={e => e.preventDefault()}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser doesnt support HTML5 video.
              </video>
            ) : (
              <div 
                className="story-container"
                style={{backgroundColor: bgColor}}
              >
                <div className="story">
                  <StoriesCarousel story={pinData.stories[0].media}/>
                </div>
              </div>
              
            )}

            <div className="postDetails">
              <PostInteractions
                fetchedLikes={pinData.likes}
                pinId={pinData._id}
                postedById={pinData.postedBy._id}
              />
              <span style={{fontSize: "25px"}}>{pinData.title}</span>
              <Link
                href={`/profile-page/${pinData.postedBy._id}`}
                className="postUser"
              >
                <div className="profile-container">
                  <Image
                    src= {pinData.postedBy.profileImage ? urlFor(pinData.postedBy.profileImage).url() : "/images/noAvatar.png"}
                    alt={pinData.postedBy.userName}
                    height={32}
                    width={32}
                  />
                </div>
                
                <span>{pinData.postedBy.userName}</span>
              </Link>
              <Tags categoriesArray={categories}/>
              <Comments newComments={comments} />
              <CommentForm onNewComment={addComment} pinId={id} />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="app">
            <div className="content">
              <Gallery />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}