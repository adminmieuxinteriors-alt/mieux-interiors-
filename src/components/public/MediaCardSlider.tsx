"use client";

import { useState, useEffect } from "react";
import { optimizeMediaUrl } from "@/lib/cloudinary-optimize";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface MediaCardSliderProps {
  media?: MediaItem[];
  coverImage?: string;
  height?: string;
  width?: number;
}

export default function MediaCardSlider({ media, coverImage, height = "240px", width = 600 }: MediaCardSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = media && media.length > 0
    ? media
    : coverImage
      ? [{ url: coverImage, type: "image" as const }]
      : [];

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(index);
  };

  if (items.length === 0) {
    return (
      <div
        style={{
          height,
          backgroundColor: "#2b2621",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#eae4db",
          width: "100%",
        }}
      >
        No Image
      </div>
    );
  }

  return (
    <div 
      className="media-slider-container" 
      style={{ height, position: "relative", overflow: "hidden", width: "100%" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        style={{
          display: "flex",
          width: `${items.length * 100}%`,
          height: "100%",
          transform: `translateX(-${(activeIndex * 100) / items.length}%)`,
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {items.map((item, idx) => {
          const optimizedUrl = optimizeMediaUrl(item.url, { width, type: item.type });
          return (
            <div key={idx} style={{ width: `${100 / items.length}%`, height: "100%", position: "relative", backgroundColor: "#000" }}>
              {item.type === "video" ? (
                <video
                  src={optimizedUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url('${optimizedUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="slider-arrow arrow-left"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="slider-arrow arrow-right"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {items.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
            zIndex: 10,
          }}
        >
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => handleDotClick(e, idx)}
              style={{
                width: activeIndex === idx ? "16px" : "6px",
                height: "6px",
                borderRadius: "3px",
                backgroundColor: activeIndex === idx ? "var(--primary-color)" : "rgba(255,255,255,0.5)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .media-slider-container :global(.slider-arrow) {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(43, 38, 33, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          font-size: 20px;
          line-height: 28px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          pointer-events: none;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 3px;
        }
        .media-slider-container:hover :global(.slider-arrow) {
          opacity: 1;
          pointer-events: auto;
        }
        .media-slider-container :global(.slider-arrow):hover {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }
        .media-slider-container :global(.arrow-left) {
          left: 12px;
        }
        .media-slider-container :global(.arrow-right) {
          right: 12px;
        }
      `}</style>
    </div>
  );
}
