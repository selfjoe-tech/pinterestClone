// "use client";
// import React, { useRef, useState, useEffect } from "react";
// import Link from "next/link";

// export default function VideoPin({ pin }) {
//   const videoRef = useRef(null);
//   const [duration, setDuration] = useState(0);
//   const videoUrl = pin?.video?.asset?.url;
//   if (!videoUrl) return null;

//   // grab video duration
//   useEffect(() => {
//     const vid = videoRef.current;
//     if (!vid) return;
//     function onMeta() {
//       setDuration(vid.duration);
//     }
//     vid.addEventListener("loadedmetadata", onMeta);
//     return () => vid.removeEventListener("loadedmetadata", onMeta);
//   }, []);

//   // format mm:ss
//   const mmss = (s) =>
//     `${Math.floor(s/60).toString().padStart(2,"0")}:${Math.floor(s%60)
//       .toString()
//       .padStart(2,"0")}`;

//   return (
//     <div className="galleryItem">
//       {duration > 0 && (
//         <div className="durationOverlay">{mmss(duration)}</div>
//       )}

//       <video
//         ref={videoRef}
//         src={videoUrl}
//         loop
//         muted
//         preload="metadata"
//         onMouseEnter={() => videoRef.current?.play()}
//         onMouseLeave={() => videoRef.current?.pause()}
//       />

//       <Link href={`/pin/${pin._id}`} className="overlay" />

//       <button className="saveButton">Save</button>

//       <div className="overlayIcons">
//         <button>
//           <img src="/images/share.svg" alt="Share icon" />
//         </button>
//         <button>
//           <img src="/images/more.svg" alt="More icon" />
//         </button>
//       </div>
//     </div>
//   );
// }


import Link from 'next/link';
import React, { useRef, useState, useEffect } from "react";

const VideoPin= ({ pin }) => {
    
  if (!pin?.video?.asset?.url) return null;
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
        className="galleryItem" 
        // style={{ gridRowEnd: `span ${span}` }}
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => videoRef.current?.pause()}
    >
        {duration > 0 && (
                <div className="durationOverlay">
                    {mmss(duration)}
                </div>
            )
        }
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
      <Link href={`/pin/${pin._id}`} className="overlay">
      </Link> 
      <div className="overlayIcons">
        <button>
          <img src="/images/more.svg" alt="More icon" />
        </button>
      </div>
    </div>
  );
};

export default VideoPin;
