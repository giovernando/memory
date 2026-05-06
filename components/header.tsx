"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Calendar } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Framer Motion Variants
  const hamburgerVariants: Variants = {
    closed: { rotate: 0 },
    opened: { rotate: 180 },
  };

  const line1Variants: Variants = {
    closed: { rotate: 0, y: 0 },
    opened: { rotate: 45, y: 5 },
  };

  const line2Variants: Variants = {
    closed: { opacity: 1, scale: 1 },
    opened: { opacity: 0, scale: 0 },
  };

  const line3Variants: Variants = {
    closed: { rotate: 0, y: 0 },
    opened: { rotate: -45, y: -5 },
  };

  const backdropVariants: Variants = {
    closed: { opacity: 0 },
    opened: { opacity: 1 },
  };

  const cardVariants: Variants = {
    closed: {
      opacity: 0,
      scale: 0.92,
      y: -20,
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.35,
        staggerChildren: 0.04,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
    opened: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.12,
        duration: 0.5,
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants: Variants = {
    closed: {
      opacity: 0,
      y: 12,
      transition: { duration: 0.15, ease: "easeIn" },
    },
    opened: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 130, damping: 15 },
    },
  };

  return (
    <>
      <header className="fixed top-4 inset-x-0 mx-auto z-50 w-[90%] max-w-5xl bg-transparent border-none pointer-events-none">
        {/* Mobile Header (shown on mobile, hidden on desktop) */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Left Floating Pill (Logo) */}
          <Link
            href="/#hero"
            className="pointer-events-auto px-6 py-2.5 rounded-full bg-[#F4F1EA] text-[#2F3E30] font-sans font-semibold text-lg border border-[#2F3E30]/10 shadow-md transition-all duration-300 hover:scale-105 active:scale-95 block"
          >
            Coffee.
          </Link>

          {/* Right Floating Circle (Hamburger Menu Button) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="pointer-events-auto relative z-50 h-12 w-12 rounded-full bg-[#F4F1EA] text-[#2F3E30] border border-[#2F3E30]/10 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Toggle menu"
          >
            <motion.div
              className="flex flex-col items-center justify-center gap-1.2 w-5 h-5"
              animate={isMenuOpen ? "opened" : "closed"}
              variants={hamburgerVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.span
                variants={line1Variants}
                className="h-[2px] w-5 rounded-full bg-[#2F3E30] block origin-center"
                transition={{ duration: 0.3 }}
              />
              <motion.span
                variants={line2Variants}
                className="h-[2px] w-5 rounded-full bg-[#2F3E30] block origin-center"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                variants={line3Variants}
                className="h-[2px] w-5 rounded-full bg-[#2F3E30] block origin-center"
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </button>
        </div>

        {/* Desktop Header (hidden on mobile, shown on desktop) */}
        <div className="hidden md:flex pointer-events-auto items-center justify-between w-full rounded-full bg-[#E4E1DA]/85 backdrop-blur-md border border-[#2F3E30]/10 shadow-lg shadow-[#2F3E30]/5 px-10 py-3.5 transition-all duration-300">
          {/* Logo */}
          <Link
            href="/#hero"
            className="text-[#2F3E30] font-sans font-bold text-xl lg:text-2xl tracking-tight hover:scale-105 active:scale-95 transition-all duration-300 block"
          >
            Coffee.
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8 lg:gap-12">
            <Link
              href="/#gallery"
              className="text-[#2F3E30] font-sans font-semibold text-sm lg:text-base transition-all duration-300 hover:opacity-80 relative group py-1"
            >
              Menu
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#2F3E30] group-hover:w-1/2 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/#technology"
              className="text-[#2F3E30] font-sans font-semibold text-sm lg:text-base transition-all duration-300 hover:opacity-80 relative group py-1"
            >
              About
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#2F3E30] group-hover:w-1/2 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/gallery"
              className="text-[#2F3E30] font-sans font-semibold text-sm lg:text-base transition-all duration-300 hover:opacity-80 relative group py-1"
            >
              Gallery
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#2F3E30] group-hover:w-1/2 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/#about"
              className="text-[#2F3E30] font-sans font-semibold text-sm lg:text-base transition-all duration-300 hover:opacity-80 relative group py-1"
            >
              Contact
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#2F3E30] group-hover:w-1/2 transition-all duration-300 rounded-full" />
            </Link>
          </nav>

          {/* Reservasi Button */}
          <Link
            href="/#reserve"
            className="px-8 py-3 rounded-full bg-[#738A75] hover:bg-[#5E7560] text-white font-sans font-semibold text-sm lg:text-base shadow-md shadow-[#738A75]/10 hover:scale-105 active:scale-95 transition-all duration-300 block"
          >
            Reservasi
          </Link>
        </div>
      </header>

      {/* Floating Fullscreen Blur Overlay and Menu Card */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial="closed"
              animate="opened"
              exit="closed"
              variants={backdropVariants}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/15 backdrop-blur-md z-40 cursor-pointer pointer-events-auto"
              transition={{ duration: 0.4 }}
            />

            {/* Menu Card */}
            <div className="fixed inset-x-0 top-20 mx-auto z-45 w-[90%] max-w-[360px] pointer-events-none">
              <motion.div
                initial="closed"
                animate="opened"
                exit="closed"
                variants={cardVariants}
                className="pointer-events-auto w-full rounded-[36px] border border-[#2F3E30]/5 bg-[#F4F1EA] px-8 py-10 shadow-2xl shadow-[#2F3E30]/15 flex flex-col items-center justify-center"
              >
                <nav className="flex flex-col items-center gap-7 w-full">
                  <motion.div variants={menuItemVariants} className="text-center">
                    <Link
                      href="/#gallery"
                      className="text-xl font-bold text-[#2F3E30] transition-colors hover:opacity-60 block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Menu
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants} className="text-center">
                    <Link
                      href="/#technology"
                      className="text-xl font-bold text-[#2F3E30] transition-colors hover:opacity-60 block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants} className="text-center">
                    <Link
                      href="/gallery"
                      className="text-xl font-bold text-[#2F3E30] transition-colors hover:opacity-60 block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Gallery
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants} className="text-center">
                    <Link
                      href="/#about"
                      className="text-xl font-bold text-[#2F3E30] transition-colors hover:opacity-60 block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants} className="w-full mt-2">
                    <Link
                      href="/#reserve"
                      className="w-full py-4 rounded-full bg-[#738A75] text-[#F4F1EA] flex items-center justify-center gap-2 font-bold text-base shadow-md shadow-[#738A75]/15 hover:bg-[#617763] transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Calendar className="h-4 w-4" />
                      Reserve Now
                    </Link>
                  </motion.div>
                </nav>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
