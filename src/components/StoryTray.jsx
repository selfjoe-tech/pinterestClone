import React, { useState } from "react";

export default function StoryTray({ stories }) {
  // show 4 at a time
  const VISIBLE_COUNT = 4;
  const [startIndex, setStartIndex] = useState(0);

  // Determine if left/right buttons should be enabled
  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE_COUNT < stories.length;

  const handlePrev = () => {
    if (!canPrev) return;
    setStartIndex((i) => i - 1);
  };
  const handleNext = () => {
    if (!canNext) return;
    setStartIndex((i) => i + 1);
  };

  // Slice out exactly 4 (or fewer, if at the end)
  const visibleStories = stories.slice(
    startIndex,
    startIndex + VISIBLE_COUNT
  );

  return (
    <div className="story-tray-container">
      {/* ← Left arrow */}
      <button
        onClick={handlePrev}
        disabled={!canPrev}
        className="arrow-button left"
      >
        ◀
      </button>

      {/* The “window” that shows four story items */}
      {visibleStories.map((item, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  {item.mediaType === "image" ? (
                    <img
                      src={item.previewUrl}
                      alt={`preview-${idx}`}
                      style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4 }}
                    />
                  ) : (
                    <video
                      src={item.previewUrl}
                      style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4 }}
                      muted
                    />
                  )}


                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="profileButton remove-media"
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "rgba(0,0,0,0.5)",
                      border: "none",
                      borderRadius: "50%",
                      padding: 2,
                    }}
                    title="Remove"
                  >
                    <Image src="/images/bs-trash3.png" height={16} width={16} alt="Remove" />
                  </button>
                </div>
              ))}

      {/* → Right arrow */}
      <button
        onClick={handleNext}
        disabled={!canNext}
        className="arrow-button right"
      >
        ▶
      </button>

      {/* Scoped CSS so you don’t have to touch global styles */}
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
          /* Total width = four items (80px each) + three gaps (16px each) */
          width: calc(4 * 80px + 3 * 16px);
        }

        .story-item {
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
          border-radius: 50%;
          object-fit: cover;
          display: block;
          margin: 0 auto;
        }

        .story-username {
          display: block;
          font-size: 12px;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}