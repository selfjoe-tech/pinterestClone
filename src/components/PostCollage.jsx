"use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Carousel, ProgressBar } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { urlFor } from "../sanity/client";

// export function StoriesCarousel({ story }) {
//   // 1) Build up a local array of {id, mediaType, src} each render:
//   const STORIES = [];
//   story.forEach((item, index) => {
//     if (item.mediaType === "video") {
//       STORIES.push({
//         id: index,
//         src: item.video?.asset?.url,
//         mediaType: "video",
//       });
//     } else {
//       STORIES.push({
//         id: index,
//         src: urlFor(item.image).url(),
//         mediaType: "image",
//       });
//     }
//   });

//   const DEFAULT_MS = 5000;
//   const [idx, setIdx] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [paused, setPaused] = useState(false);

//   // Keep durations.current in sync with whatever STORIES is now
//   const durations = useRef(STORIES.map(() => DEFAULT_MS));
//   const videoEls = useRef([]);

//   const timerRef = useRef(null);
//   const startRef = useRef(0);
//   const elapsedRef = useRef(0);

//   // Whenever the incoming `story` prop changes, rebuild durations & reset carousel
//   useEffect(() => {
//     durations.current = STORIES.map(() => DEFAULT_MS);
//     clearInterval(timerRef.current);
//     setIdx(0);
//     setProgress(0);
//     elapsedRef.current = 0;
//     videoEls.current = [];
//   }, [story]);

//   // Helpers to move to next/prev slides
//   const next = useCallback(() => {
//     setPaused(false);
//     setIdx((i) => (i + 1) % STORIES.length);
//   }, [STORIES.length]);

//   const prev = useCallback(() => {
//     setPaused(false);
//     setIdx((i) => (i - 1 + STORIES.length) % STORIES.length);
//   }, [STORIES.length]);

//   // Main effect: whenever idx changes, (re)start timers & play videos
//   useEffect(() => {
//     clearInterval(timerRef.current);
//     setProgress(0);
//     elapsedRef.current = 0;

//     if (STORIES.length === 0) return;

//     const cur = STORIES[idx];
//     const isSingleVideo = STORIES.length === 1 && cur.mediaType === "video";

//     // If single video, simply play & loop natively; no manual timer
//     if (isSingleVideo) {
//       const v = videoEls.current[idx];
//       if (v) {
//         v.loop = true;          // let browser handle looping
//         v.currentTime = 0;
//         v.muted = true;
//         v.play().catch(() => {});
//       }
//       return; // skip setting up any timer
//     }

//     // For multi‐slide or single‐image cases, play & use timer
//     if (cur.mediaType === "video") {
//       const v = videoEls.current[idx];
//       if (v) {
//         v.loop = false;       // no native loop; we’ll handle next()
//         v.currentTime = 0;
//         v.muted = true;
//         v.play().catch(() => {});
//       }
//     }

//     // Start timer if it’s an image, or a video that isn’t paused
//     if (cur.mediaType === "image" || !paused) {
//       startRef.current = Date.now();
//       timerRef.current = setInterval(() => {
//         const dur = durations.current[idx];
//         const t = Date.now() - startRef.current;
//         const pct = Math.min(100, (t / dur) * 100);
//         setProgress(pct);

//         if (pct >= 100) {
//           clearInterval(timerRef.current);
//           if (STORIES.length > 1) {
//             next();
//           }
//         }
//       }, 100);
//     }

//     return () => clearInterval(timerRef.current);
//   }, [idx, next, paused, STORIES]);

//   // Pause / resume logic for videos
//   const togglePause = useCallback(() => {
//     const cur = STORIES[idx];
//     if (cur.mediaType !== "video") return;

//     const v = videoEls.current[idx];
//     if (!paused) {
//       // pausing
//       elapsedRef.current = Date.now() - startRef.current;
//       clearInterval(timerRef.current);
//       if (v) v.pause();
//     } else {
//       // resuming (only for multi‐slide or single‐video case)
//       if (STORIES.length === 1) {
//         // single‐video: just resume native play
//         if (v) {
//           v.play().catch(() => {});
//         }
//         setPaused(false);
//         return;
//       }
//       // multi‐slide video: resume the timer logic
//       startRef.current = Date.now() - elapsedRef.current;
//       timerRef.current = setInterval(() => {
//         const dur = durations.current[idx];
//         const t = Date.now() - startRef.current;
//         const pct = Math.min(100, (t / dur) * 100);
//         setProgress(pct);
//         if (pct >= 100) {
//           clearInterval(timerRef.current);
//           next();
//         }
//       }, 100);
//       if (v) v.play().catch(() => {});
//       setPaused(false);
//     }
//   }, [idx, paused, next, STORIES]);

