"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Fungsi helper untuk generate 1x1 pixel base64 GIF dengan warna kustom (RGB)
// Sangat berguna untuk blurDataURL dinamis tanpa perlu asset eksternal
export const rgbToDataUrl = (r: number, g: number, b: number) => {
  const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  
  const triplet = (e1: number, e2: number, e3: number) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63);

  return `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
};

// Warna Cokelat Kopi hangat default (#2C1810)
const DEFAULT_COFFEE_RGB = { r: 44, g: 24, b: 16 };

interface CoffeeImageProps extends Omit<ImageProps, "onLoad"> {
  /**
   * Mode penampung sementara (placeholder)
   * - 'shimmer': Menampilkan skeleton screen dengan animasi pulsa / kilau premium
   * - 'blur': Menampilkan transisi blur-up bawaan Next.js (menggunakan blurDataURL kopi otomatis)
   * - 'both': Menggabungkan skeleton shimmer dan blur-up untuk UX terbaik
   */
  placeholderType?: "shimmer" | "blur" | "both";
  
  /** Warna RGB kustom untuk blur placeholder (opsional) */
  blurRGB?: { r: number; g: number; b: number };

  /** Class name tambahan untuk container pembungkus */
  containerClassName?: string;
}

export function CoffeeImage({
  src,
  alt,
  className,
  placeholderType = "both",
  blurRGB = DEFAULT_COFFEE_RGB,
  containerClassName,
  priority = false,
  ...props
}: CoffeeImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const useShimmer = placeholderType === "shimmer" || placeholderType === "both";
  const useBlur = placeholderType === "blur" || placeholderType === "both";

  // Generate blurDataURL jika src berupa string (URL dinamis)
  const isStaticImport = typeof src !== "string";
  const finalBlurDataURL = !isStaticImport && useBlur 
    ? rgbToDataUrl(blurRGB.r, blurRGB.g, blurRGB.b) 
    : undefined;

  return (
    <div 
      className={cn(
        "relative w-full h-full overflow-hidden bg-stone-950/20", 
        containerClassName
      )}
    >
      {/* 1. SKELETON SHIMMER (Penampung Sementara) */}
      {useShimmer && !isLoaded && (
        <div 
          className="absolute inset-0 z-10 flex items-center justify-center bg-stone-900/60 animate-pulse"
          style={{ transition: "opacity 0.5s ease-out" }}
        >
          {/* Shimmer overlay gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-800/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          
          {/* Coffee-themed loading icon or subtle brand indicator */}
          <div className="text-stone-600 animate-bounce">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-8 h-8 opacity-40"
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

      {/* 2. ULTIMATE NEXT.JS IMAGE WITH LAZY LOADING */}
      <Image
        src={src}
        alt={alt}
        priority={priority}
        // Lazy loading otomatis aktif secara default di Next.js
        loading={priority ? undefined : "lazy"}
        
        // Konfigurasi Blur Placeholder
        placeholder={useBlur ? "blur" : undefined}
        blurDataURL={finalBlurDataURL}
        
        onLoad={() => setIsLoaded(true)}
        
        className={cn(
          "transition-all duration-700 ease-out",
          // Efek visual ketika gambar sedang loading vs selesai loading
          isLoaded 
            ? "opacity-100 scale-100 blur-0" 
            : cn(
                "opacity-0 scale-[1.03]",
                useBlur ? "blur-md" : ""
              ),
          className
        )}
        {...props}
      />
    </div>
  );
}
