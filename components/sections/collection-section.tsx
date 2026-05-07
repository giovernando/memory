"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeImage } from "@/components/fade-image";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const DEFAULT_MENU_ITEMS = [
  {
    id: "static_1",
    name: "Signature Espresso",
    description: "Rich and robust double-shot espresso brewed from our premium house blend.",
    price: "$6.50",
    image: "/images/foto10.webp",
  },
  {
    id: "static_2",
    name: "Vanilla Cloud Latte",
    description: "Smooth espresso blended with creamy milk and cold-pressed vanilla bean syrup.",
    price: "$8.40",
    image: "/images/foto11.webp",
  },
  {
    id: "static_3",
    name: "Matcha Harmony",
    description: "Japanese matcha whisked with silky steamed milk.",
    price: "$9.80",
    image: "/images/foto12.webp",
  },
  {
    id: "static_4",
    name: "Blueberry Muffin",
    description: "Freshly baked muffin bursting with plump blueberries and a crumble top.",
    price: "$6.20",
    image: "/images/foto13.webp",
  },
];

export function CollectionSection() {
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    async function loadMenu() {
      try {
        const { data, error } = await supabase!
          .from("menu_items")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image_url,
          }));
          setMenuItems(mapped);
        }
      } catch (err) {
        console.warn("Failed to load menu items from Supabase, using default local assets:", err);
      }
    }

    loadMenu();
  }, []);

  // Framer Motion Animation Variants
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  return (
    <section id="signature-menu" className="bg-background py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="text-center mb-16 space-y-3"
        >
          {/* Accent Line Header */}
          <div className="flex items-center justify-center gap-4 text-xs md:text-sm font-semibold tracking-widest text-stone-500 uppercase">
            <div className="h-[1px] w-8 md:w-12 bg-stone-300 dark:bg-stone-700" />
            <span className="font-sans">Signature Menu</span>
            <div className="h-[1px] w-8 md:w-12 bg-stone-300 dark:bg-stone-700" />
          </div>

          {/* Main Title */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0f5233] dark:text-emerald-500 font-sans leading-tight">
            Handpicked Selections <br />
            <span className="font-medium text-[#0a3d24] dark:text-emerald-400 block mt-1">Loved By Our Guests</span>
          </h2>
        </motion.div>

        {/* Menu Grid (2 columns on mobile, 4 columns on desktop) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-2 md:px-4"
        >
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative p-3 border border-[#8c7a6b]/20 dark:border-stone-800 rounded-[28px] bg-white dark:bg-stone-900/50 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              {/* Inner container to hold image and content with double-border effect */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-stone-50 dark:bg-stone-800/50 border border-[#8c7a6b]/10 dark:border-stone-800">
                
                {/* Fade Image with premium cup loading state */}
                <FadeImage
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Bottom Shadow Gradient for Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 transition-opacity duration-300" />

                {/* Overlaid Card Content */}
                <div className="absolute inset-0 p-4 md:p-6 z-20 flex flex-col items-center justify-end text-center">
                  
                  {/* Item Name */}
                  <h3 className="text-sm md:text-lg font-bold text-white tracking-tight drop-shadow-sm font-sans">
                    {item.name}
                  </h3>

                  {/* Item Description - Expands and fades in on hover */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out w-full overflow-hidden">
                    <p className="min-h-0 pt-1.5 text-[10px] md:text-xs text-stone-200/90 leading-relaxed font-sans max-w-[95%] mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 md:line-clamp-none">
                      {item.description}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <span className="mt-3.5 text-xs md:text-sm font-medium text-stone-300 tracking-wider">
                    {item.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Explore Our Menu Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <Link
            href="#gallery"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0f5233] hover:bg-[#0a3d24] text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 font-sans font-semibold text-sm md:text-base shadow-lg shadow-[#0f5233]/10 hover:shadow-xl hover:shadow-[#0f5233]/20 hover:scale-105 active:scale-95 transition-all duration-300 group/btn"
          >
            Explore Our Menu
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
