"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, Users, Mail, Phone, User, MessageSquare,
  ArrowRight, CheckCircle2, ChevronLeft, Sparkles, Coffee, AlertCircle, MapPin
} from "lucide-react";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { CoffeeImage } from "@/components/coffee-image";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const TIME_SLOTS = [
  "09:00 WIB", "10:00 WIB", "11:00 WIB", "12:00 WIB", "13:00 WIB",
  "14:00 WIB", "15:00 WIB", "16:00 WIB", "17:00 WIB", "18:00 WIB",
  "19:00 WIB", "20:00 WIB", "21:00 WIB"
];

const GUEST_OPTIONS = [
  { value: "1", label: "1 Orang (Solo)" },
  { value: "2", label: "2 Orang (Couple)" },
  { value: "4", label: "3 - 4 Orang (Small Group)" },
  { value: "6", label: "5 - 6 Orang (Family/Meeting)" },
  { value: "10", label: "7+ Orang (Gathering)" }
];

export default function ReservationPage() {
  const [isDbOnline, setIsDbOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [notes, setNotes] = useState("");

  // Saved booking state for the success screen
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Set minimum date to today
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    // Determine database configuration
    setIsDbOnline(isSupabaseConfigured());

    // Calculate today's date in YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate inputs
    if (!name || !email || !phone || !date || !time || !guests) {
      setErrorMsg("Mohon lengkapi seluruh kolom formulir wajib yang berbintang (*).");
      return;
    }

    setLoading(true);

    const bookingData = {
      name,
      email,
      phone,
      date,
      time,
      guests: parseInt(guests),
      notes,
      status: "pending",
      created_at: new Date().toISOString()
    };

    try {
      if (isSupabaseConfigured() && supabase) {
        // Online Supabase Mode
        const { data, error } = await supabase
          .from("reservations")
          .insert([bookingData])
          .select();

        if (error) throw error;
        setConfirmedBooking(data?.[0] || bookingData);
      } else {
        // Offline / Demo Mode fallback
        const localData = localStorage.getItem("coffee_local_reservations");
        const existingBookings = localData ? JSON.parse(localData) : [];
        const mockId = "res_" + Math.random().toString(36).substring(2, 9);
        const newLocalBooking = { ...bookingData, id: mockId };

        existingBookings.unshift(newLocalBooking);
        localStorage.setItem("coffee_local_reservations", JSON.stringify(existingBookings));
        setConfirmedBooking(newLocalBooking);
      }

      setSuccess(true);
      // Scroll to top of the viewport
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Gagal melakukan reservasi:", err);
      setErrorMsg(err.message || "Terjadi kesalahan internal. Mohon coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDate("");
    setTime("");
    setGuests("2");
    setNotes("");
    setSuccess(false);
    setConfirmedBooking(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2F3E30] font-sans antialiased selection:bg-[#738A75] selection:text-white overflow-x-hidden">
      <Header />

      {/* 1. HERO HEADER AREA */}
      <section className="relative min-h-[45vh] flex items-center justify-center pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CoffeeImage
            src="/images/hero3.jpeg"
            alt="Fow Coffee Ambient"
            fill
            className="object-cover scale-105 brightness-[0.25]"
            priority
            placeholderType="both"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1EA] via-transparent to-black/35 z-10" />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center mt-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Reservasi <span className="text-[#A0B9A2]">Meja Anda.</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-medium max-w-md mx-auto leading-relaxed">
              Pastikan sudut ternyaman Anda di Fow Coffee Dago selalu tersedia. Sempurna untuk menikmati suasana sejuk, bekerja produktif, maupun berkumpul hangat.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#F4F1EA] to-transparent pointer-events-none z-10" />
      </section>

      {/* 2. MAIN CONTENT AREA (FORMS VS SUCCESS CARD) */}
      <section className="py-12 px-6 max-w-6xl mx-auto relative z-20 -mt-10">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="booking-form-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch"
            >
              {/* LEFT COLUMN: GUIDELINES & LOCATION DETAILS */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-8 bg-[#EAE7DF] border border-[#2F3E30]/5 rounded-[32px] p-6 sm:p-8 text-left">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#738A75]">
                      Panduan Layanan
                    </span>
                    <h2 className="text-2xl font-black text-[#2F3E30] tracking-tight">
                      Kebijakan Booking
                    </h2>
                  </div>

                  <div className="space-y-4 text-xs text-stone-700 leading-relaxed font-semibold">
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-[#738A75]/10 flex items-center justify-center text-[#738A75] shrink-0 font-bold">1</div>
                      <p className="pt-0.5">Reservasi harian bersifat **gratis** tanpa dikenakan biaya minimum pemesanan.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-[#738A75]/10 flex items-center justify-center text-[#738A75] shrink-0 font-bold">2</div>
                      <p className="pt-0.5">Meja Anda akan ditahan selama **maksimal 15 menit** dari waktu reservasi yang disetujui.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-[#738A75]/10 flex items-center justify-center text-[#738A75] shrink-0 font-bold">3</div>
                      <p className="pt-0.5">Setelah mengirimkan formulir, Anda dapat memantau status persetujuan di panel admin atau menunggu konfirmasi admin.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#2F3E30]/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-xl border border-[#2F3E30]/10 flex items-center justify-center text-[#738A75]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <span className="text-stone-400 font-extrabold block uppercase tracking-wide text-[9px]">Lokasi Kami</span>
                      <span className="font-extrabold text-[#2F3E30]">Dago, Bandung Utara</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-xl border border-[#2F3E30]/10 flex items-center justify-center text-[#738A75]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <span className="text-stone-400 font-extrabold block uppercase tracking-wide text-[9px]">Jam Layanan</span>
                      <span className="font-extrabold text-[#2F3E30]">08:00 - 22:00 WIB</span>
                    </div>
                  </div>
                </div>

                {!isDbOnline && (
                  <div className="bg-[#E7F672]/30 border border-[#2F3E30]/10 p-4 rounded-2xl text-[10px] font-bold text-stone-700 leading-relaxed">
                    <span className="flex items-center gap-1 font-black uppercase text-[#2F3E30] mb-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Local Testing Mode
                    </span>
                    Sistem Supabase tidak terdeteksi. Formulir ini akan menyimpan data langsung ke penyimpanan browser lokal Anda sehingga Anda dapat langsung melihat hasilnya di Admin Panel.
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: BOOKING FORM (Premium Glassmorphism-style Box) */}
              <div className="lg:col-span-8">
                <div className="bg-[#EAE7DF]/40 backdrop-blur-md border border-[#2F3E30]/10 rounded-[32px] p-6 sm:p-10 shadow-xl relative overflow-hidden text-left">
                  <div className="space-y-1 mb-8">
                    <h3 className="text-2xl font-black text-[#2F3E30] tracking-tight">Formulir Reservasi Meja</h3>
                    <p className="text-xs text-stone-600 font-bold uppercase tracking-wide">Harap lengkapi informasi yang dibutuhkan di bawah ini.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Grid Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[#2F3E30] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#738A75]" />
                          <span>Nama Lengkap <span className="text-red-500 font-bold">*</span></span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Contoh: Gio Vernando"
                          className="w-full text-xs font-bold bg-[#F4F1EA] border border-[#2F3E30]/15 rounded-full py-3.5 px-5 text-[#2F3E30] focus:outline-none focus:border-[#738A75] focus:bg-white transition-all shadow-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[#2F3E30] flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#738A75]" />
                          <span>Alamat Email <span className="text-red-500 font-bold">*</span></span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Contoh: vrnan@gmail.com"
                          className="w-full text-xs font-bold bg-[#F4F1EA] border border-[#2F3E30]/15 rounded-full py-3.5 px-5 text-[#2F3E30] focus:outline-none focus:border-[#738A75] focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Grid Phone + Guest count */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[#2F3E30] flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#738A75]" />
                          <span>Nomor Telepon/WA <span className="text-red-500 font-bold">*</span></span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Contoh: 08123456789"
                          className="w-full text-xs font-bold bg-[#F4F1EA] border border-[#2F3E30]/15 rounded-full py-3.5 px-5 text-[#2F3E30] focus:outline-none focus:border-[#738A75] focus:bg-white transition-all shadow-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[#2F3E30] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#738A75]" />
                          <span>Jumlah Tamu <span className="text-red-500 font-bold">*</span></span>
                        </label>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="w-full text-xs font-bold bg-[#F4F1EA] border border-[#2F3E30]/15 rounded-full py-3.5 px-5 text-[#2F3E30] focus:outline-none focus:border-[#738A75] focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                        >
                          {GUEST_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Grid Date + Time Slot */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[#2F3E30] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#738A75]" />
                          <span>Tanggal Booking <span className="text-red-500 font-bold">*</span></span>
                        </label>
                        <input
                          type="date"
                          required
                          min={minDate}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full text-xs font-bold bg-[#F4F1EA] border border-[#2F3E30]/15 rounded-full py-3.5 px-5 text-[#2F3E30] focus:outline-none focus:border-[#738A75] focus:bg-white transition-all shadow-sm cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[#2F3E30] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#738A75]" />
                          <span>Pilih Jam Kedatangan <span className="text-red-500 font-bold">*</span></span>
                        </label>
                        <select
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full text-xs font-bold bg-[#F4F1EA] border border-[#2F3E30]/15 rounded-full py-3.5 px-5 text-[#2F3E30] focus:outline-none focus:border-[#738A75] focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                        >
                          <option value="" disabled>-- Pilih Jam --</option>
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Special Notes */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-[#2F3E30] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#738A75]" />
                        <span>Catatan Khusus (Opsional)</span>
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: Meja dekat taman indoor, tolong siapkan lilin untuk perayaan anniversary, sediakan colokan listrik."
                        rows={3}
                        className="w-full text-xs font-bold bg-[#F4F1EA] border border-[#2F3E30]/15 rounded-[24px] py-4 px-5 text-[#2F3E30] focus:outline-none focus:border-[#738A75] focus:bg-white transition-all shadow-sm resize-none"
                      />
                    </div>

                    {errorMsg && (
                      <div className="text-xs text-red-700 font-bold bg-red-100/80 border border-red-200 p-4 rounded-[16px] flex items-start gap-2 animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[#2F3E30]/10 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-10 py-4 bg-[#738A75] hover:bg-[#5E7560] disabled:bg-stone-400 text-white font-extrabold text-xs rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                      >
                        <span>{loading ? "Memproses Pemesanan..." : "Kirim Reservasi Meja"}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            /* SUCCESS CONTAINER: THE PREMIUM BRUTALIST CONFIRMATION TICKET */
            <motion.div
              key="booking-success-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(47,62,48,1)] relative overflow-hidden text-center rounded-none animate-reveal-up">

                {/* Vintage jagged receipt top effect */}
                <div className="absolute top-0 inset-x-0 h-2 bg-[radial-gradient(circle,transparent_10%,#F4F1EA_10%)] bg-[length:16px_16px] -mt-1" />

                {/* Status Indicator Bubble */}
                <div className="h-16 w-16 bg-green-100 border-4 border-black flex items-center justify-center mx-auto mb-5 rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-[#2F3E30]">
                  <CheckCircle2 className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-1.5 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Booking Confirmed!</span>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-black">Reservasi Terkirim</h2>
                  <p className="text-xs text-stone-600 font-bold max-w-xs mx-auto leading-relaxed">
                    Reservasi Anda berhasil disimpan dan saat ini sedang menunggu persetujuan dari tim Fow Coffee.
                  </p>
                </div>

                {/* Ticket Details Box */}
                <div className="border-[3px] border-black rounded-none p-5 bg-[#F4F1EA]/50 text-left font-sans space-y-4 mb-8 relative">

                  {/* Decorative Ticket Punches */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-3 bg-[#F4F1EA] border-[3px] border-black border-l-0" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-3 bg-[#F4F1EA] border-[3px] border-black border-r-0" />

                  <div className="border-b-[2px] border-dashed border-black/25 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-[#738A75] stroke-[2.5]" />
                      <span className="text-xs font-black uppercase tracking-wider text-black">Fow Coffee Dago</span>
                    </div>
                    <span className="text-[9px] font-mono text-stone-500 font-extrabold uppercase">ID: {confirmedBooking?.id || "N/A"}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-extrabold uppercase tracking-wider">
                    <div>
                      <span className="text-[9px] text-stone-400 font-black block">Pelanggan</span>
                      <span className="text-black truncate block">{confirmedBooking?.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-stone-400 font-black block">Kontak</span>
                      <span className="text-black block">{confirmedBooking?.phone}</span>
                    </div>
                    <div className="border-t border-black/10 pt-3">
                      <span className="text-[9px] text-stone-400 font-black block">Waktu Kunjungan</span>
                      <span className="text-black block">{confirmedBooking?.date} @ {confirmedBooking?.time}</span>
                    </div>
                    <div className="border-t border-black/10 pt-3">
                      <span className="text-[9px] text-stone-400 font-black block">Kapasitas</span>
                      <span className="text-black block">{confirmedBooking?.guests} Kursi / Tamu</span>
                    </div>
                  </div>

                  {confirmedBooking?.notes && (
                    <div className="border-t border-black/10 pt-3">
                      <span className="text-[9px] text-stone-400 font-black block mb-1">Catatan Khusus</span>
                      <p className="text-[11px] text-stone-600 font-bold leading-normal italic">
                        "{confirmedBooking?.notes}"
                      </p>
                    </div>
                  )}

                  <div className="border-t-[2px] border-dashed border-black/25 pt-3.5 flex justify-between items-center bg-[#E7F672]/25 p-3 border border-black">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#2F3E30]">Status Reservasi</span>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-amber-300 text-amber-900 border-[2px] border-black">PENDING APPROVAL</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleResetForm}
                    className="flex-1 rounded-none border-[3px] border-black bg-white text-black hover:bg-stone-50 font-black uppercase text-xs py-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[3]" />
                    <span>Pesan Meja Lagi</span>
                  </button>
                  <a
                    href="/"
                    className="flex-1 rounded-none border-[3px] border-black bg-[#E7F672] text-black hover:bg-lime-400 font-black uppercase text-xs py-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Kembali Ke Beranda</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </a>
                </div>

                <div className="mt-6 text-[9px] text-stone-500 font-bold uppercase tracking-widest">
                  *Tunjukkan struk digital ini kepada barista setibanya di kedai.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <FooterSection />
    </div>
  );
}
