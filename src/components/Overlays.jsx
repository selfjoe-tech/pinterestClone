"use client";
import { useEffect, useRef } from "react";

export default function Overlay({ children, onClose }) {
  const backdropRef = useRef(null);

  // Close when clicking outside the content box
  useEffect(() => {
    function handleClick(e) {
      if (backdropRef.current && e.target === backdropRef.current) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className="overlay-backdrop"
    >
      <div className="overlay-content">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
      <style jsx>{`
        .overlay-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .overlay-content {
          position: relative;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 90%;
          max-height: 90%;
          overflow: auto;
        }
        .close-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: transparent;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}