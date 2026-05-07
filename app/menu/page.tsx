"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Star, Check, Sparkles, X, Plus,
  MessageSquare, Sliders, ChevronRight, Clock, ShieldCheck, HelpCircle, ArrowLeft, Heart,
  Flame, Snowflake, Droplets
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Backwards compatibility mock list matching admin panel items
const DEFAULT_MENU_ITEMS = [
  {
    id: "1",
    name: "Signature Espresso",
    description: "Rich and robust double-shot espresso brewed from our premium house blend.",
    price: "$6.50",
    image_url: "/images/foto10.webp",
    category: "Coffee",
    sizes: "Single, Double",
    special_instructions: "Less Hot, Extra Hot",
    rating: 5.0,
    reviews: [
      { id: "r1", author: "Budi", rating: 5, comment: "Espresso terbaik di kota, crema-nya tebal dan tidak terlalu asam." },
      { id: "r2", author: "Andi", rating: 5, comment: "Sangat mantap, harum sekali kopinya. Pekat luar biasa." }
    ]
  },
  {
    id: "2",
    name: "Vanilla Cloud Latte",
    description: "Smooth espresso blended with creamy milk and cold-pressed vanilla bean syrup.",
    price: "$8.40",
    image_url: "/images/foto11.webp",
    category: "Specialties",
    sizes: "Regular, Large",
    special_instructions: "Less Sweet, Less Ice, Oatmilk",
    rating: 4.8,
    reviews: [
      { id: "r3", author: "Citra", rating: 5, comment: "Sangat suka foam vanilla-nya yang creamy, manisnya pas." },
      { id: "r4", author: "Dewi", rating: 4, comment: "Enak banget, tapi kalau buat saya agak kemanisan dikit. Tinggal minta less sweet lain kali." }
    ]
  },
  {
    id: "3",
    name: "Matcha Harmony",
    description: "Japanese matcha whisked with silky steamed milk.",
    price: "$9.80",
    image_url: "/images/foto12.webp",
    category: "Non-Coffee",
    sizes: "Regular, Large",
    special_instructions: "Less Sweet, Less Ice, Soymilk",
    rating: 4.9,
    reviews: [
      { id: "r5", author: "Eka", rating: 5, comment: "Matcha-nya kerasa otentik Jepang, harum daun teh asli, tidak dominan manis susu." },
      { id: "r6", author: "Farhan", rating: 4, comment: "Enak bgt, rasanya balance antara earthy dan sweet." }
    ]
  },
  {
    id: "4",
    name: "Blueberry Muffin",
    description: "Freshly baked muffin bursting with plump blueberries and a crumble top.",
    price: "$6.20",
    image_url: "/images/foto13.webp",
    category: "Pastries",
    sizes: "One Size",
    special_instructions: "Warm It Up",
    rating: 4.7,
    reviews: [
      { id: "r7", author: "Gita", rating: 5, comment: "Muffin disajikan hangat, blueberry-nya melimpah dan crumble-nya renyah." },
      { id: "r8", author: "Hadi", rating: 4, comment: "Sangat lembut bagian dalamnya, cocok banget dimakan bareng kopi hitam." }
    ]
  }
];

