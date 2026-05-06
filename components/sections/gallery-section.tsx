"use client";

import { CardsParallax, type iCardItem } from "@/components/ui/scroll-cards";

const cardItems: iCardItem[] = [
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
  return (
    <section id="gallery" className="bg-black">
      <CardsParallax items={cardItems} />
    </section>
  );
}
