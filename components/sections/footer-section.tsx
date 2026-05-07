"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const footerLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#technology" },
  { label: "Menu", href: "#gallery" },
  { label: "Reservation", href: "#reserve" },
  { label: "Blog", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

export function FooterSection() {
  return (
    <footer className="relative w-full bg-[#0B0604] pt-12 md:pt-16 overflow-hidden">
      {/* Decorative top ambient radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-[#C29C6D]/5 to-transparent rounded-full blur-[100px] pointer-events-none select-none" />

      {/* Main Footer Card Container */}
      <div className="relative z-10 px-4 md:px-10 lg:px-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#120B06] border border-white/5 rounded-[32px] p-6 md:p-8 lg:p-10 flex flex-col gap-10 md:gap-12 lg:gap-14 shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle inside gradient overlay for glassmorphism gloss */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

          {/* Top Row: Links + Socials */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Links */}
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-4 md:gap-x-8">
              {footerLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-sm font-semibold text-[#F4F1EA]/90 hover:text-[#C29C6D] transition-colors duration-300 relative py-1 group/link"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C29C6D] group-hover/link:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <Link
                href="#"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#F4F1EA] transition-all duration-300 shadow-md hover:scale-110 active:scale-95"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </Link>

              {/* Facebook */}
              <Link
                href="#"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#F4F1EA] transition-all duration-300 shadow-md hover:scale-110 active:scale-95"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </Link>

              {/* Twitter / X */}
              <Link
                href="#"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#F4F1EA] transition-all duration-300 shadow-md hover:scale-110 active:scale-95"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Bottom Row: Copyright + Credits */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs md:text-sm text-[#A39E99] font-medium tracking-wide">
            <div>
              All rights reserved by{" "}
              <span className="text-[#F4F1EA] font-semibold hover:text-[#C29C6D] transition-colors duration-300 cursor-pointer">
                @Coffee
              </span>
            </div>
            <div>
              Designed by{" "}
              <span className="text-[#F4F1EA] font-semibold hover:text-[#C29C6D] transition-colors duration-300 cursor-pointer">
                <a
                  href="https://vrnan.vercel.app/"
                >
                  vrnan
                </a>{" "}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Large Brand Visual Section at the bottom */}
      <div className="relative w-full h-[150px] sm:h-[190px] md:h-[240px] lg:h-[280px] mt-10 md:mt-12 overflow-hidden">
        {/* Parallax Background Coffee Shop Image */}
        <div className="absolute inset-0 w-full h-full scale-105 select-none pointer-events-none">
          <Image
            src="/images/hero3.jpeg"
            alt="Cafenza Espresso Bar"
            fill
            className="object-cover opacity-65"
            sizes="100vw"
            loading="lazy"
          />
        </div>

        {/* Ambient Overlay Vignette & Gradients to blend smoothly */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0604] via-black/35 to-[#0B0604] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#0B0604_100%)] z-10" />

        {/* Gigantic centered lowercase brand text */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center z-20 select-none pointer-events-none overflow-hidden">
          <motion.h2
            initial={{ y: "40%", opacity: 0 }}
            whileInView={{ y: "5%", opacity: 0.95 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[17vw] font-bold leading-[0.7] tracking-tighter text-[#F4F1EA]/95 select-none font-sans lowercase text-center pb-1 md:pb-2"
          >
            Coffee
          </motion.h2>
        </div>
      </div>
    </footer>
  );
}
