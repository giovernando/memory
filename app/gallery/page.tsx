"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coffee, Clock, Info, ChevronRight, Award, Flame, Star, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { FadeImage } from "@/components/fade-image";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  src: string;
  description: string;
  detailedDescription: string;
  specs: Record<string, string>;
  rating?: string;
  accentColor?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "foto1",
    title: "Pour-over Ritual",
    category: "Brewing",
    categoryLabel: "Manual Brew",
    src: "/images/foto1.webp",
    description: "Seni menyeduh kopi filter secara presisi dengan metode V60 untuk mengeluarkan keasaman alami dan notes rasa buah.",
    detailedDescription: "Metode pour-over V60 kami menonjolkan profil rasa yang bersih dan kompleks dari biji kopi single origin pilihan. Air panas bersuhu 92°C dialirkan secara perlahan dengan gerakan sirkular konsisten, mengekstraksi minyak esensial dan keasaman buah yang seimbang secara sempurna demi cita rasa murni.",
    specs: {
      "Metode": "Hario V60 Filter",
      "Suhu Air": "92°C",
      "Rasio Kopi ke Air": "1:15 (15g kopi / 225g air)",
      "Waktu Seduh": "2 menit 45 detik",
      "Profil Rasa": "Clean, Bright, Floral, Tea-like",
      "Beans": "Ethiopia Yirgacheffe G1"
    },
    rating: "4.9",
    accentColor: "#738A75"
  },
  {
    id: "foto2",
    title: "The Golden Crema",
    category: "Espresso",
    categoryLabel: "Espresso",
    src: "/images/foto2.webp",
    description: "Ekstraksi espresso sempurna dengan warna keemasan yang tebal, menjanjikan rasa yang intens dan kaya.",
    detailedDescription: "Setiap shot espresso kami diekstraksi dari mesin espresso La Marzocco premium selama 25-28 detik. Crema keemasan yang terbentuk di permukaan menandakan ekstraksi minyak kopi yang optimal, menghasilkan rasa manis karamel alami dengan tekstur syrupy yang kaya dan aftertaste tahan lama.",
    specs: {
      "Mesin": "La Marzocco Linea PB",
      "Tekanan Pompa": "9 Bar",
      "Dosis Bubuk": "19.5 gram (Double Shot)",
      "Hasil Ekstraksi": "38 gram cairan",
      "Waktu Aliran": "26 detik",
      "Notes Rasa": "Dark Chocolate, Toffee, Brown Sugar"
    },
    rating: "5.0",
    accentColor: "#8c7a6b"
  },
  {
    id: "foto3",
    title: "Green Coffee Beans",
    category: "Origin",
    categoryLabel: "Asal Usul",
    src: "/images/foto3.webp",
    description: "Biji kopi hijau pilihan langsung dari petani lokal terbaik sebelum proses pemanggangan (roasting).",
    detailedDescription: "Kualitas kopi kami dimulai langsung dari akar perkebunannya. Kami bermitra secara adil dengan petani lokal di wilayah Jawa Barat dan Toraja untuk menyeleksi ceri kopi merah matang sempurna yang diproses secara cermat untuk mempertahankan kejernihan cita rasa asal usulnya.",
    specs: {
      "Origin": "Kamojang, Jawa Barat",
      "Proses Pasca-Panen": "Natural Process (Dry)",
      "Varietas": "Sigararutang, Kartika",
      "Ketinggian": "1,450 meter di atas permukaan laut",
      "Tingkat Kelembapan": "11.5%",
      "Kemitraan": "Direct Trade (Perdagangan Adil)"
    },
    rating: "4.8",
    accentColor: "#5E7560"
  },
  {
    id: "foto4",
    title: "Cold Drip Coffee",
    category: "Brewing",
    categoryLabel: "Manual Brew",
    src: "/images/foto4.webp",
    description: "Metode seduh dingin perlahan selama 12 jam untuk rasa kopi yang sangat halus dan rendah keasaman.",
    detailedDescription: "Tetes demi tetes air es murni melewati bubuk kopi pilihan kami secara konstan selama lebih dari setengah hari di menara kaca drip kami. Proses ekstraksi dingin yang lambat ini meminimalkan pelepasan senyawa pahit dan asam kasar, menciptakan minuman kopi yang luar biasa halus dan manis alami.",
    specs: {
      "Metode Ekstraksi": "Slow Cold Drip (Kyoto Style)",
      "Durasi Seduh": "12 Jam",
      "Suhu Air": "4°C (Air Es)",
      "Notes Rasa": "Winey, Ripe Berry, Sweet Chocolate",
      "Saran Penyajian": "Disajikan dingin dengan es batu kristal tunggal",
      "Beans": "Colombia Pink Bourbon"
    },
    rating: "4.9",
    accentColor: "#3F4E3F"
  },
  {
    id: "foto5",
    title: "Cozy Corner",
    category: "Ambience",
    categoryLabel: "Suasana",
    src: "/images/foto5.webp",
    description: "Sudut tenang kedai kami yang dirancang dengan elemen kayu hangat, sempurna untuk bekerja atau bersantai.",
    detailedDescription: "Suasana kedai kami dirancang sebagai 'ruang ketiga' Anda yang ramah dan menenangkan. Dikelilingi tanaman hijau segar, pencahayaan alami yang lembut dari jendela kaca besar, dan perabotan kayu jati kokoh yang dilengkapi dengan outlet listrik, menjadikannya sudut ideal untuk produktivitas mandiri maupun bercengkerama santai.",
    specs: {
      "Konsep Desain": "Japandi (Japanese-Scandinavian) Minimalist",
      "Pencahayaan": "Warm White Ambient & Natural Skylight",
      "Fasilitas": "Akses Wi-Fi High-Speed, Colokan Listrik Mandiri",
      "Kapasitas Area": "4-6 Orang per sudut",
      "Musik": "Soft Jazz / Lo-Fi Beats",
      "Jam Terbaik": "09:00 - 13:00 (Penuh Cahaya Alami)"
    },
    rating: "4.7",
    accentColor: "#9c8c7c"
  },
  {
    id: "foto6",
    title: "Latte Art Mastery",
    category: "Espresso",
    categoryLabel: "Espresso",
    src: "/images/foto6.webp",
    description: "Susu sutra bertekstur microfoam dituangkan dengan keahlian tinggi membentuk desain rosetta yang anggun.",
    detailedDescription: "Barista kami melatih teknik frothing susu secara presisi hingga menghasilkan tekstur microfoam yang menyerupai cat basah yang mengilap. Ketika dipadukan dengan espresso bercangkir tebal, terciptalah karya seni visual simetris yang juga memperhalus intensitas rasa kopi dengan kemanisan laktosa alami susu.",
    specs: {
      "Suhu Susu": "60°C - 65°C (Kemanisan Maksimal)",
      "Tekstur": "Microfoam Halus (Sutra)",
      "Pola Seni": "Rosetta / Winged Tulip",
      "Jenis Susu": "Fresh Whole Milk / Barista Edition Oatside",
      "Penyelarasan": "Espresso Blend Medium-Dark Roast",
      "Penyajian": "Cangkir Keramik Tebal 200ml"
    },
    rating: "4.9",
    accentColor: "#7c6a5c"
  },
  {
    id: "foto7",
    title: "Roasting Process",
    category: "Origin",
    categoryLabel: "Asal Usul",
    src: "/images/foto7.webp",
    description: "Proses pemanggangan biji kopi secara mikro untuk menghasilkan profil rasa unik dan aroma yang memikat.",
    detailedDescription: "Kami melakukan pemanggangan biji kopi secara berkala di dalam kedai (in-house micro-roasting) untuk memastikan kesegaran puncak. Setiap batch dikontrol secara digital melalui kurva suhu presisi untuk mencapai tingkat pemanggangan medium roast demi menonjolkan keunikan rasa daerah asal (terroir) biji kopi tersebut.",
    specs: {
      "Mesin Roasting": "Probat One Micro-Roaster",
      "Kapasitas Batch": "5 Kilogram",
      "Tingkat Roasting": "Medium Roast",
      "Suhu Maksimal": "205°C",
      "Durasi Roast": "11 menit 15 detik",
      "Periode Resting": "7-10 Hari setelah roasting sebelum diseduh"
    },
    rating: "4.8",
    accentColor: "#2F3E30"
  },
  {
    id: "foto8",
    title: "Iced Latte Refreshment",
    category: "Beverages",
    categoryLabel: "Spesialitas",
    src: "/images/foto8.webp",
    description: "Perpaduan segar espresso, susu dingin berkualitas, dan es batu murni di siang hari yang hangat.",
    detailedDescription: "Minuman pelepas dahaga klasik terfavorit yang menyatukan kekuatan espresso blend andalan kami dengan kelembutan susu segar dingin. Keseimbangan yang sempurna antara kekentalan rasa creamy susu dan tendangan kafein yang bersih, menjadikannya penyegar tubuh instan yang andal.",
    specs: {
      "Komposisi": "Double Shot Espresso, Fresh Milk, Clean Ice Cubes",
      "Susu": "Full Cream / Oat Milk (Opsional)",
      "Pemanis": "Sirup Gula Aren Cair Organik (Opsional/Terpisah)",
      "Ukuran Gelas": "12 oz (360 ml)",
      "Kadar Kafein": "Sedang-Tinggi (~130mg)",
      "Karakter": "Creamy, Refreshing, Balanced"
    },
    rating: "4.9",
    accentColor: "#6a7c6a"
  },
  {
    id: "foto9",
    title: "Barista's Precision",
    category: "Brewing",
    categoryLabel: "Manual Brew",
    src: "/images/foto9.webp",
    description: "Setiap langkah pembuatan kopi diukur secara akurat mulai dari berat bubuk hingga rasio air.",
    detailedDescription: "Di kedai kami, menyeduh kopi adalah perpaduan harmonis antara disiplin sains dan kepekaan seni. Barista kami menimbang bubuk kopi hingga akurasi miligram, memonitor laju aliran penuangan air, serta mengukur total padatan terlarut (TDS) secara konsisten untuk memastikan cita rasa yang seragam di setiap cangkir.",
    specs: {
      "Alat Ukur": "Acaia Pearl Digital Scale & Timer",
      "Akurasi Timbangan": "0.1 gram",
      "Tingkat TDS Target": "1.35% - 1.45% (Ekstraksi Optimal)",
      "Sertifikasi Barista": "SCA (Specialty Coffee Association) Certified",
      "Grinder": "Mahlkönig EK43S (Konsistensi Partikel Tinggi)",
      "Standardisasi": "SOP Seduh Ketat Harian"
    },
    rating: "4.8",
    accentColor: "#4E5E4E"
  },
  {
    id: "foto10",
    title: "Signature Espresso",
    category: "Espresso",
    categoryLabel: "Espresso",
    src: "/images/foto10.webp",
    description: "Espresso murni dari house-blend kami, kaya akan notes cokelat hitam dan citrus manis.",
    detailedDescription: "Merupakan intisari dari filosofi kopi kami. Diekstraksi dari biji kopi musiman terbaik yang dipadukan untuk menghasilkan espresso yang seimbang: asam jeruk citrus yang segar di awal penuangan, disusul kepekatan rasa manis gula merah, dan diakhiri dengan aftertaste cokelat hitam yang membekas indah.",
    specs: {
      "Notes Rasa Dominan": "Dark Chocolate, Sweet Citrus, Brown Sugar",
      "Komposisi Blend": "50% Flores Bajawa (Washed), 50% Colombia Huila (Natural)",
      "Dosis Portafilter": "20 gram",
      "Yield Cairan": "40 gram (Rasio 1:2)",
      "Waktu Ekstraksi": "27 detik",
      "Tingkat Keasaman": "Medium-High, Lembut"
    },
    rating: "5.0",
    accentColor: "#1d291e"
  },
  {
    id: "foto11",
    title: "Vanilla Cloud Latte",
    category: "Beverages",
    categoryLabel: "Spesialitas",
    src: "/images/foto11.webp",
    description: "Kombinasi latte lembut dengan sirup vanilla organik buatan sendiri dan foam krim tebal.",
    detailedDescription: "Minuman kreasi spesial yang memanjakan lidah. Kami mengekstraksi sirup vanilla secara in-house dari batang vanilla Madagaskar pilihan, mencampurkannya ke dalam espresso pekat dan susu hangat, lalu menyempurnakannya dengan lapisan cold-foam vanilla yang tebal namun selembut awan di atasnya.",
    specs: {
      "Pemanis Utama": "Sirup Vanilla Organik Madagaskar (Homemade)",
      "Topping": "Vanilla Cold Foam & Sedikit Bubuk Vanilla Bean",
      "Espresso": "Single-Origin Colombia (Profil Sweet-Caramel)",
      "Suhu Saji": "62°C (Hangat) / Dingin dengan Es",
      "Notes Rasa": "Rich Vanilla, Buttery, Mildly Coffee-Forward",
      "Kategori Populer": "Best Seller Sweet Beverage"
    },
    rating: "5.0",
    accentColor: "#806d5c"
  },
  {
    id: "foto12",
    title: "Matcha Harmony",
    category: "Beverages",
    categoryLabel: "Spesialitas",
    src: "/images/foto12.webp",
    description: "Matcha murni Uji, Jepang, yang dikocok tradisional lalu dituangkan di atas susu segar.",
    detailedDescription: "Bagi pencinta non-kopi, kami menghadirkan Matcha Jepang berkualitas ceremonial dari bukit teh Uji, Kyoto. Bubuk matcha hijau pekat dikocok menggunakan chasen (kocokan bambu) tradisional untuk menghasilkan emulsi busa yang tebal dan aroma umami alami yang khas, lalu disatukan dengan susu segar yang creamy.",
    specs: {
      "Bahan Utama": "100% Ceremonial-Grade Uji Matcha",
      "Alat Pengocok": "Chasen (Bambu Jepang Tradisional) & Chawan (Mangkuk)",
      "Metode Campuran": "Whisked-to-order (Dibuat langsung saat dipesan)",
      "Susu Pendukung": "Fresh Whole Milk / Almond Milk (Sangat Direkomendasikan)",
      "Notes Rasa": "Earthy, Umami, Vegetal, Creamy Sweetness",
      "Kandungan Gula": "Tanpa gula tambahan (Hanya kemanisan alami susu)"
    },
    rating: "4.9",
    accentColor: "#556B2F"
  },
  {
    id: "foto13",
    title: "Blueberry Crumble Muffin",
    category: "Pastries",
    categoryLabel: "Pastry",
    src: "/images/foto13.webp",
    description: "Muffin lembut yang dipanggang segar setiap pagi, penuh dengan buah blueberry berair dan taburan renyah.",
    detailedDescription: "Kudapan pendamping sempurna untuk secangkir kopi hitam hangat Anda. Dipanggang segar setiap pagi sebelum pintu kedai dibuka, muffin mentega ini memiliki bagian dalam yang sangat lembut dan sarat dengan buah blueberry utuh berair yang meletup saat digigit, berpadu kontras dengan taburan crumble mentega renyah manis di atasnya.",
    specs: {
      "Status Pembuatan": "Baked Fresh Daily In-house",
      "Bahan Utama": "Fresh Blueberry, French Butter, Flour, Demerara Sugar",
      "Tekstur": "Soft-moist crumb inside, Crunchy buttery crumble top",
      "Saran Pasangan Kopi": "Filter Coffee (Black) / Espresso Shot",
      "Alergen": "Mengandung Gluten, Dairy (Mentega & Susu), Telur",
      "Saran Konsumsi": "Paling lezat disajikan hangat (bisa dipanaskan kembali)"
    },
    rating: "4.8",
    accentColor: "#4B382A"
  }
];

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "Brewing", label: "Manual Brew" },
  { id: "Espresso", label: "Espresso" },
  { id: "Beverages", label: "Spesialitas" },
  { id: "Ambience", label: "Suasana" },
  { id: "Pastries", label: "Pastry" }
];

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter gallery items based on category
  const filteredItems = activeCategory === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2F3E30] flex flex-col relative grain-overlay overflow-x-hidden overflow-y-clip">

      {/* Premium Header */}
      <Header />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center">

        {/* Gallery Hero Header Section */}
        <div className="text-center mb-12 max-w-2xl space-y-4 animate-reveal-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2F3E30]/20 bg-[#E4E1DA]/40 text-xs font-semibold tracking-wider uppercase mb-1">
            {/* <Sparkles className="w-3.5 h-3.5 text-[#738A75] animate-pulse" /> */}
            <span>Koleksi Eksklusif</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-[#2F3E30] leading-tight">
            Jurnal Visual <br />
            <span className="font-medium text-[#738A75]">Coffee Shop</span>
          </h1>

          <p className="text-sm md:text-base text-[#2F3E30]/80 leading-relaxed font-sans font-medium">
            Setiap cangkir menyembunyikan dedikasi petani, keahlian tangan barista, serta kenyamanan ruang yang kami bangun untuk Anda. Klik foto untuk menjelajahi spesifikasi dan kisah di baliknya.
          </p>
        </div>

        {/* Categories Navigation Filter Tabs */}
        <div className="w-full flex justify-center mb-12 animate-reveal-up animation-delay-100">
          <div className="flex items-center gap-2 bg-[#E4E1DA]/60 border border-[#2F3E30]/5 rounded-full p-1.5 overflow-x-auto max-w-full no-scrollbar shadow-inner shadow-stone-900/5">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative px-4 sm:px-6 py-2 rounded-full text-xs md:text-sm font-sans font-semibold tracking-wide transition-all duration-300 whitespace-nowrap focus:outline-none ${activeCategory === category.id
                  ? "text-white z-10"
                  : "text-[#2F3E30]/70 hover:text-[#2F3E30] hover:bg-[#E4E1DA]/80"
                  }`}
              >
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#2F3E30] rounded-full -z-10 shadow-sm"
                  />
                )}
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid (4 Columns Desktop/Tablet, 2 Columns Mobile) */}
        {!mounted ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#E4E1DA]/40 border border-[#8c7a6b]/10 p-4 sm:p-5 flex flex-col justify-end gap-3 animate-pulse"
              >
                {/* Rating Badge Skeleton */}
                <div className="absolute top-3.5 right-3.5 w-12 h-6 rounded-full bg-[#D4D1CA]/60" />
                
                {/* Category Skeleton */}
                <div className="w-16 h-3.5 rounded-full bg-[#D4D1CA]/60" />
                
                {/* Title Skeleton */}
                <div className="w-3/4 h-5 rounded-md bg-[#D4D1CA]/60" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full animate-reveal-up animation-delay-200"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-white border border-[#8c7a6b]/15 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
                >
                  {/* Fade Image with Custom Skeleton Loading Placeholder */}
                  <FadeImage
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Always-on Bottom Shadow Gradient for Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10 transition-opacity duration-300" />

                  {/* Overlaid Bottom Title and Category Label */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-20 text-white text-left flex flex-col justify-end">
                    <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-stone-300 opacity-90 font-sans">
                      {item.categoryLabel}
                    </span>
                    <h3 className="text-xs sm:text-base font-bold font-sans line-clamp-1 mt-0.5 tracking-tight group-hover:text-[#F4F1EA] transition-colors duration-300">
                      {item.title}
                    </h3>

                    {/* Subtle Interactive Arrow displayed on Hover (Desktop) */}
                    <div className="flex items-center gap-1.2 mt-2 text-[10px] sm:text-xs font-semibold text-[#738A75] opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 font-sans">
                      <span>Lihat Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Rating Badge */}
                  {item.rating && (
                    <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold font-sans">
                      <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state when no items matching category filter */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
          >
            <div className="h-14 w-14 rounded-full bg-[#E4E1DA] flex items-center justify-center text-[#738A75]">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Koleksi Tidak Ditemukan</h3>
            <p className="text-sm text-stone-500 max-w-sm">
              Maaf, saat ini belum ada foto untuk kategori ini. Silakan pilih kategori lainnya untuk menjelajahi koleksi kami.
            </p>
          </motion.div>
        )}

      </main>

      {/* Global Interactive Lightbox Modal (Detail View) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
          >
            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F4F1EA] text-[#2F3E30] rounded-[32px] overflow-hidden max-w-4xl w-full max-h-[90vh] md:max-h-[85vh] shadow-2xl border border-stone-300/40 flex flex-col md:flex-row relative cursor-default"
            >
              {/* Close Button Floating top right */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-40 flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-white hover:bg-[#2F3E30] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none shadow-md"
                aria-label="Tutup Detail"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Premium Image Frame */}
              <div className="w-full md:w-1/2 relative min-h-[260px] md:min-h-full aspect-[4/5] md:aspect-auto bg-stone-950 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-stone-200/50">
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />

                {/* Visual Watermark/Indicator */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-sm border border-white/10 text-white text-[10px] font-semibold font-sans uppercase tracking-widest">
                  <Coffee className="w-3.5 h-3.5 text-[#738A75]" />
                  <span>Coffee Journal</span>
                </div>
              </div>

              {/* Right Column: Detailed Storytelling and Specifications */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">

                {/* Content Top Section */}
                <div className="space-y-4">

                  {/* Category Pill and Rating */}
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-sans border"
                      style={{
                        color: selectedItem.accentColor,
                        borderColor: `${selectedItem.accentColor}30`,
                        backgroundColor: `${selectedItem.accentColor}12`
                      }}
                    >
                      {selectedItem.categoryLabel}
                    </span>

                    {selectedItem.rating && (
                      <div className="flex items-center gap-1 text-[#2F3E30] text-xs font-bold font-sans">
                        <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                        <span>{selectedItem.rating} / 5.0 Rating</span>
                      </div>
                    )}
                  </div>

                  {/* Main Title */}
                  <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-[#2F3E30] leading-tight">
                    {selectedItem.title}
                  </h2>

                  {/* Divider line */}
                  <div className="h-[1px] w-12 bg-[#738A75]" />

                  {/* Detailed Description */}
                  <p className="text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed font-sans font-medium text-justify">
                    {selectedItem.detailedDescription}
                  </p>
                </div>

                {/* Content Bottom Section (Technical Specifications Panel) */}
                <div className="mt-8 border-t border-stone-200/80 pt-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#738A75] mb-2 font-sans">
                    <Info className="w-3.5 h-3.5" />
                    <span>Detail Spesifikasi & Parameter</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-sans">
                    {Object.entries(selectedItem.specs).map(([key, value]) => (
                      <div key={key} className="flex flex-col border-b border-stone-200/40 pb-2">
                        <span className="text-stone-400 font-bold tracking-wide text-[9px] uppercase">{key}</span>
                        <span className="text-[#2F3E30] font-bold mt-1 leading-snug text-stone-700/90">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Footer Section */}
      <FooterSection />

    </div>
  );
}