//   // Capture real video duration once metadata loads
//   const onLoadedMeta = (i) => (e) => {
//     durations.current[i] = e.target.duration * 1000;
//   };

//   // Keyboard navigation (left, right, space)
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "ArrowLeft") prev();
//       if (e.key === "ArrowRight") next();
//       if (e.key === " ") togglePause();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [prev, next, togglePause]);

//   // Click / tap handling: left‐third = prev, right‐third = next, middle = pause/play
//   const onClick = (e) => {
//     const { left, width } = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - left;
//     if (x < width / 3) prev();
//     else if (x > (2 * width) / 3) next();
//     else togglePause();
//   };

//   return (
//     <>
//       <style jsx global>{`
//         .story-progress .progress {
//           background-color: #666 !important;
//         }
//         .story-progress .progress-bar {
//           background-color: #fff !important;
//         }
//       `}</style>

//       <div
//         onClick={onClick}
//         style={{
//           position: "relative",
//           width: "100%",
//           maxWidth: 400,
//           margin: "auto",
//           cursor: "pointer",
//         }}
//       >
//         {/* Progress bars */}
//         <div
//           className="story-progress"
//           style={{ display: "flex", gap: 4, padding: "8px 0" }}
//         >
//           {STORIES.map((_, i) => (
//             <ProgressBar
//               key={i}
//               now={i < idx ? 100 : i === idx ? progress : 0}
//               style={{ flex: 1, height: 4 }}
//             />
//           ))}
//         </div>

//         {/* Carousel slides */}
//         <Carousel
//           slide={false}
//           activeIndex={idx}
//           onSelect={(i) => {
//             setPaused(false);
//             setIdx(i);
//           }}
//           controls={false}
//           indicators={false}
//           interval={null}
//         >
//           {STORIES.map((s, i) => (
//             <Carousel.Item key={s.id}>
//               {s.mediaType === "image" ? (
//                 <div className="carousel-image-container">
//                   <img
//                     src={s.src}
//                     style={{ width: "100%", height: "auto" }}
//                   />
//                 </div>
//               ) : (
//                 <video
//                   ref={(el) => (videoEls.current[i] = el)}
//                   src={s.src}
//                   muted
//                   playsInline
//                   onLoadedMetadata={onLoadedMeta(i)}
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               )}
//             </Carousel.Item>
//           ))}
//         </Carousel>

//         {/* Pause overlay for videos */}
//         {paused && STORIES[idx]?.mediaType === "video" && (
//           <div
//             style={{
//               pointerEvents: "none",
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background: "rgba(0,0,0,0.3)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "white",
//               fontSize: 24,
//             }}
//           >
//             ❚❚
//           </div>
//         )}
//       </div>
//     </>
//   );
// }






















// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Carousel, ProgressBar } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { urlFor } from "../sanity/client";


// export function StoriesCarousel( { story } ) {
//   const STORIES = [];
//   console.log(STORIES)

//   story.map( (item, index) => {
//     if (item.mediaType === "video") {
//       let videoObj = {
//         id: index,
//         src: item.video?.asset?.url,
//         mediaType: "video",
//       }
//       STORIES.push(videoObj)
//     }
//     else {
//       let imageObj = { 
//         id: index,
//         src: urlFor(item.image).url(),
//         mediaType: "image", 
//       }
//       STORIES.push(imageObj)
//     }
//   } )

//   const DEFAULT_MS = 5000;
//   const [idx, setIdx] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [paused, setPaused]     = useState(false);
//   const timerRef   = useRef(null);
//   const startRef   = useRef(0);
//   const elapsedRef = useRef(0);
//   const durations  = useRef(STORIES.map(() => DEFAULT_MS));
//   const videoEls   = useRef([]);
  
//   const next = useCallback(() => {
//     setPaused(false);
//     setIdx(i => (i + 1) % STORIES.length);
//   }, []);
//   const prev = useCallback(() => {
//     setPaused(false);
//     setIdx(i => (i - 1 + STORIES.length) % STORIES.length);
//   }, []);
//   // ▶️ ONLY on slide-change (idx), not on paused
//   useEffect(() => {
//     clearInterval(timerRef.current);
//     setProgress(0);
//     elapsedRef.current = 0;

//     const cur = STORIES[idx];
//     if (cur.mediaType === "video") {
//       const v = videoEls.current[idx];
//       if (v) {
//         v.currentTime = 0;
//         v.muted = true;
//         v.play().catch(() => {});
//       }
//     }

