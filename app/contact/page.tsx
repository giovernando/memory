"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { 
  MapPin, Phone, Mail, Clock, ArrowRight, Coffee, Compass, ExternalLink 
} from "lucide-react";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { CoffeeImage } from "@/components/coffee-image";

// Framer motion configs
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: custom * 0.1,
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

export default function ContactPage() {
  const contactInfos = [
    {
      icon: MapPin,
      title: "Alamat Kami",
      details: "Jl. Bumi Lestari No. 42, Dago, Bandung, Jawa Barat 40135",
      actionText: "Buka Petunjuk Arah",
      link: "https://maps.google.com/?q=-6.887955593111059,107.6206037750438"
    },
    {
      icon: Phone,
      title: "Telepon & WhatsApp",
      details: "+62 812-3456-7890",
      actionText: "Kirim Chat WA",
      link: "https://wa.me/6281234567890"
    },
    {
      icon: Mail,
      title: "Email Resmi",
      details: "hello@fowcoffee.com",
      actionText: "Kirim Surat Elektronik",
      link: "mailto:hello@fowcoffee.com"
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      details: "Senin - Jumat: 08:00 - 22:00 WIB\nSabtu - Minggu: 07:00 - 23:00 WIB",
      actionText: "Sesuai Zona Waktu Lokal"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2F3E30] font-sans antialiased selection:bg-[#738A75] selection:text-white overflow-x-hidden">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
        {/* Parallax / Ambient Background Image */}
        <div className="absolute inset-0 z-0">
          <CoffeeImage
            src="/images/hero2.webp"
            alt="Fow Coffee Ambient"
            fill
            className="object-cover scale-105 brightness-[0.3]"
            priority
            placeholderType="both"
          />
          {/* Subtle warm gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1EA] via-transparent to-black/30 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <span className="text-xs font-black uppercase tracking-widest text-[#A0B9A2]">
              Hubungi & Kunjungi Ruang Kami
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Pintu Kami <br className="sm:hidden" />
              <span className="text-[#A0B9A2]">Selalu Terbuka.</span>
            </h1>
            <p className="text-sm sm:text-base text-stone-200 font-medium max-w-lg mx-auto leading-relaxed">
              Ada pertanyaan, masukan, atau sekadar ingin berkunjung? Tim barista dan hospitality kami siap menyambut Anda dengan kehangatan penuh.
            </p>
          </motion.div>
        </div>

        {/* Bottom curve decorator */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#F4F1EA] to-transparent pointer-events-none z-10" />
      </section>

      {/* 2. CONTACT CHANNELS & MAP GRID */}
      <section className="py-16 px-6 max-w-7xl mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#738A75]">
                Saluran Informasi
              </span>
              <h2 className="text-3xl font-black text-[#2F3E30] tracking-tight text-left">
                Hubungi Kami Secara Langsung
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal text-left">
                Temukan koordinat kami atau hubungi kami melalui opsi layanan pesan instan di bawah ini. Kami berkomitmen untuk merespons setiap pesan dalam waktu kurang dari 24 jam.
              </p>
            </div>

            {/* Cards Stagger Container */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4"
            >
              {contactInfos.map((info, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  custom={idx}
                  className="bg-[#EAE7DF] border border-[#2F3E30]/5 rounded-[24px] p-6 hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#738A75]/10 flex items-center justify-center shrink-0 text-[#738A75]">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h3 className="text-sm font-extrabold text-[#2F3E30] tracking-tight">
                      {info.title}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium whitespace-pre-line leading-relaxed">
                      {info.details}
                    </p>
                    {info.link ? (
                      <a 
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#738A75] hover:text-[#5E7560] transition-colors pt-1 group"
                      >
                        <span>{info.actionText}</span>
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block pt-1">
                        {info.actionText}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Interactive Styled Map */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-[#EAE7DF]/60 backdrop-blur-sm border border-[#2F3E30]/5 rounded-[36px] p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col gap-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#738A75]/5 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#738A75]/10 text-[#738A75] text-[10px] font-black uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5" /> Peta Lokasi Presisi
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#2F3E30] tracking-tight">
                    Fow Coffee Dago
                  </h3>
                </div>

                <a
                  href="https://maps.google.com/?q=-6.887955593111059,107.6206037750438"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#738A75] hover:bg-[#5E7560] text-white font-extrabold text-xs rounded-full shadow-md hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 group self-start sm:self-auto"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Styled Map Container */}
              <div className="relative aspect-video w-full rounded-[24px] overflow-hidden border border-[#2F3E30]/10 shadow-inner bg-stone-100 z-10">
                {/* Real Interactive Iframe Map (Dago, Coblong, Bandung Coordinates) */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0221370259837!2d107.6206037750438!3d-6.887955593111059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6fc6d610ec1%3A0x1d4d081f9b3b8fe!2sDago%2C%20Coblong%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1715100000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Fow Coffee Dago"
                  className="absolute inset-0 grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out"
                />
                
                {/* Ambient vignette framing around the map */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(47,62,48,0.08)] rounded-[24px]" />
              </div>

              <p className="text-xs text-stone-600 font-medium leading-relaxed text-left relative z-10">
                Kedai utama kami bertempat di kawasan dataran tinggi Dago yang sejuk dan asri, dikelilingi rindangnya pepohonan pinus. Sangat nyaman untuk bersantai produktif ataupun berkumpul hangat bersama kerabat dekat.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. BOTTOM PREMIUM CTA CARD */}
      <section className="py-12 px-6 max-w-5xl mx-auto relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-[#738A75] text-white rounded-[40px] px-6 py-12 sm:py-16 overflow-hidden shadow-2xl"
        >
          {/* Subtle decorative overlays */}
          <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-white/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-[180px] h-[180px] bg-black/10 rounded-full blur-[50px] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-5">
            <span className="inline-block bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
              Pertemuan Komunitas
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Ingin Merencanakan Acara?
            </h2>
            <p className="text-xs sm:text-sm text-stone-100 max-w-sm mx-auto leading-relaxed">
              Ruang kaca, taman dalam ruangan, dan roastery kami dapat dipesan untuk pertemuan privat, workshop seni, maupun syuting komersial.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Fow%20Coffee%2C%20saya%20tertarik%20untuk%20sewa%20tempat%20atau%20mengadakan%20acara..."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-white text-[#738A75] hover:bg-[#F4F1EA] text-xs font-black rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-1.5"
              >
                <span>Diskusikan via WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-[#738A75]" />
              </a>
              <a
                href="/#reserve"
                className="px-8 py-3.5 bg-transparent text-white border border-white/35 hover:bg-white/10 hover:border-white text-xs font-black rounded-full hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Reservasi Meja Harian
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <FooterSection />
    </div>
  );
}
