"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Coffee, Leaf, Award, Heart, ShieldCheck, Sparkles,
  ArrowRight, Landmark, Trees, Compass, Calendar, HelpCircle
} from "lucide-react";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { CoffeeImage } from "@/components/coffee-image";

// Framer motion animation configs
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18,
      delay: custom * 0.1,
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

export default function AboutPage() {
  const [activeTimeline, setActiveTimeline] = useState<number>(2); // Default to 2026

  const timelineEvents = [
    {
      year: 2021,
      title: "The Seed is Sown",
      subtitle: "Awal Mula Harapan",
      description: "Fow Coffee bermula dari sebuah gerobak kayu kecil beroda di sudut kota. Dengan mimpi menyajikan kopi dengan cita rasa murni sekaligus meminimalkan jejak karbon, kami memulai kerja sama langsung dengan keluarga petani kopi kecil di Jawa Barat untuk memastikan pasokan yang adil dan organik.",
      image: "/images/foto1.webp",
      accent: "Gerobak Kopi Berkelanjutan"
    },
    {
      year: 2023,
      title: "Bio-Constructed Roastery",
      subtitle: "Arsitektur Pasif & Penyangraian Mandiri",
      description: "Kami mendirikan kedai utama pertama kami dengan konsep bangunan energi pasif. Menggunakan kayu bersertifikasi lestari, isolasi serat rami (hemp wool), ventilasi alami, serta 100% daya panel surya. Kami juga mulai menyangrai biji kopi kami sendiri dalam batch kecil dengan presisi tinggi.",
      image: "/images/foto2.webp",
      accent: "100% Energi Terbarukan"
    },
    {
      year: 2026,
      title: "The Sensory Explorer Hub",
      subtitle: "Evolusi Ekstraksi & Ruang Komunitas",
      description: "Hari ini, Fow Coffee bertransformasi menjadi pusat kurasi kopi modern yang menyatukan sains penyeduhan, arsitektur hijau, dan kehangatan komunitas. Kami menghadirkan teknologi filter air reverse-osmosis kustom serta profil sangrai sensoris yang presisi untuk setiap cangkir kopi yang disajikan.",
      image: "/images/hero1.webp",
      accent: "Sains & Kelestarian"
    }
  ];

  const values = [
    {
      icon: Leaf,
      number: "01",
      title: "Ekologi Tanpa Batas",
      description: "Dari gelas kompos berbahan jagung hingga sirkularitas ampas kopi sebagai pupuk kebun lokal. Kami berupaya mencapai nihil sampah (zero-waste) di setiap lini pelayanan."
    },
    {
      icon: Coffee,
      number: "02",
      title: "Presisi Cita Rasa",
      description: "Setiap biji single origin dikurasi secara ilmiah oleh Q-Grader kami. Kami memetakan grafik suhu sangrai dan rasio ekstraksi untuk mengeluarkan rasa alami terbaik."
    },
    {
      icon: Heart,
      number: "03",
      title: "Keadilan di Hulu",
      description: "Kami memotong rantai tengkulak tradisional dengan bertransaksi langsung (direct trade) dengan petani mikro Indonesia, membayar hingga 50% di atas harga pasar adil."
    }
  ];

  const craftSteps = [
    {
      step: "01",
      title: "Kurasi Biji (Sourcing)",
      desc: "Menjelajahi dataran tinggi Nusantara untuk menemukan biji kopi organik mikro-lot yang ditanam di bawah naungan pohon rindang (shade-grown).",
      image: "/images/foto4.webp"
    },
    {
      step: "02",
      title: "Penyangraian (Roasting)",
      desc: "Setiap batch disangrai dengan udara panas presisi untuk memaksimalkan profil rasa khas (floral, citrus, chocolatey) tanpa merusak keaslian biji.",
      image: "/images/foto5.webp"
    },
    {
      step: "03",
      title: "Ekstraksi (Brewing)",
      desc: "Menggunakan air bermineral seimbang dan mesin espresso berteknologi profil tekanan dinamis untuk mendapatkan kejernihan rasa cangkir optimal.",
      image: "/images/foto6.webp"
    },
    {
      step: "04",
      title: "Penyajian (Serving)",
      desc: "Disajikan hangat dalam cangkir keramik buatan pengrajin lokal, mengantarkan cerita dari tanah petani langsung ke meja Anda.",
      image: "/images/foto7.webp"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2F3E30] font-sans antialiased selection:bg-[#738A75] selection:text-white overflow-x-hidden">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Parallax / Ambient Background Image */}
        <div className="absolute inset-0 z-0">
          <CoffeeImage
            src="/images/hero2.webp"
            alt="Fow Coffee Roastery"
            fill
            className="object-cover scale-105 brightness-[0.35]"
            priority
            placeholderType="both"
          />
          {/* Subtle warm overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1EA] via-transparent to-black/40 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05] drop-shadow-md">
              Menyeduh Rasa, <br className="hidden sm:inline" />
              <span className="text-[#A0B9A2]">Menjaga Semesta.</span>
            </h1>

            <p className="text-base sm:text-xl text-stone-200 font-medium max-w-2xl mx-auto leading-relaxed">
              Sebuah dedikasi untuk menghadirkan kopi murni kelas dunia dengan arsitektur pasif yang ramah lingkungan dan komitmen sirkularitas tanpa batas.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/menu"
                className="px-8 py-3.5 rounded-full bg-[#738A75] hover:bg-[#5E7560] text-white font-semibold shadow-lg shadow-[#738A75]/15 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
              >
                <span>Jelajahi Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#reserve"
                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Reservasi Meja
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom curve separator decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F4F1EA] to-transparent pointer-events-none z-10" />
      </section>

      {/* 2. CORE PHILOSOPHY SUMMARY */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-black uppercase tracking-widest text-[#738A75]">
              Filosofi Dasar Kami
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2F3E30] leading-tight tracking-tight">
              Kopi Sempurna Lahir dari Keseimbangan.
            </h2>
            <div className="w-16 h-1 bg-[#738A75] rounded-full" />
          </div>
          <div className="lg:col-span-7">
            <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-700 leading-relaxed font-normal">
              Kami percaya bahwa nikmatnya secangkir kopi tidak boleh mengorbankan masa depan bumi. Di Fow Coffee, setiap langkah dirancang dengan cermat—mulai dari kurasi biji organik, penghematan energi melalui arsitektur pasif, hingga pengolahan sisa produksi menjadi sumber daya baru. Inilah esensi dari petualangan rasa yang sejati.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE HERITAGE TIMELINE (Perjalanan Kami) */}
      <section className="py-24 bg-[#EAE7DF] border-y border-[#2F3E30]/5 relative overflow-hidden">
        {/* Floating background decorative coffee bean */}
        <div className="absolute -top-10 left-10 w-24 h-24 pointer-events-none opacity-5 select-none" style={{ backgroundImage: "url('/images/bean.png')", backgroundSize: "contain" }} />
        <div className="absolute -bottom-10 right-10 w-24 h-24 pointer-events-none opacity-5 select-none rotate-45" style={{ backgroundImage: "url('/images/bean.png')", backgroundSize: "contain" }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#738A75]">Kisah Di Balik Layar</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#2F3E30] tracking-tight">Perjalanan Fow Coffee</h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">Klik pada tahun-tahun di bawah ini untuk menjelajahi bagaimana kami bertumbuh bersama komunitas dan komitmen pelestarian alam.</p>
          </div>

          {/* Timeline Navigation Tabs */}
          <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 mb-16 relative">
            <div className="absolute h-[2px] bg-[#2F3E30]/10 left-1/4 right-1/4 z-0 pointer-events-none hidden sm:block" />

            {timelineEvents.map((evt, idx) => {
              const isActive = activeTimeline === idx;
              return (
                <button
                  key={evt.year}
                  onClick={() => setActiveTimeline(idx)}
                  className={`relative z-10 px-6 py-2.5 rounded-full text-sm sm:text-base font-extrabold tracking-tight transition-all duration-300 ${isActive
                    ? "bg-[#738A75] text-white shadow-md hover:scale-105"
                    : "bg-[#F4F1EA] text-[#2F3E30] border border-[#2F3E30]/5 hover:bg-[#EAE7DF] hover:border-[#2F3E30]/10"
                    }`}
                >
                  {evt.year}
                </button>
              );
            })}
          </div>

          {/* Timeline Active Content Slider */}
          <div className="min-h-[450px] lg:min-h-[400px]">
            <motion.div
              key={activeTimeline}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-[#F4F1EA] rounded-[36px] overflow-hidden shadow-xl border border-[#2F3E30]/5 p-6 sm:p-10"
            >
              {/* Left Side: Photo Frame */}
              <div className="lg:col-span-6 relative h-[250px] sm:h-[350px] rounded-[24px] overflow-hidden bg-stone-200">
                <CoffeeImage
                  src={timelineEvents[activeTimeline].image}
                  alt={timelineEvents[activeTimeline].title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  placeholderType="both"
                />
                <span className="absolute top-4 left-4 bg-[#738A75] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                  {timelineEvents[activeTimeline].accent}
                </span>
              </div>

              {/* Right Side: Narrative Text */}
              <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-4">
                <span className="text-[#738A75] font-black tracking-widest text-xs uppercase">
                  {timelineEvents[activeTimeline].subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#2F3E30] tracking-tight">
                  {timelineEvents[activeTimeline].title}
                </h3>
                <div className="w-12 h-0.5 bg-[#738A75]" />
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {timelineEvents[activeTimeline].description}
                </p>

                <div className="pt-4 flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-[#2F3E30]">100%</span>
                    <span className="text-[10px] text-stone-500 font-semibold uppercase">Bahan Organik</span>
                  </div>
                  <div className="w-[1px] h-8 bg-stone-300" />
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-[#2F3E30]">Sirkular</span>
                    <span className="text-[10px] text-stone-500 font-semibold uppercase">Konsep Pengolahan</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. THE CRAFT (Proses Pembuatan Kopi) */}
      <section className="py-24 bg-[#0B0604] text-[#F4F1EA] relative overflow-hidden">
        {/* Subtle radial glow background to look premium */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#738A75]/5 to-transparent rounded-full blur-[120px] pointer-events-none select-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#A0B9A2]">Seni Ekstraksi</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Sains & Karya Seduh Kami</h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto">Menelusuri proses dedikasi tinggi dari biji mentah hingga menjadi cangkir cairan penuh energi.</p>
          </div>

          {/* Grid of Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {craftSteps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={idx}
                whileHover={{ y: -8 }}
                className="group flex flex-col bg-white/5 border border-white/5 rounded-[28px] overflow-hidden transition-all duration-300"
              >
                {/* Image panel */}
                <div className="relative aspect-square w-full overflow-hidden bg-stone-900/50">
                  <CoffeeImage
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    placeholderType="both"
                  />
                  {/* Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-3xl font-black text-white/20 font-mono">
                    {step.step}
                  </span>
                </div>

                {/* Text Panel */}
                <div className="p-5 flex-grow flex flex-col text-left space-y-2 bg-[#120B06]">
                  <h3 className="text-sm md:text-base font-extrabold text-white group-hover:text-[#A0B9A2] transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-stone-400 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ECO-BUILDING DESIGN NARRATIVE */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-20">
        <div className="bg-[#EAE7DF] rounded-[48px] border border-[#2F3E30]/5 overflow-hidden shadow-lg p-8 sm:p-12 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story side */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#738A75]/10 text-[#738A75] text-[10px] font-black uppercase tracking-wider border border-[#738A75]/15">
                <Landmark className="w-3 h-3" /> Arsitektur Pasif
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2F3E30] leading-tight tracking-tight">
                Ruang Bernafas, <br />
                Bangunan Berenergi Mandiri.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                Setiap kedai kopi Fow dibangun dari filosofi **Arsitektur Pasif**. Kami mengandalkan penyekatan serat rami tebal, dinding kayu bio-termal penyimpan panas, dan kaca jendela rangkap tiga (triple glazing). Hasilnya? Kedai yang sejuk di siang hari dan hangat di malam hari tanpa konsumsi listrik AC yang berlebihan. Atap kami dilengkapi sel surya fotovoltaik yang memasok daya mandiri bagi grinder dan mesin kopi kami.
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4">
                <div className="space-y-1">
                  <span className="text-lg sm:text-2xl font-black text-[#2F3E30]">0%</span>
                  <p className="text-[10px] sm:text-xs text-stone-500 font-bold uppercase tracking-wide">Emisi Karbon Operasional</p>
                </div>
                <div className="space-y-1">
                  <span className="text-lg sm:text-2xl font-black text-[#2F3E30]">100%</span>
                  <p className="text-[10px] sm:text-xs text-stone-500 font-bold uppercase tracking-wide">Daya Panel Sel Surya</p>
                </div>
              </div>
            </div>

            {/* Photo side */}
            <div className="lg:col-span-5 relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-[36px] overflow-hidden bg-stone-100 shadow-md">
              <CoffeeImage
                src="/images/hero3.jpeg"
                alt="Fow Cafe passive architecture design"
                fill
                className="object-cover"
                placeholderType="both"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. PREMIUM CALL TO ACTION SECTION */}
      <section className="py-20 px-6 max-w-5xl mx-auto relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-[#738A75] text-white rounded-[40px] px-6 py-12 sm:py-16 md:px-12 md:py-20 overflow-hidden shadow-2xl"
        >
          {/* Accent light overlay */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-[200px] h-[200px] bg-black/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-block bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
              Kunjungi Ruang Kami
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Rasakan Sensasi Kopi <br />Ramah Lingkungan Hari Ini.
            </h2>
            <p className="text-xs sm:text-sm text-stone-100 max-w-md mx-auto leading-relaxed">
              Pintu kami selalu terbuka bagi petualang cita rasa dan pencari ketenangan. Pilih sudut ternyaman Anda dan nikmati seduhan murni kami.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/menu"
                className="px-8 py-3.5 bg-white text-[#738A75] hover:bg-[#F4F1EA] text-sm font-extrabold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-2"
              >
                <span>Lihat Menu Kopi</span>
                <ArrowRight className="w-4 h-4 text-[#738A75]" />
              </Link>
              <Link
                href="/#reserve"
                className="px-8 py-3.5 bg-transparent text-white border border-white/35 hover:bg-white/10 hover:border-white text-sm font-extrabold rounded-full hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Booking Tempat
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <FooterSection />
    </div>
  );
}