//     // start the timer (images always run, videos run only if not paused)
//     if (cur.mediaType === "image" || !paused) {
//       startRef.current = Date.now();
//       timerRef.current = setInterval(() => {
//         const dur = durations.current[idx];
//         const t   = Date.now() - startRef.current;
//         const pct = Math.min(100, (t / dur) * 100);
//         setProgress(pct);
//         if (pct >= 100) {
//           clearInterval(timerRef.current);
//           next();
//         }
//       }, 100);
//     }

//     return () => clearInterval(timerRef.current);
//   }, [idx, next]);  // ← **no** `paused` here

//   // ⏸️ pause / ▶️ resume for video
//   const togglePause = useCallback(() => {
//     const cur = STORIES[idx];
//     if (cur.mediaType !== "video") return;

//     const v = videoEls.current[idx];
//     if (!paused) {
//       // pausing
//       elapsedRef.current = Date.now() - startRef.current;
//       clearInterval(timerRef.current);
//       if (v) v.pause();
//     } else {
//       // resuming
//       startRef.current = Date.now() - elapsedRef.current;
//       timerRef.current = setInterval(() => {
//         const dur = durations.current[idx];
//         const t   = Date.now() - startRef.current;
//         const pct = Math.min(100, (t / dur) * 100);
//         setProgress(pct);
//         if (pct >= 100) {
//           clearInterval(timerRef.current);
//           next();
//         }
//       }, 100);
//       if (v) v.play().catch(() => {});
//     }

//     setPaused(p => !p);
//   }, [idx, paused, next]);

//   // capture real video length
//   const onLoadedMeta = i => e => {
//     durations.current[i] = e.target.duration * 1000;
//   };

//   useEffect(() => {
//     const onKey = e => {
//       if (e.key === "ArrowLeft")  prev();
//       if (e.key === "ArrowRight") next();
//       if (e.key === " ") togglePause();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [prev, next, togglePause]);

//   const onClick = e => {
//     const { left, width } = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - left;
//     if (x < width/3)      prev();
//     else if (x > 2*width/3) next();
//     else                  togglePause();
//   };

//   return (
//     <>
//       <style jsx global>{`
//         .story-progress .progress { background-color: #666 !important; }
//         .story-progress .progress-bar { background-color: #fff !important; }
//       `}</style>
//       <div
//         onClick={onClick}
//         style={{
//           position: "relative",
//           width: "100%",
//           maxWidth: 400,
//           margin: "auto",
//           cursor: "pointer",
//         }}
//       >
//         {/* progress bars */}
//         <div className="story-progress" style={{ display: "flex", gap: 4, padding: "8px 0" }}>
//           {STORIES.map((_, i) => (
//             <ProgressBar
//               key={i}
//               now={i < idx ? 100 : i === idx ? progress : 0}
//               style={{ flex:1, height:4 }}
//             />
//           ))}
//         </div>

//         {/* carousel */}
//         <Carousel
//           slide={false}
//           activeIndex={idx}
//           onSelect={i => { setPaused(false); setIdx(i); }}
//           controls={false}
//           indicators={false}
//           interval={null}
//         >          
//           {STORIES.map((s, i) => (
//             <Carousel.Item key={s.id}>
//               {s.mediaType === "image" ? (
//                 <div className="carousel-image-container">
//                   <img src={s.src} style={{ width:"100%", height: "auto"}}/>
//                 </div>
//               ) : (
//                 <video
//                   ref={el => (videoEls.current[i] = el)}
//                   src={s.src}
//                   muted
//                   playsInline
//                   onLoadedMetadata={onLoadedMeta(i)}
//                   style={{ width:"100%", height: "100%", objectFit:"cover" }}
//                 />
//               )}
//             </Carousel.Item>
//           ))}
//         </Carousel>

//         {/* video pause overlay */}
//         {paused && STORIES[idx].mediaType === "video" && (
//           <div style={{
//             pointerEvents:"none",
//             position:"absolute", top:0,left:0,right:0,bottom:0,
//             background:"rgba(0,0,0,0.3)", 
//             display:"flex", alignItems:"center", justifyContent:"center",
//             color:"white", fontSize:24,
//           }}>
//             ❚❚
//           </div>
//         )}
//       </div>
//     </>
//   );
// }



