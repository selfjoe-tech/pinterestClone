import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { urlFor } from '@/sanity/client';
import Image from 'next/image';

const CollagePin = ({ story, _id }) => {
  const pin = story.media[0];
  if (pin?.image) {
    const height = pin.image?.asset?.metadata?.dimensions?.height || 1000;
    const span = Math.ceil(height / 100);

    return (
        
        <div 
            className="galleryItem collage-item" 
            style={{ gridRowEnd: `span ${span}` }}
        >
        <div className="durationOverlay">
            
            Collage {
                <img
                    src="/images/sparkles.png"
                    alt="sparkle image"
                    className="sparkle-icon"
                />
        }
        </div>
        <Image
            src={urlFor(pin.image).url()} 
            alt={pin.title || "Gallery item"} 
            height={750} 
            width={300} 
            className='feed-pin'
            onContextMenu={e => e.preventDefault()}
        />
        <Link href={`/pin-collage/${_id}`} className="overlay">
        </Link>
        <div className="overlayIcons">
            <button>
            <img src="/images/more.svg" alt="More icon" />
            </button>
        </div>
        </div>
    );
  }
  

  if (pin?.video) {
    const videoUrl = pin.video?.asset?.url;
    // const height = pin.video.asset.metadata?.dimensions?.height || 1000;
    // const span = Math.ceil(height / 100);

    const videoRef = useRef(null);
    const [duration, setDuration] = useState(0);

    // When metadata loads, grab duration (in seconds)
    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;

        function onLoadedMeta() {
        setDuration(vid.duration);
        }

        vid.addEventListener("loadedmetadata", onLoadedMeta);
        return () => vid.removeEventListener("loadedmetadata", onLoadedMeta);
    }, []);

    const mmss = (sec) => {
        const m = Math.floor(sec / 60)
        .toString()
        .padStart(2, "0");
        const s = Math.floor(sec % 60)
        .toString()
        .padStart(2, "0");
        return `${m}:${s}`;
    };


    return (
    
        <div 
            className="galleryItem collage-item" 
            // style={{ gridRowEnd: `span ${span}` }}
            onMouseEnter={() => videoRef.current?.play()}
            onMouseLeave={() => videoRef.current?.pause()}
        >
        
            <div className="durationOverlay">
                Collage {
                    <img
                        src="/images/sparkles.png"
                        alt="sparkle image"
                        className="sparkle-icon"
                    />
            }
            </div>
            
            <video
                ref={videoRef}
                width="100%"
                height="auto"
                preload="metadata"
                style={{ maxWidth: '100%' }}
                loop
                muted
                controlsList="nodownload"
                onContextMenu={e => e.preventDefault()}
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser doesnt support HTML5 video.
            </video>
        <Link href={`/pin-collage/${_id}`} className="overlay">
        </Link>
        <div className="overlayIcons">
            <button>
            <img src="/images/more.svg" alt="More icon" />
            </button>
        </div>
        </div>
    
    );
  }
  
};

export default CollagePin;
