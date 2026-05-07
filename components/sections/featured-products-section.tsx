"use client";

import { useState, useEffect } from "react";
import ImmersiveScrollGallery from "@/components/ui/immersive-scroll-gallery";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const DEFAULT_GALLERY_IMAGES = [
  { src: "/images/foto8.webp" },
  { src: "/images/foto2.webp" },
  { src: "/images/foto3.webp" },
  { src: "/images/foto4.webp" },
  { src: "/images/foto5.webp" },
  { src: "/images/foto6.webp" },
  { src: "/images/foto7.webp" },
];

export function FeaturedProductsSection() {
  const [images, setImages] = useState(DEFAULT_GALLERY_IMAGES);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    async function loadFeaturedImages() {
      try {
        const { data, error } = await supabase!
          .from("section_images")
          .select("image_url")
          .eq("section", "featured_products")
          .order("sort_order", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((item) => ({ src: item.image_url }));
          setImages(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch featured product images, using defaults:", err);
      }
    }

    loadFeaturedImages();
  }, []);

  return (
    <section id="products-gallery" className="relative bg-background">
      <ImmersiveScrollGallery images={images}>
        <h2
          className="text-[#4b3f33] text-2xl md:text-4xl lg:text-5xl font-thin py-4 font-tiemposHeadline lowercase text-center max-w-4xl"
          style={{ lineHeight: 1.6 }}
        >
          redefining the architectural canvas with organic simplicity. our featured
          spaces blend tactile raw materials with light-filled volumes, creating a sensory
          dialogue between interior comfort and the natural world. each structure is a
          bespoke sanctuary, meticulously detailed to elevate daily living into an art form.
        </h2>
      </ImmersiveScrollGallery>
    </section>
  );
}

