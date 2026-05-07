"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Key, LogOut, Coffee, Image as ImageIcon, Sliders, Layers, 
  Plus, Trash2, Edit3, Save, X, UploadCloud, CheckCircle2, 
  AlertCircle, ArrowRight, Star, ChevronRight, Info, Calendar,
  Database, RefreshCw, BarChart3, Clock, Settings, Mail, Lock
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import imageCompression from "browser-image-compression";

// Helper for default local/static records so the Admin is immediately pre-populated for a premium experience
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
    is_signature: true,
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
    is_signature: true,
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
    is_signature: false,
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
    is_signature: false,
    reviews: [
      { id: "r7", author: "Gita", rating: 5, comment: "Muffin disajikan hangat, blueberry-nya melimpah dan crumble-nya renyah." },
      { id: "r8", author: "Hadi", rating: 4, comment: "Sangat lembut bagian dalamnya, cocok banget dimakan bareng kopi hitam." }
    ]
  }
];

const DEFAULT_GALLERY_ITEMS = [
  {
    id: "foto1",
    title: "Pour-over Ritual",
    category: "Brewing",
    category_label: "Manual Brew",
    src: "/images/foto1.webp",
    description: "Seni menyeduh kopi filter secara presisi dengan metode V60 untuk mengeluarkan keasaman alami.",
    detailed_description: "Metode pour-over V60 kami menonjolkan profil rasa yang bersih dan kompleks dari biji kopi single origin pilihan. Air panas bersuhu 92°C dialirkan secara perlahan dengan gerakan sirkular konsisten.",
    specs: { "Metode": "Hario V60 Filter", "Suhu Air": "92°C", "Rasio": "1:15", "Beans": "Ethiopia Yirgacheffe" },
    rating: "4.9",
    accent_color: "#738A75"
  },
  {
    id: "foto2",
    title: "The Golden Crema",
    category: "Espresso",
    category_label: "Espresso",
    src: "/images/foto2.webp",
    description: "Ekstraksi espresso sempurna dengan warna keemasan yang tebal, menjanjikan rasa yang intens.",
    detailed_description: "Setiap shot espresso kami diekstraksi dari mesin espresso La Marzocco premium selama 25-28 detik.",
    specs: { "Mesin": "La Marzocco Linea PB", "Tekanan": "9 Bar", "Notes": "Dark Chocolate, Toffee" },
    rating: "5.0",
    accent_color: "#8c7a6b"
  }
];

const DEFAULT_TECH_SLOTS = [
  { key: "tech_left_1", label: "Technology Left Column Photo", src: "/images/foto4.webp", position: "left" },
  { key: "tech_right_1", label: "Technology Right Column Photo", src: "/images/foto5.webp", position: "right" },
  { key: "tech_center_1", label: "Center Stage: Phase 1 (Sunrise)", src: "/images/hero1.webp", position: "center" },
  { key: "tech_center_2", label: "Center Stage: Phase 2 (Daylight)", src: "/images/hero2.webp", position: "center" },
  { key: "tech_center_3", label: "Center Stage: Phase 3 (Dusk)", src: "/images/hero3.webp", position: "center" },
  { key: "tech_center_4", label: "Center Stage: Phase 4 (Night)", src: "/images/foto21.webp", position: "center" }
];

const DEFAULT_FEATURED_PRODUCTS = [
  { key: "slide_1", src: "/images/foto8.webp", sort_order: 1 },
  { key: "slide_2", src: "/images/foto2.webp", sort_order: 2 },
  { key: "slide_3", src: "/images/foto3.webp", sort_order: 3 },
  { key: "slide_4", src: "/images/foto4.webp", sort_order: 4 },
  { key: "slide_5", src: "/images/foto5.webp", sort_order: 5 }
];

const DEFAULT_HOMEPAGE_CARDS = [
  { key: "card_1", title: "Sunrise Vista", description: "Modern architecture glowing under the warm morning sun", tag: "architecture", image_url: "/images/foto21.jpeg", sort_order: 1 },
  { key: "card_2", title: "Daylight Clarity", description: "Crisp lines and sustainable design captured in bright daylight", tag: "architecture", image_url: "/images/foto22.jpeg", sort_order: 2 },
  { key: "card_3", title: "Dusk Harmony", description: "A perfect blend of evening hues and premium modern spaces", tag: "architecture", image_url: "/images/foto23.webp", sort_order: 3 },
  { key: "card_4", title: "Night Radiance", description: "Illuminating the dark with warm energy-efficient lighting", tag: "architecture", image_url: "/images/foto24.webp", sort_order: 4 }
];

