"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Carousel, ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { urlFor } from "../sanity/client";

export function Stories({ story }) {
  // Build an array of { id, mediaType, src } for every item,
  // preferring item.src (for local blob) if present.
  const STORIES = story.map((item, index) => {
    if (item.src) {
      // This is a local‐preview case: item = { mediaType, src }
      return { id: index, mediaType: item.mediaType, src: item.src };
    } else if (item.mediaType === "video") {
      // This is a “real” Sanity reference: story items from database
      return {
        id: index,
        mediaType: "video",
        src: item.video?.asset?.url,
      };
    } else {
      // Real Sanity image reference
      return {
        id: index,
        mediaType: "image",
        src: urlFor(item.image).url(),
      };
    }
  });

  const DEFAULT_MS = 5000;
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const timerRef = useRef(null);
  const startRef = useRef(0);
  const elapsedRef = useRef(0);
  const durations = useRef(STORIES.map(() => DEFAULT_MS));
  const videoEls = useRef([]);

  // Next / Prev functions
  const next = useCallback(() => {
    setPaused(false);
    setIdx((i) => (i + 1) % STORIES.length);
  }, [STORIES.length]);

  const prev = useCallback(() => {
    setPaused(false);
    setIdx((i) => (i - 1 + STORIES.length) % STORIES.length);
  }, [STORIES.length]);

  // Slide‐change effect (starts timers, plays videos, etc.)
  useEffect(() => {
    clearInterval(timerRef.current);
    setProgress(0);
    elapsedRef.current = 0;

    const cur = STORIES[idx];
    if (!cur) return;

    if (cur.mediaType === "video") {
      const v = videoEls.current[idx];
      if (v) {
        v.currentTime = 0;
        v.muted = true;
        v.play().catch(() => {});
      }
    }

    // Only start a timer if it’s an image, or we're not paused
    if (cur.mediaType === "image" || !paused) {
      startRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const dur = durations.current[idx];
        const t = Date.now() - startRef.current;
        const pct = Math.min(100, (t / dur) * 100);
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(timerRef.current);
          next();
        }
      }, 100);
    }

    return () => clearInterval(timerRef.current);
  }, [idx, next, paused, STORIES]);

  // Pause / Resume for video
  const togglePause = useCallback(() => {
    const cur = STORIES[idx];
    if (cur.mediaType !== "video") return;

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
        const t = Date.now() - startRef.current;
        const pct = Math.min(100, (t / dur) * 100);
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(timerRef.current);
          next();
        }
      }, 100);
      if (v) v.play().catch(() => {});
    }

    setPaused((p) => !p);
  }, [idx, paused, next, STORIES]);

  // When a video’s metadata loads, capture its true duration
  const onLoadedMeta = (i) => (e) => {
    durations.current[i] = e.target.duration * 1000;
  };

  // Key + Click/ Tap controls
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === " ") togglePause();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, togglePause]);

  const onClick = (e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width / 3) prev();
    else if (x > (2 * width) / 3) next();
    else togglePause();
  };

  return (
    <>
      <style jsx global>{`
        .story-progress .progress {
          background-color: #666 !important;
        }
        .story-progress .progress-bar {
          background-color: #fff !important;
        }
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
        <div
          className="story-progress"
          style={{ display: "flex", gap: 4, padding: "8px 0" }}
        >
          {STORIES.map((_, i) => (
            <ProgressBar
              key={i}
              now={i < idx ? 100 : i === idx ? progress : 0}
              style={{ flex: 1, height: 4 }}
            />
          ))}
        </div>

        {/* carousel slides */}
        <Carousel
          slide={false}
          activeIndex={idx}
          onSelect={(i) => {
            setPaused(false);
            setIdx(i);
          }}
          controls={false}
          indicators={false}
          interval={null}
        >
          {STORIES.map((s, i) => (
            <Carousel.Item key={s.id}>
              {s.mediaType === "image" ? (
                <div className="carousel-image-container">
                  <img src={s.src} style={{ width: "100%", height: "auto" }} />
                </div>
              ) : (
                <video
                  ref={(el) => (videoEls.current[i] = el)}
                  src={s.src}
                  muted
                  playsInline
                  onLoadedMetadata={onLoadedMeta(i)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </Carousel.Item>
          ))}
        </Carousel>

        {/* video pause overlay */}
        {paused && STORIES[idx]?.mediaType === "video" && (
          <div
            style={{
              pointerEvents: "none",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 24,
            }}
          >
            ❚❚
          </div>
        )}
      </div>
    </>
  );
}