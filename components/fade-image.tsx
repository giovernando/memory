"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

interface FadeImageProps extends Omit<ImageProps, "onLoad"> {
  fadeDelay?: number;
}

export function FadeImage({ className, fadeDelay = 0, ...props }: FadeImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, fadeDelay);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [fadeDelay]);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden bg-stone-950/20">
      {/* Skeleton Shimmer Loader */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 z-10 flex items-center justify-center bg-stone-900/60 animate-pulse"
          style={{ transition: "opacity 0.5s ease-out" }}
        >
          {/* Shimmer overlay gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-800/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          
          {/* Subtle cup loader icon */}
          <div className="text-stone-600 animate-bounce">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-7 h-7 opacity-30"
            >
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" x2="6" y1="2" y2="4" />
              <line x1="10" x2="10" y1="2" y2="4" />
              <line x1="14" x2="14" y1="2" y2="4" />
            </svg>
          </div>
        </div>
      )}
      {isVisible && (
        <Image
          {...props}
          className={`${className || ""} transition-all duration-700 ease-out ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}

