"use client";

import { useState, useEffect } from "react";
import { CardsParallax, type iCardItem } from "@/components/ui/scroll-cards";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const DEFAULT_CARD_ITEMS: iCardItem[] = [
  {
    title: "Sunrise Vista",
    description: "Modern architecture glowing under the warm morning sun",
    tag: "architecture",
    src: "/images/foto21.jpeg",
    link: "#",
    color: "#0a0a0a",
    textColor: "white",
  },
  {
    title: "Daylight Clarity",
    description: "Crisp lines and sustainable design captured in bright daylight",
    tag: "architecture",
    src: "/images/foto22.jpeg",
    link: "#",
    color: "#0a0a0a",
    textColor: "white",
  },
  {
    title: "Dusk Harmony",
    description: "A perfect blend of evening hues and premium modern spaces",
    tag: "architecture",
    src: "/images/foto23.webp",
    link: "#",
    color: "#0a0a0a",
    textColor: "white",
  },
  {
    title: "Night Radiance",
    description: "Illuminating the dark with warm energy-efficient lighting",
    tag: "architecture",
    src: "/images/foto24.webp",
    link: "#",
    color: "#0a0a0a",
    textColor: "white",
  },
];

export function GallerySection() {
  const [items, setItems] = useState<iCardItem[]>(DEFAULT_CARD_ITEMS);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    async function loadCards() {
      try {
        const { data, error } = await supabase
          .from("section_images")
          .select("*")
          .eq("section", "homepage_gallery")
          .order("sort_order", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((item) => ({
            title: item.title || "",
            description: item.description || "",
            tag: item.tag || "",
            src: item.image_url,
            link: item.link || "#",
            color: item.color || "#0a0a0a",
            textColor: item.text_color || "white",
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.warn("Failed to load homepage gallery cards from Supabase, using defaults:", err);
      }
    }

    loadCards();
  }, []);

  return (
    <section id="gallery" className="bg-black">
      <CardsParallax items={items} />
    </section>
  );
}