import React, { useState, useEffect, useRef, useCallback } from "react";
import { Carousel, ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { urlFor } from "../sanity/client";


export function StoriesCarousel( { story } ) {
  const STORIES = [];
  console.log(STORIES)

  story.map( (item, index) => {
    if (item.mediaType === "video") {
      let videoObj = {
        id: index,
        src: item.video?.asset?.url,
        mediaType: "video",
      }
      STORIES.push(videoObj)
    }
    else {
      let imageObj = { 
        id: index,
        src: item?.image?.asset?.url,
        mediaType: "image", 
      }
      STORIES.push(imageObj)
    }
  } )

  const DEFAULT_MS = 5000;
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused]     = useState(false);
  const timerRef   = useRef(null);
  const startRef   = useRef(0);
  const elapsedRef = useRef(0);
  const durations  = useRef(STORIES.map(() => DEFAULT_MS));
  const videoEls   = useRef([]);
  
  const next = useCallback(() => {
    setPaused(false);
    setIdx(i => (i + 1) % STORIES.length);
  }, [story]);
  const prev = useCallback(() => {
    setPaused(false);
    setIdx(i => (i - 1 + STORIES.length) % STORIES.length);
  }, [story]);
  // ▶️ ONLY on slide-change (idx), not on paused
  useEffect(() => {
    clearInterval(timerRef.current);
    setProgress(0);
    elapsedRef.current = 0;

    const cur = STORIES[idx];
    if (cur?.mediaType === "video") {
      const v = videoEls.current[idx];
      if (v) {
        v.currentTime = 0;
        v.muted = true;
        v.play().catch(() => {});
      }
    }

    // start the timer (images always run, videos run only if not paused)
    if (cur?.mediaType === "image" || !paused) {
      startRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const dur = durations.current[idx];
        const t   = Date.now() - startRef.current;
        const pct = Math.min(100, (t / dur) * 100);
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(timerRef.current);
          next();
        }
      }, 100);
    }

    return () => clearInterval(timerRef.current);
  }, [idx, next, story]);  // ← **no** `paused` here

  // ⏸️ pause / ▶️ resume for video
  const togglePause = useCallback(() => {
    const cur = STORIES[idx];
    // if (cur.mediaType !== "video") return;

    const v = videoEls.current[idx];
    if (!paused) {
      // pausing
      elapsedRef.current = Date.now() - startRef.current;
      clearInterval(timerRef.current);
      if (v) v.pause();
    } else {
      // resuming
      startRef.current = Date.now() - elapsedRef.current;
      timerRef.current = setInterval(() => {
        const dur = durations.current[idx];
        const t   = Date.now() - startRef.current;
        const pct = Math.min(100, (t / dur) * 100);
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(timerRef.current);
          next();
        }
      }, 100);
      if (v) v.play().catch(() => {});
    }

    setPaused(p => !p);
  }, [idx, paused, next, story]);

  // capture real video length
  const onLoadedMeta = i => e => {
    durations.current[i] = e.target.duration * 1000;
  };

  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === " ") togglePause();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, togglePause, story]);

  const onClick = e => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width/3)      prev();
    else if (x > 2*width/3) next();
    else togglePause();
  };

  return (
    <>
      <style jsx global>{`
        .story-progress .progress { background-color: #666 !important; }
        .story-progress .progress-bar { background-color: #fff !important; }
      `}</style>
      <div
        onClick={onClick}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 400,
          margin: "auto",
          cursor: "pointer",
        }}
      >
        {/* progress bars */}
        <div className="story-progress" style={{ display: "flex", gap: 4, padding: "8px 0" }}>
          {STORIES.map((_, i) => (
            <ProgressBar
              key={i}
              now={i < idx ? 100 : i === idx ? progress : 0}
              style={{ flex:1, height:4 }}
            />
          ))}
        </div>

        {/* carousel */}
        <Carousel
          slide={false}
          activeIndex={idx}
          onSelect={i => { setPaused(false); setIdx(i); }}
          controls={false}
          indicators={false}
          interval={null}
        >          
          {STORIES.map((s, i) => (
            <Carousel.Item key={s.id}>
              {s.mediaType === "image" ? (
                <div className="carousel-image-container">
                  <img src={s.src} style={{ width:"100%", height: "auto"}}/>
                </div>
              ) : (
                <video
                  ref={el => (videoEls.current[i] = el)}
                  src={s.src}
                  playsInline
                  onLoadedMetadata={onLoadedMeta(i)}
                  style={{ width:"100%", height: "100%", objectFit:"cover" }}
                />
              )}
            </Carousel.Item>
          ))}
        </Carousel>

        {/* video pause overlay */}
        {paused && STORIES[idx]?.mediaType === "video" && (
          <div style={{
            pointerEvents:"none",
            position:"absolute", top:0,left:0,right:0,bottom:0,
            background:"rgba(0,0,0,0.3)", 
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"white", fontSize:24,
          }}>
            ❚❚
          </div>
        )}
        {paused && STORIES[idx]?.mediaType === "image" && (
          <div style={{
            pointerEvents:"none",
            position:"absolute", top:0,left:0,right:0,bottom:0,
            background:"rgba(0,0,0,0.3)", 
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"white", fontSize:24,
          }}>
            ❚❚
          </div>
        )}
      </div>
    </>
  );
}