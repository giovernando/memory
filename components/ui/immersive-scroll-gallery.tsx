"use client";

import { useRef } from "react";
import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// Types
export interface iIPicture {
  src: string;
  scale?: MotionValue<number> | null;
}

export interface iImmersiveScrollGalleryProps {
  images?: iIPicture[]; // Optional custom images array
  className?: string; // Optional className for container customization
  children?: React.ReactNode; // Custom text or heading override for the end section
}

// Constants
const DEFAULT_IMAGES: iIPicture[] = [
  {
    src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    scale: null,
  },
  {
    src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    scale: null,
  },
  {
    src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    scale: null,
  },
  {
    src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    scale: null,
  },
  {
    src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    scale: null,
  },
  {
    src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    scale: null,
  },
  {
    src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    scale: null,
  },
];

const IMAGE_STYLES = [
  "w-[25vw] h-[25vh]",
  "w-[35vw] h-[30vh] -top-[30vh] left-[5vw]",
  "w-[20vw] h-[55vh] -top-[15vh] -left-[25vw]",
  "w-[25vw] h-[25vh] left-[27.5vw]",
  "w-[20vw] h-[30vh] top-[30vh] left-[5vw]",
  "w-[30vw] h-[25vh] top-[27.5vh] -left-[22.5vw]",
  "w-[15vw] h-[15vh] top-[22.5vh] left-[25vw]",
];

/**
 * ImmersiveScrollGallery Component
 *
 * A scroll-based image zoom effect component that creates a parallax-like experience.
 * Images scale up as the user scrolls, creating an immersive visual effect.
 *
 * @param {iImmersiveScrollGalleryProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const ImmersiveScrollGallery: React.FC<iImmersiveScrollGalleryProps> = ({
  images = DEFAULT_IMAGES,
  className = "",
  children,
}) => {
  // Refs
  const container = useRef<HTMLDivElement | null>(null);

  // Scroll and transform hooks
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Transform values
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const opacityImage = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const opacitySection2 = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  // Assign scales to images
  const pictures = images.map((img, index) => {
    const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];
    return {
      ...img,
      scale: scales[index % scales.length],
    };
  });

  return (
    <div ref={container} className={`relative h-[200vh] ${className}`}>
      <div className="sticky top-0 h-[100vh] overflow-hidden">
        {/* Zooming Images */}
        {pictures.map(({ src, scale }, index) => {
          const styleIndex = index % IMAGE_STYLES.length;
          return (
            <motion.div
              key={index}
              style={{ scale, opacity: opacityImage }}
              className="absolute flex items-center justify-center w-full h-full top-0"
            >
              <div className={`relative ${IMAGE_STYLES[styleIndex]}`}>
                <Image
                  src={src}
                  alt={`Zoom image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 35vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          );
        })}

        {/* Content Section */}
        <motion.div
          style={{
            opacity: opacitySection2,
            scale: useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1]),
          }}
          className="w-full h-full flex items-center justify-center max-w-4xl mx-auto p-8 relative z-10"
        >
          {children || (
            <h1
              className="text-[#4b3f33] text-2xl md:text-4xl font-thin py-4 font-tiemposHeadline lowercase text-center"
              style={{ lineHeight: 1.5 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </h1>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveScrollGallery;