const DEFAULT_RESERVATIONS = [
  {
    id: "res1",
    name: "Gio Vernando",
    email: "gio@example.com",
    phone: "+62 812-3456-7890",
    date: "2026-05-10",
    time: "14:00 WIB",
    guests: 4,
    notes: "Minta meja dekat jendela kaca besar yang banyak tanaman hijau.",
    status: "approved",
    created_at: new Date().toISOString()
  },
  {
    id: "res2",
    name: "Dina Mariana",
    email: "dina@example.com",
    phone: "+62 819-8765-4321",
    date: "2026-05-12",
    time: "19:00 WIB",
    guests: 2,
    notes: "Acara perayaan hari jadian. Sangat senang jika bisa disiapkan lilin.",
    status: "pending",
    created_at: new Date().toISOString()
  },
  {
    id: "res3",
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "+62 857-1122-3344",
    date: "2026-05-09",
    time: "10:00 WIB",
    guests: 6,
    notes: "Pertemuan bisnis kecil, tolong sediakan colokan listrik di sudut tenang.",
    status: "rejected",
    created_at: new Date().toISOString()
  }
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "offline">("checking");
  const [activeTab, setActiveTab] = useState<"overview" | "menu" | "gallery" | "sections" | "countdown" | "reservations">("overview");
  
  // Data States
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [techSlots, setTechSlots] = useState<any[]>(DEFAULT_TECH_SLOTS);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [homepageCards, setHomepageCards] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);

  // Countdown Config states
  const [countdownTitle, setCountdownTitle] = useState("Festival Kopi Spesial");
  const [countdownDate, setCountdownDate] = useState("2026-06-30T10:00");
  const [countdownActive, setCountdownActive] = useState(true);

  // Modals & UI States
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [currentMenuEdit, setCurrentMenuEdit] = useState<any | null>(null);
  const [defaultIsSignature, setDefaultIsSignature] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentGalleryEdit, setCurrentGalleryEdit] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Check login, DB configuration, and local configs on mount
  useEffect(() => {
    const checkAuthAndConfig = async () => {
      // 1. Check countdown config
      const localTitle = localStorage.getItem("fow_countdown_title");
      const localDate = localStorage.getItem("fow_countdown_date");
      const localActive = localStorage.getItem("fow_countdown_active");
      if (localTitle) setCountdownTitle(localTitle);
      if (localDate) setCountdownDate(localDate);
      if (localActive) setCountdownActive(localActive === "true");

      // 2. Check Database config and connection
      if (!isSupabaseConfigured() || !supabase) {
        setDbStatus("offline");
        setMenuItems(DEFAULT_MENU_ITEMS);
        setGalleryItems(DEFAULT_GALLERY_ITEMS);
        setFeaturedProducts(DEFAULT_FEATURED_PRODUCTS);
        setHomepageCards(DEFAULT_HOMEPAGE_CARDS);

        // Load local reservations
        const localRes = localStorage.getItem("coffee_local_reservations");
        if (localRes) {
          setReservations(JSON.parse(localRes));
        } else {
          setReservations(DEFAULT_RESERVATIONS);
        }

        // Offline Auth fallback
        const auth = localStorage.getItem("coffee_admin_auth");
        if (auth === "true") {
          setIsAuthenticated(true);
        }
        return;
      }

      try {
        setDbStatus("checking");
        // Test query on menu_items
        const { error } = await supabase.from("menu_items").select("id").limit(1);
        if (error) throw error;
        
        setDbStatus("connected");
        loadAllData();

        // Online Auth check: check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
        } else {
          const auth = localStorage.getItem("coffee_admin_auth");
          if (auth === "true") {
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error("Database check failed:", err);
        setDbStatus("offline");
        setMenuItems(DEFAULT_MENU_ITEMS);
        setGalleryItems(DEFAULT_GALLERY_ITEMS);
        setFeaturedProducts(DEFAULT_FEATURED_PRODUCTS);
        setHomepageCards(DEFAULT_HOMEPAGE_CARDS);

        // Load local reservations fallback
        const localRes = localStorage.getItem("coffee_local_reservations");
        if (localRes) {
          setReservations(JSON.parse(localRes));
        } else {
          setReservations(DEFAULT_RESERVATIONS);
        }

        const auth = localStorage.getItem("coffee_admin_auth");
        if (auth === "true") {
          setIsAuthenticated(true);
        }
      }
    };

    checkAuthAndConfig();
  }, [isAuthenticated]);

  // Alert dismiss helper
  const showFeedback = (type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Main data loader
  const loadAllData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      // 1. Fetch Menu Items
      const { data: menu, error: menuErr } = await supabase
        .from("menu_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!menuErr && menu) setMenuItems(menu);

      // 2. Fetch Gallery Items
      const { data: gallery, error: galErr } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!galErr && gallery) setGalleryItems(gallery);

      // 3. Fetch Section Images
      const { data: secImg, error: secErr } = await supabase
        .from("section_images")
        .select("*");
      
      if (!secErr && secImg) {
        // Map technology images
        const mappedTech = DEFAULT_TECH_SLOTS.map((slot) => {
          const matched = secImg.find((item) => item.section === "technology" && item.key === slot.key);
          return matched ? { ...slot, src: matched.image_url } : slot;
        });
        setTechSlots(mappedTech);

        // Map featured products images
        const mappedFeatured = secImg
          .filter((item) => item.section === "featured_products")
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        setFeaturedProducts(mappedFeatured.length > 0 ? mappedFeatured : DEFAULT_FEATURED_PRODUCTS);

        // Map homepage parallax cards
        const mappedCards = DEFAULT_HOMEPAGE_CARDS.map((card) => {
          const matched = secImg.find((item) => item.section === "homepage_gallery" && item.key === card.key);
          return matched ? { 
            ...card, 
            title: matched.title || card.title,
            description: matched.description || card.description,
            tag: matched.tag || card.tag,
            image_url: matched.image_url 
          } : card;
        });
        setHomepageCards(mappedCards);
      }

      // 4. Fetch Reservations
      const { data: resData, error: resErr } = await supabase
        .from("reservations")
        .select("*")
        .order("date", { ascending: true })
        .order("time", { ascending: true });
      
      if (!resErr && resData) {
        setReservations(resData);
      } else {
        console.warn("Reservations fetch error:", resErr);
        const localRes = localStorage.getItem("coffee_local_reservations");
        setReservations(localRes ? JSON.parse(localRes) : DEFAULT_RESERVATIONS);
      }

    } catch (err) {
      console.error("Failed loading data from Supabase:", err);
      showFeedback("error", "gagal sinkronisasi data dengan database.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Login Gate Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!email || !password) {
      setLoginError("Mohon masukkan email dan password.");
      return;
    }

    if (!isSupabaseConfigured() || !supabase) {
      // Fallback Demo Mode login check
      const mockEmail = "admin@fowcoffee.com";
      const mockPassword = "admin123";
      if (email === mockEmail && password === mockPassword) {
        localStorage.setItem("coffee_admin_auth", "true");
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError("Demo Mode: gunakan email admin@fowcoffee.com dan password admin123");
      }
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.session) {
        localStorage.setItem("coffee_admin_auth", "true");
        setIsAuthenticated(true);
        setLoginError("");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setLoginError(err.message || "Gagal masuk. Silakan periksa kembali email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    localStorage.removeItem("coffee_admin_auth");
    setIsAuthenticated(false);
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Error signing out:", err);
      }
    }
  };

  // Save Countdown Configuration
  const handleSaveCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("fow_countdown_title", countdownTitle);
    localStorage.setItem("fow_countdown_date", countdownDate);
    localStorage.setItem("fow_countdown_active", String(countdownActive));
    showFeedback("success", "Pengaturan countdown berhasil disimpan!");
  };

  // Safe client-side file upload directly to public Supabase Storage bucket
  const handleFileUpload = async (file: File, uploadKey: string): Promise<string | null> => {
    if (!supabase) {
      showFeedback("error", "Supabase belum dihubungkan. Unggah foto tidak dapat diselesaikan.");
      return null;
    }

    try {
      setUploadProgress(prev => ({ ...prev, [uploadKey]: 5 }));
      
      let fileToUpload = file;
      
      // Perform client-side browser image compression before uploading
      if (file.type.startsWith("image/")) {
        try {
          const compressionOptions = {
            maxSizeMB: 0.8, // Compress to max 800KB
            maxWidthOrHeight: 1200, // Max dimension
            useWebWorker: true,
          };
          console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
          fileToUpload = (await imageCompression(file, compressionOptions)) as any;
          console.log(`Compressed file size: ${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB`);
        } catch (compErr) {
          console.error("Browser image compression failed, using original file:", compErr);
        }
      }

      const fileExt = fileToUpload.name ? fileToUpload.name.split(".").pop() : "webp";
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setUploadProgress(prev => ({ ...prev, [uploadKey]: 25 }));
      const { error: uploadError } = await supabase.storage
        .from("coffee-assets")
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      setUploadProgress(prev => ({ ...prev, [uploadKey]: 80 }));
      const { data: { publicUrl } } = supabase.storage
        .from("coffee-assets")
        .getPublicUrl(filePath);

      setUploadProgress(prev => ({ ...prev, [uploadKey]: 100 }));
      setTimeout(() => {
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[uploadKey];
          return updated;
        });
      }, 1000);

      return publicUrl;
    } catch (err: any) {
      console.error("Error uploading file:", err);
      showFeedback("error", `gagal mengunggah foto: ${err.message}`);
      setUploadProgress(prev => {
        const updated = { ...prev };
        delete updated[uploadKey];
        return updated;
      });
      return null;
    }
  };

  // Create or Update Menu Item
  const handleMenuSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const sort_order = parseInt(formData.get("sort_order") as string || "0");
    const imageFile = formData.get("image_file") as File;
    const category = formData.get("category") as string || "Coffee";
    const sizes = formData.get("sizes") as string || "Regular, Large";
    const special_instructions = formData.get("special_instructions") as string || "";
    const rating = parseFloat(formData.get("rating") as string || "5.0");
    const is_signature = formData.get("is_signature") === "on";

    if (!name || !price || !description) {
      showFeedback("error", "mohon lengkapi nama, harga, dan deskripsi.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = currentMenuEdit?.image_url || "/placeholder.svg";

      if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await handleFileUpload(imageFile, "menu_form");
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      if (dbStatus !== "connected" || !supabase) {
        // Local Demo Mode
        const localItem = {
          id: currentMenuEdit?.id || String(Date.now()),
          name, description, price, sort_order, image_url: imageUrl,
          category, sizes, special_instructions, rating,
          reviews: currentMenuEdit?.reviews || [],
          is_signature
        };
        if (currentMenuEdit) {
          setMenuItems(prev => prev.map(item => item.id === currentMenuEdit.id ? localItem : item));
        } else {
          setMenuItems(prev => [...prev, localItem]);
        }
        showFeedback("success", `[Lokal] Menu berhasil disimpan!`);
        setIsMenuModalOpen(false);
        return;
      }

      const dbData = { 
        name, description, price, sort_order, image_url: imageUrl,
        category, sizes, special_instructions, rating, is_signature
      };

      if (currentMenuEdit) {
        const { error } = await supabase
          .from("menu_items")
          .update(dbData)
          .eq("id", currentMenuEdit.id);
        if (error) throw error;
        showFeedback("success", "menu berhasil diperbarui.");
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert([dbData]);
        if (error) throw error;
        showFeedback("success", "menu baru berhasil ditambahkan.");
      }

      loadAllData();
      setIsMenuModalOpen(false);
    } catch (err: any) {
      console.error(err);
      showFeedback("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Menu Item
  const handleDeleteMenu = async (id: string) => {
    if (!confirm("apakah Anda yakin ingin menghapus menu ini?")) return;
    setLoading(true);
    try {
      if (dbStatus !== "connected" || !supabase) {
        setMenuItems(prev => prev.filter(item => item.id !== id));
        showFeedback("success", "[Lokal] Menu dihapus.");
        return;
      }
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
      showFeedback("success", "menu berhasil dihapus.");
      loadAllData();
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create or Update Gallery Item
  const handleGallerySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const category_label = formData.get("category_label") as string;
    const description = formData.get("description") as string;
    const detailed_description = formData.get("detailed_description") as string;
    const rating = formData.get("rating") as string;
    const accent_color = formData.get("accent_color") as string;
    const sort_order = parseInt(formData.get("sort_order") as string || "0");
    const imageFile = formData.get("image_file") as File;

    // Retrieve specs from dynamically generated key-values
    const specKeys = formData.getAll("spec_key") as string[];
    const specValues = formData.getAll("spec_value") as string[];
    const specs: Record<string, string> = {};
    specKeys.forEach((key, idx) => {
      if (key.trim()) specs[key.trim()] = specValues[idx] || "";
    });

    if (!title || !category || !category_label) {
      showFeedback("error", "mohon lengkapi judul, kategori, dan label.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = currentGalleryEdit?.src || "/placeholder.svg";

      if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await handleFileUpload(imageFile, "gallery_form");
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      if (dbStatus !== "connected" || !supabase) {
        const localItem = {
          id: currentGalleryEdit?.id || `foto_${Date.now()}`,
          title, category, category_label, description, detailed_description,
          rating, accent_color, sort_order, src: imageUrl, specs
        };
        if (currentGalleryEdit) {
          setGalleryItems(prev => prev.map(item => item.id === currentGalleryEdit.id ? localItem : item));
        } else {
          setGalleryItems(prev => [...prev, localItem]);
        }
        showFeedback("success", "[Lokal] Foto galeri berhasil disimpan!");
        setIsGalleryModalOpen(false);
        return;
      }

      const dbData = {
        id: currentGalleryEdit?.id || `foto_${Math.random().toString(36).substring(2, 7)}`,
        title, category, category_label, description, detailed_description,
        rating, accent_color, sort_order, src: imageUrl, specs
      };

      if (currentGalleryEdit) {
        const { error } = await supabase
          .from("gallery_items")
          .update(dbData)
          .eq("id", currentGalleryEdit.id);
        if (error) throw error;
        showFeedback("success", "item galeri berhasil diperbarui.");
      } else {
        const { error } = await supabase
          .from("gallery_items")
          .insert([dbData]);
        if (error) throw error;
        showFeedback("success", "item galeri baru berhasil ditambahkan.");
      }

      loadAllData();
      setIsGalleryModalOpen(false);
    } catch (err: any) {
      console.error(err);
      showFeedback("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Gallery Item
  const handleDeleteGallery = async (id: string) => {
    if (!confirm("apakah Anda yakin ingin menghapus item galeri ini?")) return;
    setLoading(true);
    try {
      if (dbStatus !== "connected" || !supabase) {
        setGalleryItems(prev => prev.filter(item => item.id !== id));
        showFeedback("success", "[Lokal] Item galeri dihapus.");
        return;
      }
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
      showFeedback("success", "item galeri berhasil dihapus.");
      loadAllData();
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Reservation Actions: Approved / Rejected / Reverted to Pending
  const handleReservationStatus = async (id: string, newStatus: "approved" | "rejected" | "pending") => {
    setLoading(true);
    try {
      if (dbStatus !== "connected" || !supabase) {
        // Local Storage Mock
        const updated = reservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
        setReservations(updated);
        localStorage.setItem("coffee_local_reservations", JSON.stringify(updated));
        showFeedback("success", `[Lokal] Status reservasi diperbarui menjadi ${newStatus}.`);
        return;
      }

      const { error } = await supabase
        .from("reservations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      showFeedback("success", `Status reservasi berhasil diubah menjadi ${newStatus}.`);
      loadAllData();
    } catch (err: any) {
      console.error("Failed to update reservation status:", err);
      showFeedback("error", err.message || "Gagal mengubah status reservasi.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Reservation
  const handleDeleteReservation = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data reservasi ini secara permanen?")) return;
    setLoading(true);
    try {
      if (dbStatus !== "connected" || !supabase) {
        // Local Storage Mock
        const updated = reservations.filter(r => r.id !== id);
        setReservations(updated);
        localStorage.setItem("coffee_local_reservations", JSON.stringify(updated));
        showFeedback("success", "[Lokal] Data reservasi berhasil dihapus.");
        return;
      }

      const { error } = await supabase
        .from("reservations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      showFeedback("success", "Data reservasi berhasil dihapus.");
      loadAllData();
    } catch (err: any) {
      console.error("Failed to delete reservation:", err);
      showFeedback("error", err.message || "Gagal menghapus data reservasi.");
    } finally {
      setLoading(false);
    }
  };

  // Section Media Upload Helper (Technology side, slider images, homepage cards)
  const handleSectionImageChange = async (e: React.ChangeEvent<HTMLInputElement>, section: string, key: string, sort_order?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const publicUrl = await handleFileUpload(file, key);
      if (!publicUrl) return;

      if (dbStatus !== "connected" || !supabase) {
        // Update states locally
        if (section === "technology") {
          setTechSlots(prev => prev.map(slot => slot.key === key ? { ...slot, src: publicUrl } : slot));
        } else if (section === "featured_products") {
          setFeaturedProducts(prev => prev.map(slide => slide.key === key ? { ...slide, src: publicUrl } : slide));
        } else if (section === "homepage_gallery") {
          setHomepageCards(prev => prev.map(card => card.key === key ? { ...card, image_url: publicUrl } : card));
        }
        showFeedback("success", `[Lokal] Foto di section ${section} berhasil diganti.`);
        return;
      }

      // 1. Check if row exists in section_images
      const { data: existing } = await supabase
        .from("section_images")
        .select("id")
        .eq("section", section)
        .eq("key", key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("section_images")
          .update({ image_url: publicUrl, updated_at: new Date() })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("section_images")
          .insert([{
            section,
            key,
            image_url: publicUrl,
            sort_order: sort_order || 0
          }]);
        if (error) throw error;
      }

      showFeedback("success", `foto section ${section} berhasil disimpan.`);
      loadAllData();
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add Dynamic Featured Product Slider Image
  const handleAddSliderImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const uploadKey = `slide_${Date.now()}`;
      const publicUrl = await handleFileUpload(file, uploadKey);
      if (!publicUrl) return;

      const newOrder = featuredProducts.length + 1;

      if (dbStatus !== "connected" || !supabase) {
        setFeaturedProducts(prev => [...prev, { key: uploadKey, src: publicUrl, sort_order: newOrder }]);
        showFeedback("success", "[Lokal] Foto ditambahkan ke Featured Products.");
        return;
      }

      const { error } = await supabase
        .from("section_images")
        .insert([{
          section: "featured_products",
          key: uploadKey,
          image_url: publicUrl,
          sort_order: newOrder
        }]);

      if (error) throw error;
      showFeedback("success", "foto berhasil ditambahkan ke slider.");
      loadAllData();
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Featured Product Slider Image
  const handleDeleteSliderImage = async (key: string) => {
    if (featuredProducts.length <= 1) {
      showFeedback("error", "slider minimal harus menyisakan 1 foto.");
      return;
    }
    if (!confirm("hapus foto ini dari slider?")) return;

    setLoading(true);
    try {
      if (dbStatus !== "connected" || !supabase) {
        setFeaturedProducts(prev => prev.filter(slide => slide.key !== key));
        showFeedback("success", "[Lokal] Slide dihapus.");
        return;
      }

      const { error } = await supabase
        .from("section_images")
        .delete()
        .eq("section", "featured_products")
        .eq("key", key);

      if (error) throw error;
      showFeedback("success", "foto dihapus dari slider.");
      loadAllData();
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update Homepage Card text parameters
  const handleCardTextSave = async (key: string, title: string, description: string, tag: string) => {
    setLoading(true);
    try {
      if (dbStatus !== "connected" || !supabase) {
        setHomepageCards(prev => prev.map(card => card.key === key ? { ...card, title, description, tag } : card));
        showFeedback("success", "[Lokal] Detail kartu diperbarui.");
        return;
      }

      const { data: existing } = await supabase
        .from("section_images")
        .select("id, image_url")
        .eq("section", "homepage_gallery")
        .eq("key", key)
        .maybeSingle();

      const imageUrl = existing?.image_url || "/images/foto21.jpeg";

      if (existing) {
        const { error } = await supabase
          .from("section_images")
          .update({ title, description, tag, updated_at: new Date() })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("section_images")
          .insert([{
            section: "homepage_gallery",
            key,
            image_url: imageUrl,
            title,
            description,
            tag
          }]);
        if (error) throw error;
      }

      showFeedback("success", "deskripsi kartu galeri berhasil disimpan.");
      loadAllData();
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render Login Gate
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-[#F1EEDC] text-black flex flex-col justify-center items-center px-4 relative grain-overlay overflow-hidden">
        
        {/* Decorative elements */}
        <div className="text-center space-y-2 select-none animate-reveal-up mb-8 z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#E7F672] text-black px-4 py-1.5 border-[3px] border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Coffee className="w-4 h-4" />
            <span className="text-[10px] uppercase font-black tracking-widest">Fow Coffee Panel</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black mt-3">Admin Dashboard</h1>
        </div>

        {/* Login card (Neo-Brutalist) */}
        <div className="bg-white p-8 rounded-none max-w-sm w-full border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-scale-in relative z-10">
          <div className="text-center mb-6">
            <div className="h-14 w-14 rounded-none bg-[#E7F672] text-black border-[3px] border-black flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Key className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Akses Terkunci</h2>
            <p className="text-xs text-stone-700 font-bold mt-1.5 uppercase tracking-wide">Masuk dengan akun admin Supabase Anda untuk membuka kontrol.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 animate-pulse" />
                <span>Alamat Email</span>
              </label>
              <input
                type="email"
                placeholder="admin@coffee.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm font-bold bg-white border-[3px] border-black rounded-none py-3 px-4 text-black focus:outline-none focus:bg-yellow-50 focus:ring-0 transition-colors"
                autoFocus
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Kata Sandi</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm font-bold bg-white border-[3px] border-black rounded-none py-3 px-4 text-black focus:outline-none focus:bg-yellow-50 focus:ring-0 transition-colors"
                required
              />
            </div>

            {loginError && (
              <div className="text-xs text-red-600 font-black uppercase tracking-wide text-center flex items-start gap-1.5 bg-red-100 border-[2px] border-black p-3 rounded-none animate-shake leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-left">{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#E7F672] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all py-3.5 px-6 rounded-none text-xs font-black uppercase tracking-wider disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>{loading ? "Memverifikasi..." : "Masuk Dashboard"}</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </button>
          </form>

          {dbStatus === "offline" && (
            <p className="text-[10px] text-center text-stone-600 font-bold uppercase tracking-wider mt-5 leading-relaxed bg-[#F1EEDC] p-2 border-[2px] border-black">
              Demo Mode: gunakan email <span className="font-mono bg-yellow-200 px-1 text-black">admin@fowcoffee.com</span> dan password <span className="font-mono bg-yellow-200 px-1 text-black">admin123</span>.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Render Core Dashboard (Layout: Static Left Sidebar & Multi-tiered Main Dashboard Content)
  return (
    <div className="min-h-screen md:h-screen bg-[#F1EEDC] text-black flex flex-col md:flex-row relative grain-overlay font-sans md:overflow-hidden">
      
      {/* Floating Alerts (Neo-Brutalist) */}
      {feedback && (
        <div className="fixed top-24 right-6 z-50 animate-reveal-right">
          <div className={`flex items-center gap-3 p-4 px-6 rounded-none border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
            feedback.type === "success" ? "bg-[#E7F672] text-black" : "bg-red-400 text-black"
          }`}>
            {feedback.type === "success" ? <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5]" /> : <AlertCircle className="w-5 h-5 text-black stroke-[2.5]" />}
            <span className="text-xs font-black uppercase tracking-wide">{feedback.msg}</span>
          </div>
        </div>
      )}

      {/* STATIC LEFT SIDEBAR (Border kanan tebal 4px hitam) */}
      <aside className="w-full md:w-80 shrink-0 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white p-6 flex flex-col justify-between z-30 md:h-full overflow-y-auto">
        <div className="space-y-8 text-left">
          {/* Logo & Cafe Branding */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-none bg-[#E7F672] text-black border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Coffee className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tighter">Fow Coffee</h1>
              <span className="text-[10px] text-stone-600 uppercase font-black tracking-widest">Admin Control Room</span>
            </div>
          </div>

          {/* Database Alert Warning when local mock mode is triggered */}
          {dbStatus === "offline" && (
            <div className="bg-orange-400 text-black border-[3px] border-black p-4 text-[10px] font-black uppercase tracking-wider leading-relaxed shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-1.5 mb-1 font-black">
                <Info className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Demo Mode Active</span>
              </div>
              <p>Perubahan hanya bersifat sementara di memori browser lokal.</p>
            </div>
          )}

          {/* Navigation Sidebar List (Menu item aktif menggunakan background neon tebal & shadow-offset) */}
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between p-3.5 px-4 rounded-none border-2 transition-all duration-150 text-xs font-black uppercase tracking-wider ${
                activeTab === "overview" 
                  ? "bg-[#E7F672] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5" 
                  : "text-stone-600 border-transparent hover:border-black hover:bg-[#F1EEDC]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 stroke-[2.5]" />
                <span>Overview Dashboard</span>
              </div>
              <ChevronRight className={`w-4 h-4 stroke-[2.5] ${activeTab === "overview" ? "translate-x-1" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("menu")}
              className={`w-full flex items-center justify-between p-3.5 px-4 rounded-none border-2 transition-all duration-150 text-xs font-black uppercase tracking-wider ${
                activeTab === "menu" 
                  ? "bg-[#FF6B8B] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5" 
                  : "text-stone-600 border-transparent hover:border-black hover:bg-[#F1EEDC]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Coffee className="w-4 h-4 stroke-[2.5]" />
                <span>Signature Menu</span>
              </div>
              <ChevronRight className={`w-4 h-4 stroke-[2.5] ${activeTab === "menu" ? "translate-x-1" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full flex items-center justify-between p-3.5 px-4 rounded-none border-2 transition-all duration-150 text-xs font-black uppercase tracking-wider ${
                activeTab === "gallery" 
                  ? "bg-[#6BE8FF] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5" 
                  : "text-stone-600 border-transparent hover:border-black hover:bg-[#F1EEDC]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 stroke-[2.5]" />
                <span>Photo Gallery</span>
              </div>
              <ChevronRight className={`w-4 h-4 stroke-[2.5] ${activeTab === "gallery" ? "translate-x-1" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("sections")}
              className={`w-full flex items-center justify-between p-3.5 px-4 rounded-none border-2 transition-all duration-150 text-xs font-black uppercase tracking-wider ${
                activeTab === "sections" 
                  ? "bg-[#B19FFB] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5" 
                  : "text-stone-600 border-transparent hover:border-black hover:bg-[#F1EEDC]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 stroke-[2.5]" />
                <span>Sections Manager</span>
              </div>
              <ChevronRight className={`w-4 h-4 stroke-[2.5] ${activeTab === "sections" ? "translate-x-1" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("countdown")}
              className={`w-full flex items-center justify-between p-3.5 px-4 rounded-none border-2 transition-all duration-150 text-xs font-black uppercase tracking-wider ${
                activeTab === "countdown" 
                  ? "bg-[#E7F672] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5" 
                  : "text-stone-600 border-transparent hover:border-black hover:bg-[#F1EEDC]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 stroke-[2.5]" />
                <span>Countdown Setup</span>
              </div>
              <ChevronRight className={`w-4 h-4 stroke-[2.5] ${activeTab === "countdown" ? "translate-x-1" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("reservations")}
              className={`w-full flex items-center justify-between p-3.5 px-4 rounded-none border-2 transition-all duration-150 text-xs font-black uppercase tracking-wider ${
                activeTab === "reservations" 
                  ? "bg-[#FFA8E2] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5" 
                  : "text-stone-600 border-transparent hover:border-black hover:bg-[#F1EEDC]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span>Reservasi Meja</span>
              </div>
              <ChevronRight className={`w-4 h-4 stroke-[2.5] ${activeTab === "reservations" ? "translate-x-1" : ""}`} />
            </button>
          </nav>
        </div>

        {/* Logout & Footer actions (Brutalist style button) */}
        <div className="mt-8 pt-6 border-t-[3px] border-black text-left">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-black bg-white border-[3px] border-black hover:bg-red-400 p-3 rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all text-xs font-black uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Log out Panel</span>
          </button>
          <div className="text-center text-[9px] text-stone-600 uppercase font-black tracking-widest mt-4">
            &copy; 2026 Fow Coffee Arch.
          </div>
        </div>
      </aside>

      {/* RIGHT CONTAINER: MAIN DASHBOARD AREA */}
      <div className="flex-grow p-6 md:p-12 space-y-8 overflow-y-auto text-left max-w-7xl md:h-full pb-24 md:pb-36">
        
        {/* TOP HEADER ROW: EXTRA-THICK uppercase tracking-tighter typography */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
              Overview Dashboard
            </h1>
            <p className="text-xs font-black uppercase tracking-wide text-stone-600 mt-1">
              Control Panel & Dynamic Database Interface for Fow Coffee Website
            </p>
          </div>

          {/* Sync indicator status bar */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-none border-[3px] border-black font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] self-start sm:self-center ${
            dbStatus === "connected" ? "bg-lime-400 text-black" : dbStatus === "checking" ? "bg-amber-400 text-black" : "bg-orange-400 text-black"
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full border border-black ${
              dbStatus === "connected" ? "bg-emerald-600 animate-pulse" : dbStatus === "checking" ? "bg-amber-600 animate-spin" : "bg-amber-700"
            }`} />
            <span>
              {dbStatus === "connected" ? "Supabase: Connected" : dbStatus === "checking" ? "Checking Status" : "Demo Mode"}
            </span>
          </div>
        </header>

        {/* 1. STAT CARDS (TOP ROW): 4 columns grid, border-4 border-black, rounded-none, hard shadow, custom pastel color backgrounds */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Signature Menus (Pastel Biru Muda) */}
          <div className="border-4 border-black rounded-none p-5 bg-[#C0EBFF] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/70">Signature Menu</span>
              <Coffee className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div className="mt-3">
              <span className="font-black text-4xl block text-black">
                {String(menuItems.length).padStart(2, "0")}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-black/60">items on page</span>
            </div>
          </div>

          {/* Card 2: Total Gallery Items (Pastel Hijau Mint) */}
          <div className="border-4 border-black rounded-none p-5 bg-[#C1F8C2] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/70">Foto Jurnal</span>
              <ImageIcon className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div className="mt-3">
              <span className="font-black text-4xl block text-black">
                {String(galleryItems.length).padStart(2, "0")}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-black/60">photos published</span>
            </div>
          </div>

          {/* Card 3: Total Reservations (Pastel Oranye) */}
          <div 
            onClick={() => setActiveTab("reservations")}
            className="border-4 border-black rounded-none p-5 bg-[#FFE1B1] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[120px] cursor-pointer hover:scale-[1.01] transition-transform duration-100"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/70">Reservasi Meja</span>
              <Calendar className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div className="mt-3">
              <span className="font-black text-4xl block text-black">
                {String(reservations.length).padStart(2, "0")}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-black/60">
                {reservations.filter((r) => r.status === "pending").length} pending / {reservations.filter((r) => r.status === "approved").length} approved
              </span>
            </div>
          </div>

          {/* Card 4: Database Sync Status (Pastel Ungu) */}
          <div className="border-4 border-black rounded-none p-5 bg-[#E8C0FF] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/70">Sync Rate</span>
              <Database className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div className="mt-3">
              <span className="font-black text-4xl block text-black">
                {dbStatus === "connected" ? "100%" : "OFF"}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-black/60">Supabase state</span>
            </div>
          </div>
        </section>

        {/* 2. MAIN ACTION CARD (TENGAH): Satu card lebar untuk pengaturan utama */}
        <section className="bg-white border-4 border-black rounded-none p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* TAB OPTION A: OVERVIEW GREETINGS & EVENT COUNTDOWN DETAILS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="border-b-[3px] border-black pb-4 text-left">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Pengaturan Countdown & Event Utama</h2>
                <p className="text-xs text-stone-600 font-bold uppercase tracking-wide mt-1">Konfigurasikan judul promosi dan timer mundur global di kedai.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Editor */}
                <form onSubmit={handleSaveCountdown} className="space-y-4 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-black block">Nama/Judul Event Promosi</label>
                    <input
                      type="text"
                      value={countdownTitle}
                      onChange={(e) => setCountdownTitle(e.target.value)}
                      className="w-full bg-white border-[3px] border-black rounded-none p-3 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                      placeholder="Contoh: Grand Reopening Coffee Fest"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-black block">Tanggal & Waktu Target (ISO Format)</label>
                    <input
                      type="datetime-local"
                      value={countdownDate}
                      onChange={(e) => setCountdownDate(e.target.value)}
                      className="w-full bg-white border-[3px] border-black rounded-none p-3 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-[#F1EEDC]/40 p-3.5 border-[3px] border-black">
                    <input
                      type="checkbox"
                      id="countdown_active"
                      checked={countdownActive}
                      onChange={(e) => setCountdownActive(e.target.checked)}
                      className="h-5 w-5 rounded-none border-[3px] border-black text-[#E7F672] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="countdown_active" className="text-xs font-black uppercase tracking-wider text-black cursor-pointer select-none">
                      Aktifkan Timer Countdown di Landing Page
                    </label>
                  </div>

                  <div className="pt-4 border-t-[2px] border-black">
                    <button
                      type="submit"
                      className="bg-[#E7F672] text-black border-[3px] border-black font-black uppercase text-xs tracking-wider py-3 px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4 stroke-[2.5]" />
                      <span>Simpan Pengaturan</span>
                    </button>
                  </div>
                </form>

                {/* Live Preview Monitor Card */}
                <div className="bg-[#FFE1B1] border-4 border-black p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                  <div className="space-y-2">
                    <div className="inline-block bg-black text-[#FFE1B1] font-black text-[9px] uppercase tracking-widest px-2.5 py-1">
                      Live Preview Monitor
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black mt-2 leading-tight">
                      {countdownTitle || "NAMA EVENT KOSONG"}
                    </h3>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="bg-white border-[3px] border-black p-3 rounded-none flex items-center justify-between text-black">
                      <span className="text-[10px] font-black uppercase tracking-wider">Target Date</span>
                      <span className="font-mono text-xs font-bold bg-[#F1EEDC] px-2 py-0.5 border border-black">{countdownDate ? countdownDate.replace("T", " ") : "Belum diatur"}</span>
                    </div>

                    <div className="bg-white border-[3px] border-black p-3 rounded-none flex items-center justify-between text-black">
                      <span className="text-[10px] font-black uppercase tracking-wider">Status Countdown</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${countdownActive ? "bg-lime-400 text-black" : "bg-red-400 text-black"}`}>
                        {countdownActive ? "AKTIF / RENDERING" : "NONAKTIF / HIDDEN"}
                      </span>
                    </div>
                  </div>

                  <p className="text-[9px] text-stone-700 font-bold uppercase mt-6 tracking-wide">
                    *Detail data timer di atas disinkronkan ke local storage browser Anda untuk simulasi yang stateful.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB OPTION B: COUNTDOWN INDEPENDENT PANEL (Same countdown form box) */}
          {activeTab === "countdown" && (
            <div className="space-y-6">
              <div className="border-b-[3px] border-black pb-4 text-left">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Pengaturan Countdown & Event Utama</h2>
                <p className="text-xs text-stone-600 font-bold uppercase tracking-wide mt-1">Konfigurasikan judul promosi dan timer mundur global di kedai.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Editor */}
                <form onSubmit={handleSaveCountdown} className="space-y-4 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-black block">Nama/Judul Event Promosi</label>
                    <input
                      type="text"
                      value={countdownTitle}
                      onChange={(e) => setCountdownTitle(e.target.value)}
                      className="w-full bg-white border-[3px] border-black rounded-none p-3 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                      placeholder="Contoh: Grand Reopening Coffee Fest"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-black block">Tanggal & Waktu Target (ISO Format)</label>
                    <input
                      type="datetime-local"
                      value={countdownDate}
                      onChange={(e) => setCountdownDate(e.target.value)}
                      className="w-full bg-white border-[3px] border-black rounded-none p-3 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-[#F1EEDC]/40 p-3.5 border-[3px] border-black">
                    <input
                      type="checkbox"
                      id="countdown_active_setup"
                      checked={countdownActive}
                      onChange={(e) => setCountdownActive(e.target.checked)}
                      className="h-5 w-5 rounded-none border-[3px] border-black text-[#E7F672] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="countdown_active_setup" className="text-xs font-black uppercase tracking-wider text-black cursor-pointer select-none">
                      Aktifkan Timer Countdown di Landing Page
                    </label>
                  </div>

                  <div className="pt-4 border-t-[2px] border-black">
                    <button
                      type="submit"
                      className="bg-[#E7F672] text-black border-[3px] border-black font-black uppercase text-xs tracking-wider py-3 px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4 stroke-[2.5]" />
                      <span>Simpan Pengaturan</span>
                    </button>
                  </div>
                </form>

                {/* Live Preview Monitor Card */}
                <div className="bg-[#FFE1B1] border-4 border-black p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                  <div className="space-y-2">
                    <div className="inline-block bg-black text-[#FFE1B1] font-black text-[9px] uppercase tracking-widest px-2.5 py-1">
                      Live Preview Monitor
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black mt-2 leading-tight">
                      {countdownTitle || "NAMA EVENT KOSONG"}
                    </h3>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="bg-white border-[3px] border-black p-3 rounded-none flex items-center justify-between text-black">
                      <span className="text-[10px] font-black uppercase tracking-wider">Target Date</span>
                      <span className="font-mono text-xs font-bold bg-[#F1EEDC] px-2 py-0.5 border border-black">{countdownDate ? countdownDate.replace("T", " ") : "Belum diatur"}</span>
                    </div>

                    <div className="bg-white border-[3px] border-black p-3 rounded-none flex items-center justify-between text-black">
                      <span className="text-[10px] font-black uppercase tracking-wider">Status Countdown</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${countdownActive ? "bg-lime-400 text-black" : "bg-red-400 text-black"}`}>
                        {countdownActive ? "AKTIF / RENDERING" : "NONAKTIF / HIDDEN"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB OPTION F: RESERVATIONS MANAGER */}
          {activeTab === "reservations" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-[3px] border-black pb-4 gap-4">
                <div className="text-left">
                  <div className="inline-block bg-black text-[#FFA8E2] font-black text-[9px] uppercase tracking-widest px-2.5 py-1 mb-1 border-2 border-black">
                    Customer Bookings
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Reservasi Meja Pelanggan</h2>
                  <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wide mt-0.5">Daftar reservasi meja harian dari pelanggan. Setujui, tolak, atau hapus data reservasi secara real-time.</p>
                </div>
              </div>

              {/* Statistics Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="border-[3px] border-black p-4 bg-amber-100 text-left">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-stone-600 block mb-1">Menunggu</span>
                  <span className="text-3xl font-black text-amber-700">{reservations.filter((r) => r.status === "pending").length}</span>
                </div>
                <div className="border-[3px] border-black p-4 bg-green-100 text-left">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-stone-600 block mb-1">Disetujui</span>
                  <span className="text-3xl font-black text-green-700">{reservations.filter((r) => r.status === "approved").length}</span>
                </div>
                <div className="border-[3px] border-black p-4 bg-red-100 text-left">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-stone-600 block mb-1">Ditolak</span>
                  <span className="text-3xl font-black text-red-700">{reservations.filter((r) => r.status === "rejected").length}</span>
                </div>
              </div>

              {/* Reservations List/Table */}
              <div className="space-y-6">
                {reservations.length === 0 ? (
                  <div className="text-center py-16 text-stone-500 font-bold uppercase border-[3px] border-dashed border-black bg-white shadow-inner">
                    Belum ada data reservasi masuk.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {reservations.map((res) => (
                      <div 
                        key={res.id}
                        className={`border-[3px] border-black rounded-none p-5 bg-white shadow-[6px_6px_0px_0px_rgba(4,4,4,1)] flex flex-col md:flex-row justify-between gap-5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                          res.status === "approved" ? "border-l-[12px] border-l-green-500" : 
                          res.status === "rejected" ? "border-l-[12px] border-l-red-500" : 
                          "border-l-[12px] border-l-amber-500"
                        }`}
                      >
                        {/* Left side: Reservation details */}
                        <div className="space-y-4 flex-grow text-left">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-black uppercase tracking-tight text-black">{res.name}</h3>
                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 border-[2px] border-black ${
                              res.status === "approved" ? "bg-green-300 text-green-900" :
                              res.status === "rejected" ? "bg-red-300 text-red-900" :
                              "bg-amber-300 text-amber-900"
                            }`}>
                              {res.status === "approved" ? "Disetujui" : res.status === "rejected" ? "Ditolak" : "Pending"}
                            </span>
                            <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2.5 py-0.5 border border-stone-200">
                              Diterima: {res.created_at ? new Date(res.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 text-xs font-bold uppercase tracking-wide text-stone-700 bg-stone-50 p-4 border-[2px] border-black">
                            <div>
                              <span className="text-[9px] text-stone-400 font-extrabold block mb-0.5">Email</span>
                              <span className="text-black break-all font-bold">{res.email}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-stone-400 font-extrabold block mb-0.5">Telepon / WA</span>
                              <span className="text-black font-bold">{res.phone}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-stone-400 font-extrabold block mb-0.5">Waktu Kunjungan</span>
                              <span className="text-black font-bold">{res.date} @ {res.time}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-stone-400 font-extrabold block mb-0.5">Kapasitas</span>
                              <span className="text-black font-bold">{res.guests} Orang / Tamu</span>
                            </div>
                          </div>

                          {res.notes && (
                            <div className="text-xs bg-yellow-50 border-[2px] border-black p-3.5 rounded-none">
                              <span className="text-[9px] text-stone-500 font-black uppercase block mb-1">Catatan Khusus Pelanggan:</span>
                              <p className="text-stone-800 leading-relaxed font-bold italic">"{res.notes}"</p>
                            </div>
                          )}
                        </div>

                        {/* Right side: Action buttons */}
                        <div className="flex flex-row md:flex-col justify-center items-stretch gap-2.5 shrink-0 min-w-[140px] border-t-[2px] md:border-t-0 md:border-l-[2px] border-black/10 pt-4 md:pt-0 md:pl-4">
                          {res.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleReservationStatus(res.id, "approved")}
                                className="flex-grow rounded-none border-[2px] border-black bg-green-400 hover:bg-green-500 text-black font-black uppercase text-[10px] py-2.5 px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
                              >
                                <span>Setujui</span>
                              </button>
                              <button
                                onClick={() => handleReservationStatus(res.id, "rejected")}
                                className="flex-grow rounded-none border-[2px] border-black bg-red-400 hover:bg-red-500 text-black font-black uppercase text-[10px] py-2.5 px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
                              >
                                <span>Tolak</span>
                              </button>
                            </>
                          )}
                          {res.status !== "pending" && (
                            <button
                              onClick={() => handleReservationStatus(res.id, "pending")}
                              className="rounded-none border-[2px] border-black bg-stone-200 hover:bg-stone-300 text-black font-black uppercase text-[10px] py-2.5 px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
                            >
                              <span>Revert Ke Pending</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReservation(res.id)}
                            className="rounded-none border-[2px] border-black bg-white text-red-600 hover:bg-red-500 hover:text-white font-black uppercase text-[10px] py-2.5 px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Hapus Permanen</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB OPTION C: MENU MANAGER */}
          {activeTab === "menu" && (
            <div className="space-y-12">
              
              {/* SUBSECTION 1: MENU SIGNATURE BERANDA */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-[3px] border-black pb-4 gap-4">
                  <div className="text-left">
                    <div className="inline-block bg-black text-[#FF6B8B] font-black text-[9px] uppercase tracking-widest px-2.5 py-1 mb-1 border-2 border-black">
                      Homepage Block
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">1. Menu Signature Beranda</h2>
                    <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wide mt-0.5">Sajian menu premium khusus yang ditampilkan di bagian "Signature Menu" Beranda.</p>
                  </div>
                  <button
                    onClick={() => {
                      setDefaultIsSignature(true);
                      setCurrentMenuEdit(null);
                      setIsMenuModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-[#E7F672] text-black border-[3px] border-black font-black uppercase text-xs tracking-wider py-2.5 px-5 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all self-start sm:self-center"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Tambah Menu Signature</span>
                  </button>
                </div>

                {/* Menu grid for signatures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {menuItems.filter((item) => item.is_signature).map((item) => (
                    <div 
                      key={item.id}
                      className="border-[3px] border-black rounded-none p-4 flex gap-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] duration-150"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-none border-[3px] border-black bg-stone-100">
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="space-y-1.5 text-left">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-black uppercase tracking-tight text-black line-clamp-1">{item.name}</h3>
                            <span className="text-xs font-black text-black bg-[#E7F672] border-[2px] border-black py-0.5 px-2 rounded-none whitespace-nowrap">{item.price}</span>
                          </div>
                          <p className="text-[10px] text-stone-600 leading-relaxed font-bold line-clamp-2">{item.description}</p>
                        </div>

                        {/* Row Actions */}
                        <div className="flex items-center justify-end gap-2 border-t-[2px] border-black pt-3 mt-3">
                          <button
                            onClick={() => {
                              setCurrentMenuEdit(item);
                              setIsMenuModalOpen(true);
                            }}
                            className="rounded-none border-[2px] border-black bg-[#F1EEDC] text-black font-black uppercase text-[10px] py-1 px-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 stroke-[2.5]" />
                            <span>Ubah</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(item.id)}
                            className="rounded-none border-[2px] border-black bg-white text-red-600 font-black uppercase text-[10px] py-1 px-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3 stroke-[2.5]" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {menuItems.filter((item) => item.is_signature).length === 0 && (
                  <div className="text-center py-16 text-stone-500 font-bold uppercase border-[3px] border-dashed border-black bg-white shadow-inner">Belum ada item menu Signature. Klik "Tambah Menu Signature" di atas.</div>
                )}
              </div>

              {/* SUBSECTION 2: DAFTAR MENU HALAMAN UTAMA */}
              <div className="space-y-6 pt-10 border-t-4 border-dashed border-black/25">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-[3px] border-black pb-4 gap-4">
                  <div className="text-left">
                    <div className="inline-block bg-black text-[#6BE8FF] font-black text-[9px] uppercase tracking-widest px-2.5 py-1 mb-1 border-2 border-black">
                      Public Dedicated Page
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">2. Daftar Menu Halaman Utama (/menu)</h2>
                    <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wide mt-0.5">Sajian menu umum kedai yang ditampilkan secara lengkap di halaman khusus `/menu`.</p>
                  </div>
                  <button
                    onClick={() => {
                      setDefaultIsSignature(false);
                      setCurrentMenuEdit(null);
                      setIsMenuModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-[#E7F672] text-black border-[3px] border-black font-black uppercase text-xs tracking-wider py-2.5 px-5 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all self-start sm:self-center"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Tambah Menu Umum</span>
                  </button>
                </div>

                {/* Menu grid for general items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {menuItems.filter((item) => !item.is_signature).map((item) => (
                    <div 
                      key={item.id}
                      className="border-[3px] border-black rounded-none p-4 flex gap-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] duration-150"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-none border-[3px] border-black bg-stone-100">
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="space-y-1.5 text-left">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-black uppercase tracking-tight text-black line-clamp-1">{item.name}</h3>
                            <span className="text-xs font-black text-black bg-[#E7F672] border-[2px] border-black py-0.5 px-2 rounded-none whitespace-nowrap">{item.price}</span>
                          </div>
                          <p className="text-[10px] text-stone-600 leading-relaxed font-bold line-clamp-2">{item.description}</p>
                        </div>

                        {/* Row Actions */}
                        <div className="flex items-center justify-end gap-2 border-t-[2px] border-black pt-3 mt-3">
                          <button
                            onClick={() => {
                              setCurrentMenuEdit(item);
                              setIsMenuModalOpen(true);
                            }}
                            className="rounded-none border-[2px] border-black bg-[#F1EEDC] text-black font-black uppercase text-[10px] py-1 px-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 stroke-[2.5]" />
                            <span>Ubah</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(item.id)}
                            className="rounded-none border-[2px] border-black bg-white text-red-600 font-black uppercase text-[10px] py-1 px-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3 stroke-[2.5]" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {menuItems.filter((item) => !item.is_signature).length === 0 && (
                  <div className="text-center py-16 text-stone-500 font-bold uppercase border-[3px] border-dashed border-black bg-white shadow-inner">Belum ada item menu Umum. Klik "Tambah Menu Umum" di atas.</div>
                )}
              </div>

            </div>
          )}

          {/* TAB OPTION D: MAIN GALLERY MANAGER */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-[3px] border-black pb-5 gap-4">
                <div className="text-left">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Photo Gallery Journal</h2>
                  <p className="text-xs text-stone-600 font-bold uppercase tracking-wide mt-1">Manajemen item visual di halaman utama jurnal /gallery.</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentGalleryEdit(null);
                    setIsGalleryModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-[#E7F672] text-black border-[3px] border-black font-black uppercase text-xs tracking-wider py-2.5 px-5 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all self-start sm:self-center"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Tambah Foto</span>
                </button>
              </div>

              {/* Gallery List Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {galleryItems.map((item) => (
                  <div 
                    key={item.id}
                    className="border-[3px] border-black rounded-none p-4 flex gap-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] duration-150"
                  >
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-none border-[3px] border-black bg-stone-100">
                      <Image
                        src={item.src || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between text-left">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-black uppercase tracking-wider text-black bg-blue-300 border-[2px] border-black py-0.5 px-2 rounded-none">{item.category_label || item.category}</span>
                          <span className="flex items-center gap-1 text-[9px] font-black text-black bg-yellow-300 border-[2px] border-black py-0.5 px-2 rounded-none">
                            <Star className="w-2.5 h-2.5 fill-black stroke-black" />
                            {item.rating || "5.0"}
                          </span>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-black line-clamp-1">{item.title}</h3>
                        <p className="text-[10px] text-stone-600 leading-relaxed font-bold line-clamp-2">{item.description}</p>
                      </div>

                      {/* Row Actions */}
                      <div className="flex items-center justify-end gap-2 border-t-[2px] border-black pt-3 mt-3">
                        <button
                          onClick={() => {
                            setCurrentGalleryEdit(item);
                            setIsGalleryModalOpen(true);
                          }}
                          className="rounded-none border-[2px] border-black bg-[#F1EEDC] text-black font-black uppercase text-[10px] py-1 px-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3 stroke-[2.5]" />
                          <span>Ubah</span>
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(item.id)}
                          className="rounded-none border-[2px] border-black bg-white text-red-600 font-black uppercase text-[10px] py-1 px-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3 stroke-[2.5]" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {galleryItems.length === 0 && (
                <div className="text-center py-20 text-stone-500 font-bold uppercase border-[3px] border-dashed border-black">Belum ada item galeri. Silakan tambahkan foto baru.</div>
              )}
            </div>
          )}

          {/* TAB OPTION E: SECTIONS MANAGER */}
          {activeTab === "sections" && (
            <div className="space-y-12">
              
              {/* SUB-SECTION A: TECHNOLOGY SECTION SLOTS */}
              <div className="space-y-4">
                <div className="border-b-[3px] border-black pb-3 text-left">
                  <h3 className="text-md font-black uppercase tracking-tight text-black">1. Technology Section Layout</h3>
                  <p className="text-[11px] text-stone-600 font-bold uppercase mt-1">Bisa ganti foto di bento grid animasi Technology Section (kiri, kanan, dan 4 fase waktu tengah).</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {techSlots.map((slot) => (
                    <div key={slot.key} className="border-[3px] border-black rounded-none p-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] duration-150">
                      <div className="relative aspect-[4/3] w-full rounded-none overflow-hidden border-[3px] border-black bg-stone-50 mb-3">
                        <Image
                          src={slot.src || "/placeholder.svg"}
                          alt={slot.label}
                          fill
                          className="object-cover"
                        />
                        {uploadProgress[slot.key] !== undefined && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-3">
                            <div className="w-full bg-stone-800 h-3 border-[2px] border-black rounded-none overflow-hidden">
                              <div className="bg-[#E7F672] h-full transition-all duration-300" style={{ width: `${uploadProgress[slot.key]}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-left space-y-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-black bg-orange-300 border-[2px] border-black py-0.5 px-2 rounded-none inline-block">{slot.position} slot</span>
                        <h4 className="text-[11px] font-black text-black truncate uppercase tracking-wide block" title={slot.label}>{slot.label}</h4>
                      </div>

                      <div className="mt-4">
                        <label className="w-full flex items-center justify-center gap-1.5 bg-[#E7F672] text-black border-[3px] border-black hover:bg-lime-400 py-2 px-3 rounded-none text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all">
                          <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                          <span>Ganti Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleSectionImageChange(e, "technology", slot.key)}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUB-SECTION B: FEATURED PRODUCTS IMAGE SLIDER */}
              <div className="space-y-4">
                <div className="border-b-[3px] border-black pb-3 text-left">
                  <h3 className="text-md font-black uppercase tracking-tight text-black">2. Featured Products Gallery (Slider)</h3>
                  <p className="text-[11px] text-stone-600 font-bold uppercase mt-1">Foto yang berputar pada carousel horizontal besar di homepage.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {featuredProducts.map((slide, idx) => (
                    <div key={slide.key} className="border-[3px] border-black rounded-none p-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-150">
                      <div className="relative aspect-square w-full rounded-none overflow-hidden border-[3px] border-black bg-stone-50">
                        <Image
                          src={slide.src || "/placeholder.svg"}
                          alt={`Slide ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        {uploadProgress[slide.key] !== undefined && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-3">
                            <div className="w-full bg-stone-800 h-3 border-[2px] border-black rounded-none overflow-hidden">
                              <div className="bg-[#E7F672] h-full transition-all duration-300" style={{ width: `${uploadProgress[slide.key]}%` }} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t-[2px] border-black">
                        <span className="text-[10px] font-black uppercase tracking-wider text-black bg-[#F1EEDC] px-2 py-0.5 border border-black">Foto #{idx + 1}</span>
                        <button
                          onClick={() => handleDeleteSliderImage(slide.key)}
                          className="rounded-none border-[2px] border-black bg-white text-red-600 hover:bg-red-500 hover:text-white p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                          title="Hapus foto ini"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add slide placeholder trigger (Neo-Brutalist) */}
                  <div className="border-[3px] border-dashed border-black rounded-none flex flex-col items-center justify-center p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer min-h-[160px] relative">
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer gap-2.5">
                      <div className="h-10 w-10 rounded-none bg-[#E7F672] flex items-center justify-center border-[3px] border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-black">Tambah Foto Slider</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAddSliderImage}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* SUB-SECTION C: HOMEPAGE GALLERY STACK CARDS */}
              <div className="space-y-4">
                <div className="border-b-[3px] border-black pb-3 text-left">
                  <h3 className="text-md font-black uppercase tracking-tight text-black">3. Homepage Gallery (Parallax Cards)</h3>
                  <p className="text-[11px] text-stone-600 font-bold uppercase mt-1">Ubah foto dan detail 4 kartu geser bertumpuk (sticky scroll-cards) di homepage.</p>
                </div>

                <div className="space-y-8">
                  {homepageCards.map((card, idx) => (
                    <div key={card.key} className="border-[3px] border-black rounded-none p-5 bg-[#F1EEDC]/40 flex flex-col sm:flex-row gap-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-150">
                      
                      {/* Image Preview Frame */}
                      <div className="w-full sm:w-44 shrink-0">
                        <div className="relative aspect-[4/3] sm:aspect-[3/4] w-full rounded-none overflow-hidden border-[3px] border-black bg-stone-100 shadow-sm">
                          <Image
                            src={card.image_url || "/placeholder.svg"}
                            alt={card.title}
                            fill
                            className="object-cover"
                          />
                          {uploadProgress[card.key] !== undefined && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-3">
                              <div className="w-full bg-stone-800 h-3 border-[2px] border-black rounded-none overflow-hidden">
                                <div className="bg-[#E7F672] h-full transition-all duration-300" style={{ width: `${uploadProgress[card.key]}%` }} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <label className="w-full flex items-center justify-center gap-1.5 bg-white border-[3px] border-black hover:bg-stone-100 text-black py-2 px-3 rounded-none text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all">
                            <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                            <span>Replace Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleSectionImageChange(e, "homepage_gallery", card.key)}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Info Form Editor */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const f = new FormData(e.currentTarget);
                          handleCardTextSave(
                            card.key, 
                            f.get("card_title") as string,
                            f.get("card_description") as string,
                            f.get("card_tag") as string
                          );
                        }}
                        className="flex-grow flex flex-col justify-between text-left space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-black">Card Title</label>
                            <input
                              type="text"
                              name="card_title"
                              defaultValue={card.title}
                              className="w-full bg-white border-[3px] border-black rounded-none p-2.5 px-3.5 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-black">Tag Badge</label>
                            <input
                              type="text"
                              name="card_tag"
                              defaultValue={card.tag}
                              className="w-full bg-white border-[3px] border-black rounded-none p-2.5 px-3.5 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-black">Card Description</label>
                            <textarea
                              name="card_description"
                              rows={2}
                              defaultValue={card.description}
                              className="w-full bg-white border-[3px] border-black rounded-none p-2.5 px-3.5 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50 resize-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end border-t-[2px] border-black pt-4">
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 bg-[#E7F672] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all py-2.5 px-5 rounded-none text-[10px] font-black uppercase tracking-wider"
                          >
                            <Save className="w-4 h-4 stroke-[2.5]" />
                            <span>Save Card Details</span>
                          </button>
                        </div>
                      </form>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </section>

        {/* 3. QUICK ACCESS GRID (BAWAH): 4 kolom akses cepat, kotak kaku, ikon di tengah, hover translation */}
        <section className="space-y-4">
          <div className="border-b-[3px] border-black pb-2 text-left">
            <h3 className="text-md font-black uppercase tracking-tight text-black">Quick Access Tools</h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Link 1: Tambah Menu */}
            <div 
              onClick={() => {
                setCurrentMenuEdit(null);
                setIsMenuModalOpen(true);
              }}
              className="border-4 border-black bg-[#FFF7C2] rounded-none p-5 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all duration-150 min-h-[110px]"
            >
              <Plus className="w-6 h-6 text-black stroke-[3px]" />
              <span className="text-xs font-black uppercase tracking-wider text-black">Tambah Menu</span>
            </div>

            {/* Quick Link 2: Tambah Foto Galeri */}
            <div 
              onClick={() => {
                setCurrentGalleryEdit(null);
                setIsGalleryModalOpen(true);
              }}
              className="border-4 border-black bg-[#C2E7FF] rounded-none p-5 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all duration-150 min-h-[110px]"
            >
              <ImageIcon className="w-6 h-6 text-black stroke-[3px]" />
              <span className="text-xs font-black uppercase tracking-wider text-black">Tambah Foto Jurnal</span>
            </div>

            {/* Quick Link 3: Sinkronisasi Ulang */}
            <div 
              onClick={loadAllData}
              className="border-4 border-black bg-[#C2FFD7] rounded-none p-5 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all duration-150 min-h-[110px]"
            >
              <RefreshCw className="w-6 h-6 text-black stroke-[3px]" />
              <span className="text-xs font-black uppercase tracking-wider text-black">Sinkronisasi</span>
            </div>

            {/* Quick Link 4: Keluar Panel */}
            <div 
              onClick={handleLogout}
              className="border-4 border-black bg-[#FFC2C2] rounded-none p-5 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all duration-150 min-h-[110px]"
            >
              <LogOut className="w-6 h-6 text-black stroke-[3px]" />
              <span className="text-xs font-black uppercase tracking-wider text-black">Log Out</span>
            </div>
          </div>
        </section>

      </div>

      {/* MODAL 1: SIGNATURE MENU EDITOR FORM (Neo-Brutalist) */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#F1EEDC] rounded-none border-[4px] border-black max-w-md w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b-[3px] border-black bg-[#E7F672]">
              <h3 className="text-md font-black uppercase tracking-tighter text-black">
                {currentMenuEdit ? "Edit Menu Signature" : "Tambah Menu Signature Baru"}
              </h3>
              <button 
                onClick={() => setIsMenuModalOpen(false)}
                className="text-black hover:bg-white/40 p-1 rounded-none border-[2.5px] border-black bg-white transition-colors"
              >
                <X className="w-4 h-4 stroke-[3px]" />
              </button>
            </div>

            <form onSubmit={handleMenuSubmit} className="p-6 space-y-4 text-left max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-black">Nama Menu <span className="text-red-600 font-bold">*</span></label>
                <input
                  type="text"
                  name="name"
                  defaultValue={currentMenuEdit?.name || ""}
                  placeholder="Contoh: Single-Origin Espresso"
                  className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Kategori <span className="text-red-600 font-bold">*</span></label>
                  <select
                    name="category"
                    defaultValue={currentMenuEdit?.category || "Coffee"}
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50 appearance-none"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Non-Coffee">Non-Coffee</option>
                    <option value="Pastries">Pastries</option>
                    <option value="Specialties">Specialties</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Harga <span className="text-red-600 font-bold">*</span></label>
                  <input
                    type="text"
                    name="price"
                    defaultValue={currentMenuEdit?.price || ""}
                    placeholder="Contoh: $6.50"
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Ukuran (Pisahkan dengan Koma) <span className="text-red-600 font-bold">*</span></label>
                  <input
                    type="text"
                    name="sizes"
                    defaultValue={currentMenuEdit?.sizes || "Regular, Large"}
                    placeholder="Contoh: Regular, Large"
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Rating Awal (1.0 - 5.0)</label>
                  <input
                    type="text"
                    name="rating"
                    defaultValue={currentMenuEdit?.rating || "5.0"}
                    placeholder="Contoh: 4.8"
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Preset Instruksi Khusus (Pisahkan dengan Koma)</label>
                  <input
                    type="text"
                    name="special_instructions"
                    defaultValue={currentMenuEdit?.special_instructions || "Less Sugar, Less Ice"}
                    placeholder="Contoh: Less Sugar, Less Ice"
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Indeks Sort order</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={currentMenuEdit?.sort_order || 0}
                    placeholder="Contoh: 1"
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                  />
                </div>
              </div>

              {/* Checkbox Toggle for Signature Flag */}
              <div className="flex items-center gap-3 bg-white border-[3px] border-black p-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <input
                  type="checkbox"
                  id="is_signature"
                  name="is_signature"
                  defaultChecked={currentMenuEdit ? !!currentMenuEdit.is_signature : defaultIsSignature}
                  className="h-5 w-5 rounded-none border-[3px] border-black text-black bg-[#E7F672] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="is_signature" className="text-xs font-black uppercase tracking-wider text-black cursor-pointer select-none">
                  Tampilkan di Menu Signature Beranda
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-black">Deskripsi Singkat <span className="text-red-600 font-bold">*</span></label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={currentMenuEdit?.description || ""}
                  placeholder="Karakteristik rasa, biji kopi, rasa yang dominan..."
                  className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-black">Foto Menu</label>
                
                {currentMenuEdit?.image_url && (
                  <div className="relative h-16 w-16 border-[3px] border-black rounded-none overflow-hidden bg-white mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Image
                      src={currentMenuEdit.image_url}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <label className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-[#E7F672] border-[3px] border-black text-black py-3.5 px-4 rounded-none text-xs font-black uppercase tracking-wider cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                  <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                  <span>{currentMenuEdit?.image_url ? "Ganti Foto Menu" : "Pilih Berkas Foto"}</span>
                  <input
                    type="file"
                    name="image_file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {uploadProgress["menu_form"] !== undefined && (
                  <div className="w-full bg-white border-[2px] border-black h-3 rounded-none overflow-hidden mt-2">
                    <div className="bg-[#E7F672] h-full transition-all duration-300" style={{ width: `${uploadProgress["menu_form"]}%` }} />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t-[3px] border-black pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="bg-white border-[3px] border-black text-black hover:bg-stone-100 py-2.5 px-5 rounded-none text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#E7F672] border-[3px] border-black text-black hover:bg-lime-400 disabled:opacity-50 py-2.5 px-5 rounded-none text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
                >
                  {loading ? "Menyimpan..." : "Simpan Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: JOURNAL GALLERY EDITOR FORM */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F1EEDC] rounded-none border-[4px] border-black max-w-lg w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] my-8 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b-[3px] border-black bg-[#E7F672]">
              <h3 className="text-md font-black uppercase tracking-tighter text-black">
                {currentGalleryEdit ? "Edit Item Galeri Jurnal" : "Tambah Item Galeri Jurnal Baru"}
              </h3>
              <button 
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-black hover:bg-white/40 p-1 rounded-none border-[2.5px] border-black bg-white transition-colors"
              >
                <X className="w-4 h-4 stroke-[3px]" />
              </button>
            </div>

            <form onSubmit={handleGallerySubmit} className="p-6 space-y-4 text-left max-h-[75vh] overflow-y-auto">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-black">Judul Foto <span className="text-red-600 font-bold">*</span></label>
                <input
                  type="text"
                  name="title"
                  defaultValue={currentGalleryEdit?.title || ""}
                  placeholder="Contoh: Pour-over Ritual"
                  className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Kategori Key <span className="text-red-600 font-bold">*</span></label>
                  <select
                    name="category"
                    defaultValue={currentGalleryEdit?.category || "Brewing"}
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50 appearance-none"
                  >
                    <option value="Brewing">Brewing</option>
                    <option value="Espresso">Espresso</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Ambience">Ambience</option>
                    <option value="Pastries">Pastries</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Kategori Label (ID) <span className="text-red-600 font-bold">*</span></label>
                  <input
                    type="text"
                    name="category_label"
                    defaultValue={currentGalleryEdit?.category_label || ""}
                    placeholder="Contoh: Manual Brew, Espresso, dsb."
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Rating (0-5.0)</label>
                  <input
                    type="text"
                    name="rating"
                    defaultValue={currentGalleryEdit?.rating || "4.9"}
                    placeholder="Contoh: 4.9"
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Aksen (HEX)</label>
                  <input
                    type="text"
                    name="accent_color"
                    defaultValue={currentGalleryEdit?.accent_color || "#738A75"}
                    placeholder="Contoh: #738A75"
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-black">Indeks Sort</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={currentGalleryEdit?.sort_order || 0}
                    className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-black">Deskripsi Pendek</label>
                <input
                  type="text"
                  name="description"
                  defaultValue={currentGalleryEdit?.description || ""}
                  placeholder="Muncul sebagai intisari deskripsi kartu..."
                  className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-black">Deskripsi Lengkap Detail</label>
                <textarea
                  name="detailed_description"
                  rows={4}
                  defaultValue={currentGalleryEdit?.detailed_description || ""}
                  placeholder="Cerita panjang di balik foto ini yang muncul saat lightbox diklik..."
                  className="w-full bg-white border-[3px] border-black rounded-none p-3 px-4 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50 resize-none"
                />
              </div>

              {/* TECHNICAL PARAMETERS SECTION */}
              <div className="border-[3px] border-black rounded-none p-4 bg-white space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between border-b-[2px] border-black pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-black">Parameter Spesifikasi Teknis</span>
                  <span className="text-[9px] text-stone-600 font-bold uppercase">Batas 4 parameter utama</span>
                </div>

                <div className="space-y-3">
                  {[
                    { key: "Metode", def: "Hario V60 Filter" },
                    { key: "Suhu Air", def: "92°C" },
                    { key: "Rasio", def: "1:15" },
                    { key: "Beans", def: "Colombia Pink Bourbon" }
                  ].map((s) => (
                    <div key={s.key} className="flex gap-2 items-center">
                      <input
                        type="text"
                        name="spec_key"
                        defaultValue={s.key}
                        readOnly
                        className="w-1/3 bg-[#F1EEDC] border-[2px] border-black rounded-none p-1.5 px-3 text-[11px] font-black text-black"
                      />
                      <input
                        type="text"
                        name="spec_value"
                        defaultValue={currentGalleryEdit?.specs?.[s.key] || ""}
                        placeholder={`Misal: ${s.def}`}
                        className="w-2/3 bg-white border-[2px] border-black rounded-none p-1.5 px-3 text-[11px] text-black font-bold focus:outline-none focus:bg-yellow-50"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* PHOTO UPLOAD BLOCK */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-black">Berkas Foto</label>
                
                {currentGalleryEdit?.src && (
                  <div className="relative h-16 w-16 border-[3px] border-black rounded-none overflow-hidden bg-white mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Image
                      src={currentGalleryEdit.src}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <label className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-[#E7F672] border-[3px] border-black text-black py-3.5 px-4 rounded-none text-xs font-black uppercase tracking-wider cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                  <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                  <span>{currentGalleryEdit?.src ? "Ganti Foto" : "Pilih Berkas Foto Galeri"}</span>
                  <input
                    type="file"
                    name="image_file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {uploadProgress["gallery_form"] !== undefined && (
                  <div className="w-full bg-white border-[2px] border-black h-3 rounded-none overflow-hidden mt-2">
                    <div className="bg-[#E7F672] h-full transition-all duration-300" style={{ width: `${uploadProgress["gallery_form"]}%` }} />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t-[3px] border-black pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="bg-white border-[3px] border-black text-black hover:bg-stone-100 py-2.5 px-5 rounded-none text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#E7F672] border-[3px] border-black text-black hover:bg-lime-400 disabled:opacity-50 py-2.5 px-5 rounded-none text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
                >
                  {loading ? "Menyimpan..." : "Simpan Foto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
