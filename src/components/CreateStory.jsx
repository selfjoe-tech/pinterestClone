"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "react-bootstrap";
import Image from "next/image";
import useAuthStore from "../app/utilitis/apis/useAuthStore";
import { apiFetch } from "../app/utilitis/apis/fetchWrapper";
import { StoriesCarousel } from "./PostCollage";

export default function CreateStory() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const currentUser = useAuthStore.getState().user;

  // Each item: { file, previewUrl, mediaType }
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wrongType, setWrongType] = useState(false);
  const fileInputRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      mediaItems.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  // When “Add Media” is clicked, open the hidden <input>
  function addTag(e) {
    e.preventDefault();
    const v = tagInput.trim();
    if (v && !tags.includes(v)) setTags((t) => [...t, v]);
    setTagInput("");
  }
  function removeTag(i) {
    setTags((t) => t.filter((_, idx) => idx !== i));
  }

  // When user picks files, build preview URLs & determine mediaType
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newItems = [];

    files.forEach((file) => {
      const ok =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      if (!ok) {
        setWrongType(true);
        return;
      }
      setWrongType(false);
      const previewUrl = URL.createObjectURL(file);
      const mediaType = file.type.startsWith("image/") ? "image" : "video";
      newItems.push({ file, previewUrl, mediaType });
    });

    setMediaItems((prev) => [...prev, ...newItems]);
    e.target.value = null; // reset so same file can be re‐selected if needed
  };

  // Remove a specific media item (cleanup its object URL)
  // 4) Remove a specific media item (cleanup its object URL)
  const handleRemoveItem = (idx) => {
    setMediaItems((prev) => {
      const itemToRemove = prev[idx];
      if (itemToRemove.previewUrl) {
        // Revoke only the URL for the removed item
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      // Return array without that item
      return prev.filter((_, i) => i !== idx);
    });

    setStartIndex((old) => {
      const newLen = mediaItems.length - 1;
      if (old > newLen - VISIBLE_COUNT) {
        return Math.max(0, newLen - VISIBLE_COUNT + 1);
      }
      return old;
    });
  };


  // On “Publish Story”: upload each asset, build `media` array, then create a story doc
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!mediaItems.length) return;
    setLoading(true);

    const fd = new FormData();
    fd.append("userId", currentUser._id);
    mediaItems.forEach((item) => {
      fd.append("mediaFiles[]", item.file);
      fd.append("mediaTypes[]", item.mediaType);
    });
    tags.forEach((tg) => fd.append("tags[]", tg));
    fd.append("title", title.trim());
    if (link.trim()) fd.append("link", link.trim());

    const res = isLoggedIn
      ? await apiFetch("/api/createStory", { method: "POST", body: fd })
      : await fetch("/api/createStory", { method: "POST", body: fd });

    if (res.ok) {
      router.push("/");
    } else {
      console.error("Story creation failed", await res.text());
      setLoading(false);
    }
  };

  const VISIBLE_COUNT = 4;
  const [startIndex, setStartIndex] = useState(0);

  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE_COUNT < mediaItems.length;

  const handlePrev = () => {
    if (!canPrev) return;
    setStartIndex((i) => i - 1);
  };
  const handleNext = () => {
    if (!canNext) return;
    setStartIndex((i) => i + 1);
  };

  // This slice is the four‐item “window”
  const visibleStories = mediaItems.slice(
    startIndex,
    startIndex + VISIBLE_COUNT
  );

  return (
    <div className="createPage">
      <div className="createTop">
        <h1>Create Story</h1>
        <Button variant="danger" onClick={handlePublish} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Publish Story"}
        </Button> 
      </div>
      <div className="createBottom always-column">
        {wrongType && (
          <div className="uploadInfo text-danger">
            Wrong file type (only images/videos allowed)
          </div>
        )}

        {/* “Add Media” sbutton always visible */}
       

        {/* Preview inserted media as a story carousel */}



        {mediaItems.length > 0 && (
        <div
          className="story-preview-container"
          style={{ marginBottom: "16px" }}
        >
        {/* 1) Top: full‐width carousel preview */}
          <StoriesCarousel
          story={mediaItems.map((item) => ({
            mediaType: item.mediaType,
            image:
              item.mediaType === "image"
                ? { asset: { url: item.previewUrl } }
                : undefined,
            video:
              item.mediaType === "video"
                ? { asset: { url: item.previewUrl } }
                : undefined,
          }))}
        />
        
        

    {/* 2) Below: four‐item tray with arrows */}
    <div className="story-tray-container" style={{ marginTop: "12px" }}>
      {/* ← Left arrow */}
      <button
        onClick={handlePrev}
        disabled={!canPrev}
        className="arrow-button left"
      >
        ◀
      </button>

      {/* The “window” that shows exactly four items */}
      <div className="story-tray-view">
        {visibleStories.map((item, idx) => {
          // Compute the actual index in mediaItems
          const globalIdx = startIndex + idx;
          return (
            <div key={globalIdx} className="story-item">
              {item.mediaType === "image" ? (
                <img
                  src={item.previewUrl}
                  alt={`preview-${globalIdx}`}
                  className="story-thumb"
                />
              ) : (
                <video
                  src={item.previewUrl}
                  className="story-thumb"
                  muted
                />
              )}

              {/* Remove button positioned over each thumbnail */}
              <button
                onClick={() => handleRemoveItem(globalIdx)}
                className="profileButton remove-media"
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  padding: 2,
                  width: 40,
                  height: 40,
                  borderRadius: "50%"
                }}
                title="Remove"
              >
                <Image
                  src="/images/bs-trash3.png"
                  height={16}
                  width={16}
                  alt="Remove"
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* → Right arrow */}
      <button
        onClick={handleNext}
        disabled={!canNext}
        className="arrow-button right"
      >
        ▶
      </button>
    </div>

    {/* Scoped CSS for the tray */}
    <style jsx>{`
      .story-tray-container {
        display: flex;
        align-items: center;
      }

      .arrow-button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 0 8px;
      }

      .arrow-button:disabled {
        opacity: 0.3;
        cursor: default;
      }

      .story-tray-view {
        display: flex;
        overflow: hidden;
        /* Four items of 80px + 3 gaps of 16px = width */
        width: calc(4 * 80px + 3 * 16px);
      }

      .story-item {
        position: relative;
        flex: 0 0 auto;
        width: 80px;
        margin-right: 16px;
        text-align: center;
      }

      .story-item:last-child {
        margin-right: 0;
      }

      .story-thumb {
        width: 80px;
        height: 80px;
        border-radius: 30%;
        object-fit: cover;
        display: block;
        margin: 0 auto;
      }
    `}</style>
  </div>
)}

<div className="add-story-button">
                <div className="uploadtitle">
                    <img src="/images/ri-arrow-up-line.png" alt="" height={50} width={50} />
                    
                </div>
                
                <label className="upload-label">
                <p>Click to upload an image or video</p>
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFilesChange}
                    className="upload-image-input"
                />
                </label>
        </div>
        <form onSubmit={handlePublish}>
                <div className="createForm">
        
                {wrongType && (
                  <div className="uploadInfo text-danger">
                    Wrong file type for {mediaType}
                  </div>
                )}
        
        
                {/* 2) title & link */}
                <div className="createFormItem">
                  <label>Title</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="createFormItem">
                  <label>Link (optional)</label>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
        
                {/* 3) tags */}
                <div className="createFormItem">
                  <label htmlFor="tags">Tagged topics</label>
                  <div className="input-tag-container">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Type a tag and click '+'"
                    />
                    <Button onClick={addTag} 
                        className="remove-button"
                        title="Add Tag"
                    >
                        <span className="add-tag-sign">+</span>
                    </Button>
                  </div>
                  <div className="tag-container">
                    {tags.map((t, i) => (
                      <span key={i} className="tag-item">
                        {t}
                        <button 
                            onClick={() => removeTag(i)}
                            className="remove-button"
                        >
                            ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                </div>
              </form>
        {/* <form onSubmit={handlePublish} className="editForm">
          <div className="createFormContainer story-form-container">
            <div className="createFormItem story-form-container">
              <label htmlFor="caption">Caption</label>
              <textarea
                id="caption"
                rows={3}
                placeholder="Story caption (optional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
        </form> */}

        
         
      </div>
    </div>
  );
}