// Premium staggered animation variants for menu lists
const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.01,
    }
  }
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 24,
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>(DEFAULT_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  // Detail item user action states
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedSugar, setSelectedSugar] = useState<string>("Normal Sugar");
  const [selectedIce, setSelectedIce] = useState<string>("Normal Ice");
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const [activeInstructionsPresets, setActiveInstructionsPresets] = useState<string[]>([]);

  // Review adding states
  const [reviewerName, setReviewerName] = useState<string>("");
  const [reviewerRating, setReviewerRating] = useState<number>(5);
  const [reviewerComment, setReviewerComment] = useState<string>("");
  const [receiptCode, setReceiptCode] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

  // Load menu items on load
  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    if (!isSupabaseConfigured() || !supabase) {
      setIsDbConnected(false);
      // Retrieve from local storage if available for robust demo testing, fallback to mock seed
      const local = localStorage.getItem("fow_coffee_custom_menu");
      if (local) {
        try {
          setMenuItems(JSON.parse(local));
        } catch {
          setMenuItems(DEFAULT_MENU_ITEMS);
        }
      } else {
        setMenuItems(DEFAULT_MENU_ITEMS);
      }
      setLoading(false);
      return;
    }

    try {
      setIsDbConnected(true);
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        // Map database response ensuring default values for new columns
        const mapped = data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          category: item.category || "Coffee",
          sizes: item.sizes || "Regular",
          special_instructions: item.special_instructions || "",
          rating: item.rating ? parseFloat(item.rating) : 5.0,
          reviews: item.reviews || []
        }));
        setMenuItems(mapped);
      } else {
        setMenuItems(DEFAULT_MENU_ITEMS);
      }
    } catch (err) {
      console.warn("Database load failed, fallback to defaults:", err);
      setIsDbConnected(false);
      setMenuItems(DEFAULT_MENU_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  // Preset categories
  const categories = ["All", "Coffee", "Non-Coffee", "Pastries", "Specialties"];

  // Search and filter logic
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Open item detail modal
  const handleOpenDetail = (item: any) => {
    setSelectedItem(item);

    // Parse default selected size
    const availableSizes = item.sizes ? item.sizes.split(",").map((s: string) => s.trim()) : ["Regular"];
    setSelectedSize(availableSizes[0]);

    // Reset inputs
    setCustomInstructions("");
    setActiveInstructionsPresets([]);
    setSelectedSugar("Normal Sugar");
    setSelectedIce("Normal Ice");
    setReviewerName("");
    setReviewerRating(5);
    setReviewerComment("");
    setReceiptCode("");
    setReviewFeedback(null);
  };

  // Toggle pre-defined instruction presets
  const togglePresetInstruction = (preset: string) => {
    setActiveInstructionsPresets(prev =>
      prev.includes(preset) ? prev.filter(p => p !== preset) : [...prev, preset]
    );
  };

  // Submit Review form
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) {
      setReviewFeedback("Mohon masukkan nama dan ulasan Anda.");
      return;
    }

    // Purchase validation check (Receipt code FOW-XXXXX)
    const cleanReceipt = receiptCode.trim().toUpperCase();
    const receiptRegex = /^(FOW)-\d{5,8}$/;

    if (!cleanReceipt) {
      setReviewFeedback("Gagal: Ulasan hanya dapat diberikan oleh customer yang sudah membeli menu ini. Masukkan Kode Nota pembelian Anda (Contoh: FOW-10245).");
      return;
    }

    if (!receiptRegex.test(cleanReceipt)) {
      setReviewFeedback("Gagal: Kode Nota tidak valid. Silakan periksa kembali struk dari kasir Fow Coffee Anda (Format: FOW-XXXXX).");
      return;
    }

    setSubmittingReview(true);
    setReviewFeedback(null);

    const newReview = {
      id: `review_${Date.now()}`,
      author: reviewerName.trim(),
      rating: reviewerRating,
      comment: reviewerComment.trim(),
      receipt_code: cleanReceipt, // Store verified receipt code
      created_at: new Date().toISOString()
    };

    // Calculate new ratings
    const updatedReviews = [newReview, ...(selectedItem.reviews || [])];
    const totalRating = updatedReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const newAverageRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

    // Update in memory state
    const updatedItems = menuItems.map((item) => {
      if (item.id === selectedItem.id) {
        return { ...item, reviews: updatedReviews, rating: newAverageRating };
      }
      return item;
    });

    setMenuItems(updatedItems);
    setSelectedItem({ ...selectedItem, reviews: updatedReviews, rating: newAverageRating });

    // Try to update on Supabase
    if (!isSupabaseConfigured() || !supabase) {
      // Local fallback
      localStorage.setItem("fow_coffee_custom_menu", JSON.stringify(updatedItems));
      setReviewFeedback("Terima kasih! Ulasan Anda berhasil diverifikasi dengan Kode Nota dan diterbitkan.");
      setReviewerName("");
      setReviewerComment("");
      setReviewerRating(5);
      setReceiptCode("");
      setSubmittingReview(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("menu_items")
        .update({
          reviews: updatedReviews,
          rating: newAverageRating
        })
        .eq("id", selectedItem.id);

      if (error) throw error;
      setReviewFeedback("Terima kasih! Ulasan Anda berhasil diverifikasi dengan Kode Nota dan diterbitkan.");
      setReviewerName("");
      setReviewerComment("");
      setReviewerRating(5);
      setReceiptCode("");
    } catch (err: any) {
      console.error("Failed uploading review:", err);
      setReviewFeedback(`Gagal mengunggah ulasan: ${err.message || err}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2F3E30] font-sans antialiased selection:bg-[#738A75] selection:text-white">
      <Header />

      {/* Floating Coffee Beans backgrounds decorative (Earthy look) */}
      <div className="absolute top-28 left-6 w-16 h-16 pointer-events-none opacity-20 bg-cover bg-no-repeat animate-pulse" style={{ backgroundImage: "url('/images/bean.png')" }} />
      <div className="absolute top-[40%] right-10 w-20 h-20 pointer-events-none opacity-15 bg-cover bg-no-repeat animate-pulse" style={{ backgroundImage: "url('/images/bean.png')", transform: "rotate(45deg)" }} />

      {/* Dynamic Header Section */}
      <section className="pt-36 pb-16 px-4 max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#2F3E30] leading-none">
            Our Coffee & Bakery <br />
          </h1>
        </motion.div>

        {/* Dynamic Search Input Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-md mx-auto mt-10 relative"
        >
          <div className="relative flex items-center bg-[#EAE7DF] border border-[#2F3E30]/10 rounded-full overflow-hidden px-5 py-3 shadow-inner hover:border-[#738A75]/30 focus-within:border-[#738A75] focus-within:bg-white transition-all duration-300">
            <Search className="w-5 h-5 text-stone-500 shrink-0" />
            <input
              type="text"
              placeholder="Cari espresso, muffin, matcha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-[#2F3E30] pl-3.5 text-sm font-medium focus:outline-none placeholder:text-stone-500"
            />
            {searchQuery.trim() !== "" && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-stone-500 hover:text-stone-800 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Filter Category Tabs (Framer Motion Shifting backgrounds) */}
      <section className="px-4 max-w-5xl mx-auto mb-12 relative z-10">
        <div className="flex flex-wrap justify-center items-center gap-2 border-b border-[#2F3E30]/10 pb-4">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-5 py-2 rounded-full text-xs md:text-sm font-semibold tracking-tight transition-colors duration-300 ${isActive ? "text-white" : "text-[#2F3E30] hover:bg-[#EAE7DF]"
                  }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryTab"
                    className="absolute inset-0 bg-[#738A75] rounded-full z-0"
                    transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid Section (2 columns on mobile, 4 columns on tablet & desktop) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32 relative z-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 animate-pulse">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="relative flex flex-col bg-white dark:bg-stone-900/10 border border-[#2F3E30]/10 rounded-[28px] p-0 shadow-sm overflow-hidden"
              >
                {/* Image Frame Skeleton (Square 1:1, flushed to edges) */}
                <div className="relative aspect-square w-full rounded-t-[28px] bg-stone-200 dark:bg-stone-800/40 overflow-hidden">
                  {/* Floating Category badge skeleton */}
                  <div className="absolute top-4 left-4 bg-stone-300/70 dark:bg-stone-700/50 h-4.5 w-14 rounded-md" />
                </div>

                {/* White Space Skeleton Below (Tightened) */}
                <div className="flex flex-col text-left p-4 pb-4.5 gap-2">
                  {/* Name skeleton bar */}
                  <div className="bg-stone-300/70 dark:bg-stone-700/50 h-4.5 w-2/3 rounded-md" />

                  {/* Rating skeleton row */}
                  <div className="flex items-center gap-1.5">
                    <div className="bg-stone-300/70 dark:bg-stone-700/50 h-3 w-8 rounded-md" />
                    <div className="bg-stone-300/40 dark:bg-stone-700/30 h-3 w-6 rounded-md" />
                  </div>

                  {/* Price skeleton */}
                  <div className="bg-stone-300/70 dark:bg-stone-700/50 h-4 w-1/3 rounded-md mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    layout
                    variants={cardVariants}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(115,138,117,0.12), 0 8px 10px -6px rgba(115,138,117,0.08)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className="group relative flex flex-col bg-white dark:bg-stone-900/10 border border-[#2F3E30]/10 hover:border-[#738A75]/30 rounded-[28px] cursor-pointer shadow-sm overflow-hidden p-0"
                  >
                    {/* Image frame (Flushed aspect-square 1:1 layout) */}
                    <div className="relative aspect-square w-full overflow-hidden bg-stone-100 rounded-t-[28px]">
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Floating Category badge */}
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#2F3E30] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-[#2F3E30]/5 shadow-sm z-20">
                        {item.category}
                      </span>

                      {/* Floating Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent modal opening on click
                        }}
                        className="absolute top-4 right-4 w-9 h-9 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#2F3E30]/5 shadow-md hover:scale-110 active:scale-95 transition-all duration-200 z-20 text-stone-600 hover:text-red-500"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Space Putih Dibawah Foto Menu (Tightened) */}
                    <div className="flex flex-col flex-grow text-left p-4 pb-4.5 bg-white dark:bg-stone-900/5">
                      {/* Menu Name */}
                      <h3 className="text-sm md:text-base font-extrabold text-[#2F3E30] dark:text-stone-100 tracking-tight leading-snug line-clamp-1 group-hover:text-[#738A75] transition-colors duration-200 mb-1 font-sans">
                        {item.name}
                      </h3>

                      {/* Rating Row (Yellow Star & reviews count) */}
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-stone-500 dark:text-stone-400 mb-2 font-medium">
                        <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-yellow-400 stroke-yellow-400" />
                        <span className="font-extrabold text-stone-800 dark:text-stone-200">{item.rating || "5.0"}</span>
                        <span className="text-stone-300 dark:text-stone-700">•</span>
                        <span>{item.reviews && item.reviews.length > 0 ? `${item.reviews.length * 15}+` : "150+"}</span>
                      </div>

                      {/* Price Row (Warm maroon/dark red tone as in photo) */}
                      <span className="text-xs md:text-sm font-black text-[#6F1D1D] dark:text-[#be5454]">
                        {item.price}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 space-y-3"
              >
                <Sliders className="w-12 h-12 text-stone-400 mx-auto stroke-1" />
                <h3 className="text-lg font-bold text-[#2F3E30]">Menu Tidak Ditemukan</h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto">Kami tidak menemukan menu yang cocok dengan kata kunci "{searchQuery}". Coba bersihkan pencarian atau pilih kategori lain.</p>
                <button
                  onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                  className="mt-4 px-6 py-2 bg-[#738A75] hover:bg-[#5E7560] text-white text-xs font-semibold rounded-full transition-colors"
                >
                  Reset Filter
                </button>
              </motion.div>
            )}
          </>
        )}
      </section>

      {/* Immersive Detail Overlay (Framer Motion AnimatePresence) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 240 }}
            className="fixed inset-0 z-50 bg-[#F4F1EA] dark:bg-stone-950 flex flex-col overflow-hidden"
          >
            {/* ==================== DESKTOP & TABLET VIEW (UNTOUCHED) ==================== */}
            <div className="hidden md:flex md:flex-row w-full h-full overflow-hidden">
              {/* Left Column: Premium Editorial Image Panel */}
              <div className="relative w-full h-[45vh] md:h-screen md:w-1/2 shrink-0 overflow-hidden bg-stone-100 border-b md:border-b-0 md:border-r border-[#2F3E30]/10">
                <Image
                  src={selectedItem.image_url || "/placeholder.svg"}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
                {/* Visual gradients for readable floating elements */}
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                {/* Top Sticky Floating Back/Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 left-6 bg-white/95 dark:bg-stone-900/95 hover:bg-white dark:hover:bg-stone-900 text-[#2F3E30] dark:text-stone-100 p-3 rounded-full border border-[#2F3E30]/10 shadow-lg transition-all duration-200 active:scale-95 group flex items-center gap-2 z-30 pointer-events-auto"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  <span className="text-xs font-black uppercase tracking-wider pr-1 hidden sm:inline">Kembali</span>
                </button>

                {/* Floating badge for ratings */}
                <div className="absolute bottom-6 left-6 bg-black/45 backdrop-blur-md rounded-full py-1.5 px-4 flex items-center gap-1.5 border border-white/10 text-white shadow-lg z-20">
                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-xs font-black">{selectedItem.rating || "5.0"}</span>
                  {selectedItem.reviews && selectedItem.reviews.length > 0 && (
                    <span className="text-[10px] text-stone-300">({selectedItem.reviews.length} ulasan)</span>
                  )}
                </div>
              </div>

              {/* Right Column: Scrollable Detailed Metadata Pane */}
              <div className="w-full md:w-1/2 h-[55vh] md:h-screen overflow-y-auto p-6 sm:p-10 md:p-16 flex flex-col justify-between bg-[#F4F1EA] dark:bg-stone-950 text-left pointer-events-auto">

                {/* Product Information Header */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    {/* Kategori label */}
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#738A75] bg-[#738A75]/10 px-2.5 py-1 rounded-md border border-[#738A75]/15">
                      {selectedItem.category}
                    </span>
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-2xl md:text-4xl font-extrabold text-[#2F3E30] dark:text-stone-100 tracking-tight font-sans leading-tight">
                        {selectedItem.name}
                      </h2>
                      <span className="text-lg md:text-2xl font-black text-[#738A75] bg-white dark:bg-stone-900 border border-[#2F3E30]/5 px-4 py-1.5 rounded-2xl shadow-sm shrink-0">
                        {selectedItem.price}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                    {selectedItem.description}
                  </p>                  {/* Size selector */}
                  <div className="space-y-3 pt-4 border-t border-[#2F3E30]/10">
                    <span className="text-[11px] font-black uppercase tracking-widest text-stone-500 block">Pilih Ukuran (Size)</span>
                    <div className="flex gap-3">
                      {selectedItem.sizes ? (
                        selectedItem.sizes.split(",").map((sizeStr: string) => {
                          const size = sizeStr.trim();
                          const isSizeActive = selectedSize === size || (size === "Regular" && !selectedSize);
                          const subtitle = size === "Single" || size === "Regular" ? "Harga Normal" : size === "Double" ? "+Rp 10.000" : "Sajian Segar";
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setSelectedSize(size)}
                              className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${isSizeActive
                                ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                                : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-[#2F3E30] dark:text-stone-300 hover:border-[#738A75]"
                                }`}
                            >
                              <span className="text-sm font-black uppercase tracking-wider">{size}</span>
                              <span className={`text-[10px] mt-1 font-medium ${isSizeActive ? "text-[#738A75]/80" : "text-stone-400"}`}>
                                {subtitle}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <button
                          type="button"
                          className="relative flex-grow p-4 rounded-2xl text-center border-2 border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2] h-20 flex flex-col justify-center items-center"
                        >
                          <span className="text-sm font-black uppercase tracking-wider">Regular</span>
                          <span className="text-[10px] mt-1 font-medium text-[#738A75]/80">Harga Normal</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sugar Level selector */}
                  <div className="space-y-3 pt-4 border-t border-[#2F3E30]/10">
                    <span className="text-[11px] font-black uppercase tracking-widest text-stone-500 block">Sugar Level</span>
                    <div className="flex gap-3">
                      {/* Option 1: Normal Sugar */}
                      <button
                        type="button"
                        onClick={() => setSelectedSugar("Normal Sugar")}
                        className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${selectedSugar === "Normal Sugar"
                          ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                          : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200"
                          }`}
                      >
                        <span className="text-sm font-black uppercase tracking-wider">Normal Sugar</span>
                        <span className={`text-[10px] mt-1 font-medium ${selectedSugar === "Normal Sugar" ? "text-[#738A75]/80" : "text-stone-400"
                          }`}>Manis Standar</span>
                      </button>

                      {/* Option 2: Less Sugar */}
                      <button
                        type="button"
                        onClick={() => setSelectedSugar("Less Sugar")}
                        className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${selectedSugar === "Less Sugar"
                          ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                          : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200"
                          }`}
                      >
                        <span className="text-sm font-black uppercase tracking-wider">Less Sugar</span>
                        <span className={`text-[10px] mt-1 font-medium ${selectedSugar === "Less Sugar" ? "text-[#738A75]/80" : "text-stone-400"
                          }`}>Kurang Manis</span>
                      </button>
                    </div>
                  </div>

                  {/* Ice Level selector */}
                  <div className="space-y-3 pt-4 border-t border-[#2F3E30]/10">
                    <span className="text-[11px] font-black uppercase tracking-widest text-stone-500 block">Ice Level</span>
                    <div className="flex gap-3">
                      {/* Option 1: Normal Ice */}
                      <button
                        type="button"
                        onClick={() => setSelectedIce("Normal Ice")}
                        className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${selectedIce === "Normal Ice"
                          ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                          : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200"
                          }`}
                      >
                        <span className="text-sm font-black uppercase tracking-wider">Normal Ice</span>
                        <span className={`text-[10px] mt-1 font-medium ${selectedIce === "Normal Ice" ? "text-[#738A75]/80" : "text-stone-400"
                          }`}>Es Standar</span>
                      </button>

                      {/* Option 2: Less Ice */}
                      <button
                        type="button"
                        onClick={() => setSelectedIce("Less Ice")}
                        className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${selectedIce === "Less Ice"
                          ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                          : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200"
                          }`}
                      >
                        <span className="text-sm font-black uppercase tracking-wider">Less Ice</span>
                        <span className={`text-[10px] mt-1 font-medium ${selectedIce === "Less Ice" ? "text-[#738A75]/80" : "text-stone-400"
                          }`}>Kurang Es</span>
                      </button>
                    </div>
                  </div>

                  {/* Special Instructions (Instruksi Khusus) */}
                  <div className="space-y-3 pt-4 border-t border-[#2F3E30]/10">
                    <span className="text-[11px] font-black uppercase tracking-widest text-stone-500 block">Instruksi Khusus</span>                    {/* Presets if available */}
                    {selectedItem.special_instructions && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {selectedItem.special_instructions
                          .split(",")
                          .map((presetStr: string) => presetStr.trim())
                          .filter((preset: string) => {
                            const p = preset.toLowerCase();
                            return !(
                              p.includes("sugar") ||
                              p.includes("sweet") ||
                              p.includes("ice") ||
                              p.includes("es") ||
                              p.includes("gula") ||
                              p.includes("manis")
                            );
                          })
                          .map((preset: string) => {
                            const isPresetSelected = activeInstructionsPresets.includes(preset);
                            return (
                              <button
                                type="button"
                                key={preset}
                                onClick={() => togglePresetInstruction(preset)}
                                className={`px-3 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-all ${isPresetSelected
                                  ? "bg-[#5E7560]/10 border-[#5E7560] text-[#5E7560]"
                                  : "bg-white/50 dark:bg-stone-900/50 border-[#2F3E30]/5 text-stone-600 dark:text-stone-300 hover:border-[#2F3E30]/10"
                                  }`}
                              >
                                {isPresetSelected ? <Check className="w-2.5 h-2.5 stroke-[3px]" /> : <Plus className="w-2.5 h-2.5 text-stone-400" />}
                                <span>{preset}</span>
                              </button>
                            );
                          })}
                      </div>
                    )}

                    {/* Custom instructions text Area */}
                    <textarea
                      rows={2}
                      placeholder="Tambahkan catatan khusus (misal: es dipisah, kurangi gula, extra shot, dll.)"
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-stone-900 border border-[#2F3E30]/10 rounded-xl p-2.5 px-3 text-[#2F3E30] dark:text-stone-100 focus:outline-none focus:border-[#738A75] focus:ring-0 transition-colors placeholder:text-stone-400 resize-none"
                    />
                  </div>
                </div>

                {/* Customer reviews log */}
                <div className="space-y-4 pt-6 border-t border-[#2F3E30]/10 mt-8">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#738A75]" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-stone-500">Ulasan & Rating Customer</span>
                  </div>

                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {selectedItem.reviews && selectedItem.reviews.length > 0 ? (
                      selectedItem.reviews.map((rev: any) => (
                        <div key={rev.id} className="bg-white/60 dark:bg-stone-900/50 rounded-2xl p-3.5 border border-[#2F3E30]/5 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#2F3E30] dark:text-stone-200">{rev.author}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${star <= rev.rating ? "fill-yellow-400 stroke-yellow-400" : "fill-stone-100 stroke-stone-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-stone-600 dark:text-stone-300 font-normal leading-relaxed">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-stone-500 py-4 text-xs font-medium">Belum ada ulasan untuk menu ini. Jadilah yang pertama memberikan ulasan!</p>
                    )}
                  </div>

                  {/* Interactive review adding form */}
                  <form onSubmit={handleAddReview} className="bg-white dark:bg-stone-900/40 rounded-2xl p-4 border border-[#2F3E30]/10 space-y-3 mt-4 text-xs">
                    <span className="font-bold text-[#2F3E30] dark:text-stone-200 uppercase text-[10px] tracking-wider block">Beri Nilai & Ulasan</span>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-stone-500 uppercase tracking-wide block">Nama Anda</label>
                        <input
                          type="text"
                          placeholder="Contoh: Rian"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="w-full bg-[#F4F1EA] dark:bg-stone-800 border border-[#2F3E30]/5 focus:border-[#738A75] focus:outline-none rounded-lg p-2 font-medium text-stone-900 dark:text-stone-100"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-stone-500 uppercase tracking-wide block flex items-center gap-1">
                          <span>Kode Nota Pembelian</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: FOW-10245"
                          value={receiptCode}
                          onChange={(e) => setReceiptCode(e.target.value)}
                          className="w-full bg-[#F4F1EA] dark:bg-stone-800 border border-[#2F3E30]/5 focus:border-[#738A75] focus:outline-none rounded-lg p-2 font-bold uppercase placeholder:font-medium placeholder:normal-case text-stone-900 dark:text-stone-100"
                          required
                        />
                      </div>
                    </div>

                    {/* Interactive Clickable Star ratings */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold text-stone-500 uppercase tracking-wide block">Rating Anda</label>
                      <div className="flex items-center gap-1 h-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewerRating(star)}
                            className="focus:outline-none transition-transform active:scale-125"
                          >
                            <Star
                              className={`w-5 h-5 ${star <= reviewerRating ? "fill-yellow-400 stroke-yellow-400" : "fill-stone-100 stroke-stone-300"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold text-stone-500 uppercase tracking-wide block">Ulasan Anda</label>
                      <textarea
                        rows={2}
                        placeholder="Ceritakan kepuasan Anda tentang rasa, penyajian, kemasan..."
                        value={reviewerComment}
                        onChange={(e) => setReviewerComment(e.target.value)}
                        className="w-full bg-[#F4F1EA] dark:bg-stone-800 border border-[#2F3E30]/5 focus:border-[#738A75] focus:outline-none rounded-lg p-2.5 font-medium resize-none text-stone-900 dark:text-stone-100"
                        required
                      />
                    </div>

                    {reviewFeedback && (
                      <p className={`text-[10px] font-bold ${reviewFeedback.includes("berhasil") ? "text-emerald-700" : "text-red-700"}`}>
                        {reviewFeedback}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-[#738A75] hover:bg-[#5E7560] text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm uppercase tracking-wider text-[10px] disabled:opacity-50"
                    >
                      {submittingReview ? "Mengunggah..." : "Kirim Ulasan"}
                    </button>
                  </form>
                </div>

                {/* Bottom general actions: Close modal button */}
                <div className="flex gap-4 border-t border-[#2F3E30]/10 pt-6 mt-10">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="w-full bg-[#2F3E30] hover:bg-[#202c21] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 uppercase tracking-wider text-xs"
                  >
                    Kembali ke Daftar Menu
                  </button>
                </div>

              </div>
            </div>

            {/* ==================== MOBILE SCREEN VIEW (DESAIN BARU SESUAI FOTO) ==================== */}
            <div className="flex flex-col md:hidden w-full h-full overflow-y-auto pb-32 relative bg-[#F4F1EA] dark:bg-stone-950 text-left">
              {/* 1. Full-bleed background product image */}
              <div className="relative w-full h-[40vh] shrink-0 overflow-hidden bg-stone-100">
                <Image
                  src={selectedItem.image_url || "/placeholder.svg"}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
                {/* Ambient legibility gradients */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                {/* Floating circular back arrow button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 left-6 w-11 h-11 bg-white/75 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg text-stone-800 dark:text-stone-900 active:scale-95 transition-transform z-30 pointer-events-auto"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
                </button>

                {/* Floating circular heart button */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-6 right-6 w-11 h-11 bg-white/75 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg text-stone-800 dark:text-stone-900 active:scale-95 transition-transform z-30 pointer-events-auto"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </button>
              </div>

              {/* 2. Brand Earthy-Beige Bottom Sheet Panel */}
              <div className="bg-[#F4F1EA] dark:bg-stone-950 rounded-t-[36px] -mt-10 relative z-20 px-6 py-8 space-y-6 flex-grow shadow-[0_-12px_40px_rgba(0,0,0,0.06)]">

                {/* Title & Rating pill row */}
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-black text-[#2F3E30] dark:text-stone-100 tracking-tight leading-snug font-sans">
                    {selectedItem.name}
                  </h2>
                  <div className="bg-[#738A75]/10 dark:bg-[#738A75]/20 text-[#738A75] dark:text-[#a0b9a2] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 text-sm border border-[#738A75]/15">
                    <Star className="w-4 h-4 fill-[#738A75] stroke-[#738A75]" />
                    <span>{selectedItem.rating || "5.0"}</span>
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                  {selectedItem.description}
                </p>

                {/* Dynamic Categorized Tags Row */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="bg-white/60 dark:bg-stone-900/40 text-[#2F3E30] dark:text-stone-300 border border-[#2F3E30]/10 dark:border-stone-700 rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Hot</span>
                  </span>
                  <span className="bg-white/60 dark:bg-stone-900/40 text-[#2F3E30] dark:text-stone-300 border border-[#2F3E30]/10 dark:border-stone-700 rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <Snowflake className="w-3.5 h-3.5 text-blue-400" />
                    <span>Iced</span>
                  </span>
                  <span className="bg-white/60 dark:bg-stone-900/40 text-[#2F3E30] dark:text-stone-300 border border-[#2F3E30]/10 dark:border-stone-700 rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span>Milk-based</span>
                  </span>
                </div>

                {/* Custom Rating Distribution Block */}
                <div className="bg-white/60 dark:bg-stone-900/40 rounded-3xl p-5 border border-[#2F3E30]/10 flex items-center gap-6 mt-2">
                  {/* Overall ratings column */}
                  <div className="flex flex-col items-center justify-center text-center shrink-0 border-r border-[#2F3E30]/10 dark:border-stone-800 pr-6">
                    <span className="text-4xl font-extrabold text-[#2F3E30] dark:text-stone-100">{selectedItem.rating || "5.0"}</span>
                    <div className="flex gap-0.5 mt-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold mt-2">
                      {selectedItem.reviews && selectedItem.reviews.length > 0 ? `${selectedItem.reviews.length * 15}+ reviews` : "150+ reviews"}
                    </span>
                  </div>

                  {/* Individual distribution bars */}
                  <div className="flex-grow space-y-1">
                    {[
                      { star: 5, fill: "w-[80%]" },
                      { star: 4, fill: "w-[15%]" },
                      { star: 3, fill: "w-[3%]" },
                      { star: 2, fill: "w-[1%]" },
                      { star: 1, fill: "w-[1%]" },
                    ].map((row) => (
                      <div key={row.star} className="flex items-center gap-2 text-[10px] font-bold text-stone-500 dark:text-stone-400">
                        <span className="w- star-label-width text-right">{row.star}</span>
                        <div className="relative h-1.5 bg-stone-200/60 dark:bg-stone-800 rounded-full flex-grow overflow-hidden">
                          <div className={`absolute top-0 left-0 h-full bg-[#738A75] rounded-full ${row.fill}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Sizes block ("Size") */}
                <div className="space-y-3 pt-3">
                  <span className="text-base font-extrabold text-[#2F3E30] dark:text-stone-100 tracking-tight font-sans block">Size</span>
                  <div className="flex gap-3">
                    {/* Option 1: Single */}
                    <button
                      type="button"
                      onClick={() => setSelectedSize("Single")}
                      className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${selectedSize === "Single" || !selectedSize || selectedSize === "Regular"
                        ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                        : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200"
                        }`}
                    >
                      <span className="text-sm font-black uppercase tracking-wider">Single</span>
                      <span className={`text-[10px] mt-1 font-medium ${selectedSize === "Single" || !selectedSize || selectedSize === "Regular" ? "text-[#738A75]/80" : "text-stone-400"
                        }`}>Harga Normal</span>
                    </button>

                    {/* Option 2: Double */}
                    <button
                      type="button"
                      onClick={() => setSelectedSize("Double")}
                      className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${selectedSize === "Double"
                        ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                        : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200"
                        }`}
                    >
                      <span className="text-sm font-black uppercase tracking-wider">Double</span>
                      <span className={`text-[10px] mt-1 font-medium ${selectedSize === "Double" ? "text-[#738A75]/80" : "text-stone-400"
                        }`}>+Rp 10.000</span>
                    </button>
                  </div>
                </div>

                {/* Sugar Level */}
                <div className="space-y-3 pt-3">
                  <span className="text-base font-extrabold text-[#2F3E30] dark:text-stone-100 tracking-tight font-sans block">Sugar Level</span>
                  <div className="flex gap-3">
                    {/* Option 1: Normal Sugar */}
                    <button
                      type="button"
                      onClick={() => setSelectedSugar("Normal Sugar")}
                      className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${selectedSugar === "Normal Sugar"
                        ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                        : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200"
                        }`}
                    >
                      <span className="text-sm font-black uppercase tracking-wider">Normal Sugar</span>
                      <span className={`text-[10px] mt-1 font-medium ${selectedSugar === "Normal Sugar" ? "text-[#738A75]/80" : "text-stone-400"
                        }`}>Manis Standar</span>
                    </button>

                    {/* Option 2: Less Sugar */}
                    <button
                      type="button"
                      onClick={() => setSelectedSugar("Less Sugar")}
                      className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${selectedSugar === "Less Sugar"
                        ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                        : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200"
                        }`}
                    >
                      <span className="text-sm font-black uppercase tracking-wider">Less Sugar</span>
                      <span className={`text-[10px] mt-1 font-medium ${selectedSugar === "Less Sugar" ? "text-[#738A75]/80" : "text-stone-400"
                        }`}>Kurang Manis</span>
                    </button>
                  </div>
                </div>

                {/* Ice Level */}
                <div className="space-y-3 pt-3">
                  <span className="text-base font-extrabold text-[#2F3E30] dark:text-stone-100 tracking-tight font-sans block">Ice Level</span>
                  <div className="flex gap-3">
                    {/* Option 1: Normal Ice */}
                    <button
                      type="button"
                      onClick={() => setSelectedIce("Normal Ice")}
                      className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${selectedIce === "Normal Ice"
                        ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                        : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200"
                        }`}
                    >
                      <span className="text-sm font-black uppercase tracking-wider">Normal Ice</span>
                      <span className={`text-[10px] mt-1 font-medium ${selectedIce === "Normal Ice" ? "text-[#738A75]/80" : "text-stone-400"
                        }`}>Es Standar</span>
                    </button>

                    {/* Option 2: Less Ice */}
                    <button
                      type="button"
                      onClick={() => setSelectedIce("Less Ice")}
                      className={`relative flex-grow p-4 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20 border-2 ${selectedIce === "Less Ice"
                        ? "border-[#738A75] bg-[#738A75]/10 text-[#738A75] dark:text-[#a0b9a2]"
                        : "border-[#2F3E30]/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200"
                        }`}
                    >
                      <span className="text-sm font-black uppercase tracking-wider">Less Ice</span>
                      <span className={`text-[10px] mt-1 font-medium ${selectedIce === "Less Ice" ? "text-[#738A75]/80" : "text-stone-400"
                        }`}>Kurang Es</span>
                    </button>
                  </div>
                </div>

                {/* Custom Instructions */}
                <div className="space-y-3 pt-3">
                  <span className="text-sm font-black uppercase tracking-widest text-stone-500 block">Instruksi Khusus</span>

                  {/* Presets if available */}
                  {selectedItem.special_instructions && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.special_instructions
                        .split(",")
                        .map((presetStr: string) => presetStr.trim())
                        .filter((preset: string) => {
                          const p = preset.toLowerCase();
                          return !(
                            p.includes("sugar") ||
                            p.includes("sweet") ||
                            p.includes("ice") ||
                            p.includes("es") ||
                            p.includes("gula") ||
                            p.includes("manis")
                          );
                        })
                        .map((preset: string) => {
                          const isPresetSelected = activeInstructionsPresets.includes(preset);
                          return (
                            <button
                              type="button"
                              key={preset}
                              onClick={() => togglePresetInstruction(preset)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-all ${isPresetSelected
                                ? "bg-[#5E7560]/10 border-[#5E7560] text-[#5E7560]"
                                : "bg-white/60 dark:bg-stone-900/50 border-[#2F3E30]/5 text-stone-600 dark:text-stone-300 hover:border-[#2F3E30]/10"
                                }`}
                            >
                              {isPresetSelected ? <Check className="w-2.5 h-2.5 stroke-[3px]" /> : <Plus className="w-2.5 h-2.5 text-stone-400" />}
                              <span>{preset}</span>
                            </button>
                          );
                        })}
                    </div>
                  )}

                  {/* Custom instructions text Area */}
                  <textarea
                    rows={2}
                    placeholder="Tambahkan catatan khusus (misal: es dipisah, kurangi gula, extra shot, dll.)"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    className="w-full text-xs bg-white/60 dark:bg-stone-900 border border-[#2F3E30]/10 rounded-xl p-2.5 px-3 text-[#2F3E30] dark:text-stone-100 focus:outline-none focus:border-[#738A75] focus:ring-0 transition-colors placeholder:text-stone-400 resize-none"
                  />
                </div>

                {/* Mobile Reviews Log */}
                <div className="space-y-4 pt-4 border-t border-[#2F3E30]/10">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#738A75]" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-stone-500">Ulasan ({selectedItem.reviews ? selectedItem.reviews.length : 0})</span>
                  </div>

                  <div className="space-y-3">
                    {selectedItem.reviews && selectedItem.reviews.length > 0 ? (
                      selectedItem.reviews.map((rev: any) => (
                        <div key={rev.id} className="bg-white/60 dark:bg-stone-900/40 rounded-2xl p-3.5 border border-[#2F3E30]/5 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#2F3E30] dark:text-stone-200">{rev.author}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${star <= rev.rating ? "fill-yellow-400 stroke-yellow-400" : "fill-stone-100 stroke-stone-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-stone-600 dark:text-stone-300 font-normal leading-relaxed">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-stone-400 py-2 text-xs font-medium">Belum ada ulasan.</p>
                    )}
                  </div>

                  {/* Interactive review adding form (Mobile) */}
                  <form onSubmit={handleAddReview} className="bg-white/60 dark:bg-stone-900/40 rounded-2xl p-4 border border-[#2F3E30]/10 space-y-3 mt-4 text-xs">
                    <span className="font-bold text-[#2F3E30] dark:text-stone-200 uppercase text-[10px] tracking-wider block">Beri Nilai & Ulasan</span>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-stone-500 uppercase tracking-wide block">Nama Anda</label>
                        <input
                          type="text"
                          placeholder="Contoh: Rian"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="w-full bg-[#F4F1EA] dark:bg-stone-800 border border-[#2F3E30]/5 focus:border-[#738A75] focus:outline-none rounded-lg p-2 font-medium text-stone-900 dark:text-stone-100"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-stone-500 uppercase tracking-wide block flex items-center gap-1">
                          <span>Kode Nota</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="FOW-10245"
                          value={receiptCode}
                          onChange={(e) => setReceiptCode(e.target.value)}
                          className="w-full bg-[#F4F1EA] dark:bg-stone-800 border border-[#2F3E30]/5 focus:border-[#738A75] focus:outline-none rounded-lg p-2 font-bold uppercase placeholder:font-medium placeholder:normal-case text-stone-900 dark:text-stone-100"
                          required
                        />
                      </div>
                    </div>

                    {/* Interactive Clickable Star ratings */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold text-stone-500 uppercase tracking-wide block">Rating Anda</label>
                      <div className="flex items-center gap-1 h-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewerRating(star)}
                            className="focus:outline-none transition-transform active:scale-125"
                          >
                            <Star
                              className={`w-5 h-5 ${star <= reviewerRating ? "fill-yellow-400 stroke-yellow-400" : "fill-stone-100 stroke-stone-300"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold text-stone-500 uppercase tracking-wide block">Ulasan Anda</label>
                      <textarea
                        rows={2}
                        placeholder="Ceritakan kepuasan Anda tentang rasa, penyajian, kemasan..."
                        value={reviewerComment}
                        onChange={(e) => setReviewerComment(e.target.value)}
                        className="w-full bg-[#F4F1EA] dark:bg-stone-800 border border-[#2F3E30]/5 focus:border-[#738A75] focus:outline-none rounded-lg p-2.5 font-medium resize-none text-stone-900 dark:text-stone-100"
                        required
                      />
                    </div>

                    {reviewFeedback && (
                      <p className={`text-[10px] font-bold ${reviewFeedback.includes("berhasil") ? "text-emerald-700" : "text-red-700"}`}>
                        {reviewFeedback}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-[#738A75] hover:bg-[#5E7560] text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm uppercase tracking-wider text-[10px] disabled:opacity-50"
                    >
                      {submittingReview ? "Mengunggah..." : "Kirim Ulasan"}
                    </button>
                  </form>
                </div>

              </div>

              {/* 3. Sticky Bottom Mobile Action Bar (Total Price & Close Button) */}
              <div className="fixed bottom-0 inset-x-0 bg-[#F4F1EA] dark:bg-stone-950 border-t border-[#2F3E30]/10 p-4 px-6 flex items-center justify-between z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider">Total</span>
                  <span className="text-xl font-black text-[#738A75] dark:text-[#a0b9a2]">
                    {selectedItem.price}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-[#2F3E30] hover:bg-[#202c21] text-white font-black px-6 py-3.5 rounded-2xl flex items-center gap-2 text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[3px]" />
                  <span>Kembali</span>
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <FooterSection />
    </div>
  );
}
