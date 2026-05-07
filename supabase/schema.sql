-- 1. Create Menu Items Table (Signature Menu)
create table if not exists public.menu_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price text not null,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Gallery Items Table (Main Gallery Page)
create table if not exists public.gallery_items (
  id text primary key, -- Custom ID matching existing 'foto1', 'foto2', etc.
  title text not null,
  category text not null,
  category_label text not null,
  src text not null, -- Image URL
  description text not null,
  detailed_description text not null,
  specs jsonb not null, -- Stores specs key-value pairs
  rating text,
  accent_color text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Section Images Table (Saves dynamic layouts for homepage)
create table if not exists public.section_images (
  id uuid default gen_random_uuid() primary key,
  section text not null, -- 'technology' | 'featured_products' | 'homepage_gallery'
  key text not null, -- e.g. 'tech_left_1', 'tech_center_1', etc.
  image_url text not null,
  title text, -- Used for gallery card titles
  description text, -- Used for gallery card descriptions
  tag text, -- Used for gallery card tags
  link text, -- Used for links
  color text, -- For hover accent colors
  text_color text,
  position text, -- 'left' | 'right' | 'center'
  sort_order integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENABLE ROW LEVEL SECURITY
alter table public.menu_items enable row level security;
alter table public.gallery_items enable row level security;
alter table public.section_images enable row level security;

-- CREATE READ-ALL POLICIES
create policy "Allow Public Select Menu" on public.menu_items for select using (true);
create policy "Allow Public Select Gallery" on public.gallery_items for select using (true);
create policy "Allow Public Select Sections" on public.section_images for select using (true);

-- CREATE WRITE-ALL POLICIES (Allows testing from local dashboard without auth roadblocks)
create policy "Allow Public Write Menu" on public.menu_items for all using (true);
create policy "Allow Public Write Gallery" on public.gallery_items for all using (true);
create policy "Allow Public Write Sections" on public.section_images for all using (true);

-- 4. CONFIGURE STORAGE BUCKET
insert into storage.buckets (id, name, public)
values ('coffee-assets', 'coffee-assets', true)
on conflict (id) do nothing;

-- STORAGE POLICIES
create policy "Allow Public Select on coffee-assets" on storage.objects for select using ( bucket_id = 'coffee-assets' );
create policy "Allow Public Insert on coffee-assets" on storage.objects for insert with check ( bucket_id = 'coffee-assets' );
create policy "Allow Public Update on coffee-assets" on storage.objects for update using ( bucket_id = 'coffee-assets' );
create policy "Allow Public Delete on coffee-assets" on storage.objects for delete using ( bucket_id = 'coffee-assets' );

-- 5. SEED INITIAL STATIC DATA

-- A. Menu Items (Homepage Signature Menu)
insert into public.menu_items (name, description, price, image_url, sort_order) values
('Signature Espresso', 'Rich and robust double-shot espresso brewed from our premium house blend.', '$6.50', '/images/foto10.webp', 1),
('Vanilla Cloud Latte', 'Smooth espresso blended with creamy milk and cold-pressed vanilla bean syrup.', '$8.40', '/images/foto11.webp', 2),
('Matcha Harmony', 'Japanese matcha whisked with silky steamed milk.', '$9.80', '/images/foto12.webp', 3),
('Blueberry Muffin', 'Freshly baked muffin bursting with plump blueberries and a crumble top.', '$6.20', '/images/foto13.webp', 4)
on conflict do nothing;

-- B. Homepage Gallery Cards (CardsParallax)
insert into public.section_images (section, key, image_url, title, description, tag, link, color, text_color, sort_order) values
('homepage_gallery', 'card_1', '/images/foto21.jpeg', 'Sunrise Vista', 'Modern architecture glowing under the warm morning sun', 'architecture', '#', '#0a0a0a', 'white', 1),
('homepage_gallery', 'card_2', '/images/foto22.jpeg', 'Daylight Clarity', 'Crisp lines and sustainable design captured in bright daylight', 'architecture', '#', '#0a0a0a', 'white', 2),
('homepage_gallery', 'card_3', '/images/foto23.webp', 'Dusk Harmony', 'A perfect blend of evening hues and premium modern spaces', 'architecture', '#', '#0a0a0a', 'white', 3),
('homepage_gallery', 'card_4', '/images/foto24.webp', 'Night Radiance', 'Illuminating the dark with warm energy-efficient lighting', 'architecture', '#', '#0a0a0a', 'white', 4)
on conflict do nothing;

-- C. Featured Products Gallery (Slider)
insert into public.section_images (section, key, image_url, sort_order) values
('featured_products', 'slide_1', '/images/foto8.webp', 1),
('featured_products', 'slide_2', '/images/foto2.webp', 2),
('featured_products', 'slide_3', '/images/foto3.webp', 3),
('featured_products', 'slide_4', '/images/foto4.webp', 4),
('featured_products', 'slide_5', '/images/foto5.webp', 5),
('featured_products', 'slide_6', '/images/foto6.webp', 6),
('featured_products', 'slide_7', '/images/foto7.webp', 7)
on conflict do nothing;

-- D. Technology Section Images
insert into public.section_images (section, key, image_url, position) values
('technology', 'tech_left_1', '/images/foto4.webp', 'left'),
('technology', 'tech_right_1', '/images/foto5.webp', 'right'),
('technology', 'tech_center_1', '/images/hero1.webp', 'center'),
('technology', 'tech_center_2', '/images/hero2.webp', 'center'),
('technology', 'tech_center_3', '/images/hero3.webp', 'center'),
('technology', 'tech_center_4', '/images/foto21.webp', 'center')
on conflict do nothing;

-- E. Main Gallery Items (Detailed view)
insert into public.gallery_items (id, title, category, category_label, src, description, detailed_description, specs, rating, accent_color, sort_order) values
('foto1', 'Pour-over Ritual', 'Brewing', 'Manual Brew', '/images/foto1.webp', 'Seni menyeduh kopi filter secara presisi dengan metode V60 untuk mengeluarkan keasaman alami dan notes rasa buah.', 'Metode pour-over V60 kami menonjolkan profil rasa yang bersih dan kompleks dari biji kopi single origin pilihan. Air panas bersuhu 92°C dialirkan secara perlahan dengan gerakan sirkular konsisten, mengekstraksi minyak esensial dan keasaman buah yang seimbang secara sempurna demi cita rasa murni.', '{"Metode": "Hario V60 Filter", "Suhu Air": "92°C", "Rasio Kopi ke Air": "1:15 (15g kopi / 225g air)", "Waktu Seduh": "2 menit 45 detik", "Profil Rasa": "Clean, Bright, Floral, Tea-like", "Beans": "Ethiopia Yirgacheffe G1"}'::jsonb, '4.9', '#738A75', 1),
('foto2', 'The Golden Crema', 'Espresso', 'Espresso', '/images/foto2.webp', 'Ekstraksi espresso sempurna dengan warna keemasan yang tebal, menjanjikan rasa yang intens dan kaya.', 'Setiap shot espresso kami diekstraksi dari mesin espresso La Marzocco premium selama 25-28 detik. Crema keemasan yang terbentuk di permukaan menandakan ekstraksi minyak kopi yang optimal, menghasilkan rasa manis karamel alami dengan tekstur syrupy yang kaya dan aftertaste tahan lama.', '{"Mesin": "La Marzocco Linea PB", "Tekanan Pompa": "9 Bar", "Dosis Bubuk": "19.5 gram (Double Shot)", "Hasil Ekstraksi": "38 gram cairan", "Waktu Aliran": "26 detik", "Notes Rasa": "Dark Chocolate, Toffee, Brown Sugar"}'::jsonb, '5.0', '#8c7a6b', 2),
('foto3', 'Green Coffee Beans', 'Origin', 'Asal Usul', '/images/foto3.webp', 'Biji kopi hijau pilihan langsung dari petani lokal terbaik sebelum proses pemanggangan (roasting).', 'Kualitas kopi kami dimulai langsung dari akar perkebunannya. Kami bermitra secara adil dengan petani lokal di wilayah Jawa Barat dan Toraja untuk menyeleksi ceri kopi merah matang sempurna yang diproses secara cermat untuk mempertahankan kejernihan cita rasa asal usulnya.', '{"Origin": "Kamojang, Jawa Barat", "Proses Pasca-Panen": "Natural Process (Dry)", "Varietas": "Sigararutang, Kartika", "Ketinggian": "1,450 meter di atas permukaan laut", "Tingkat Kelembapan": "11.5%", "Kemitraan": "Direct Trade (Perdagangan Adil)"}'::jsonb, '4.8', '#5E7560', 3),
('foto4', 'Cold Drip Coffee', 'Brewing', 'Manual Brew', '/images/foto4.webp', 'Metode seduh dingin perlahan selama 12 jam untuk rasa kopi yang sangat halus dan rendah keasaman.', 'Tetes demi tetes air es murni melewati bubuk kopi pilihan kami secara konstan selama lebih dari setengah hari di menara kaca drip kami. Proses ekstraksi dingin yang lambat ini meminimalkan pelepasan senyawa pahit dan asam kasar, menciptakan minuman kopi yang luar biasa halus dan manis alami.', '{"Metode Ekstraksi": "Slow Cold Drip (Kyoto Style)", "Durasi Seduh": "12 Jam", "Suhu Air": "4°C (Air Es)", "Notes Rasa": "Winey, Ripe Berry, Sweet Chocolate", "Saran Penyajian": "Disajikan dingin dengan es batu kristal tunggal", "Beans": "Colombia Pink Bourbon"}'::jsonb, '4.9', '#3F4E3F', 4),
('foto5', 'Cozy Corner', 'Ambience', 'Suasana', '/images/foto5.webp', 'Sudut tenang kedai kami yang dirancang dengan elemen kayu hangat, sempurna untuk bekerja atau bersantai.', 'Suasana kedai kami dirancang sebagai ''ruang ketiga'' Anda yang ramah dan menenangkan. Dikelilingi tanaman hijau segar, pencahayaan alami yang lembut dari jendela kaca besar, dan perabotan kayu jati kokoh yang dilengkapi dengan outlet listrik, menjadikannya sudut ideal untuk produktivitas mandiri maupun bercengkerama santai.', '{"Konsep Desain": "Japandi (Japanese-Scandinavian) Minimalist", "Pencahayaan": "Warm White Ambient & Natural Skylight", "Fasilitas": "Akses Wi-Fi High-Speed, Colokan Listrik Mandiri", "Kapasitas Area": "4-6 Orang per sudut", "Musik": "Soft Jazz / Lo-Fi Beats", "Jam Terbaik": "09:00 - 13:00 (Penuh Cahaya Alami)"}'::jsonb, '4.7', '#9c8c7c', 5),
('foto6', 'Latte Art Mastery', 'Espresso', 'Espresso', '/images/foto6.webp', 'Susu sutra bertekstur microfoam dituangkan dengan keahlian tinggi membentuk desain rosetta yang anggun.', 'Barista kami melatih teknik frothing susu secara presisi hingga menghasilkan tekstur microfoam yang menyerupai cat basah yang mengilap. Ketika dipadukan dengan espresso bercangkir tebal, terciptalah karya seni visual simetris yang juga memperhalus intensitas rasa kopi dengan kemanisan laktosa alami susu.', '{"Suhu Susu": "60°C - 65°C (Kemanisan Maksimal)", "Tekstur": "Microfoam Halus (Sutra)", "Pola Seni": "Rosetta / Winged Tulip", "Jenis Susu": "Fresh Whole Milk / Barista Edition Oatside", "Penyelarasan": "Espresso Blend Medium-Dark Roast", "Penyajian": "Cangkir Keramik Tebal 200ml"}'::jsonb, '4.9', '#7c6a5c', 6),
('foto7', 'Roasting Process', 'Origin', 'Asal Usul', '/images/foto7.webp', 'Proses pemanggangan biji kopi secara mikro untuk menghasilkan profil rasa unik dan aroma yang memikat.', 'Kami melakukan pemanggangan biji kopi secara berkala di dalam kedai (in-house micro-roasting) untuk memastikan kesegaran puncak. Setiap batch dikontrol secara digital melalui kurva suhu presisi untuk mencapai tingkat pemanggangan medium roast demi menonjolkan keunikan rasa daerah asal (terroir) biji kopi tersebut.', '{"Mesin Roasting": "Probat One Micro-Roaster", "Kapasitas Batch": "5 Kilogram", "Tingkat Roasting": "Medium Roast", "Suhu Maksimal": "205°C", "Durasi Roast": "11 menit 15 detik", "Periode Resting": "7-10 Hari setelah roasting sebelum diseduh"}'::jsonb, '4.8', '#2F3E30', 7),
('foto8', 'Iced Latte Refreshment', 'Beverages', 'Spesialitas', '/images/foto8.webp', 'Perpaduan segar espresso, susu dingin berkualitas, dan es batu murni di siang hari yang hangat.', 'Minuman pelepas dahaga klasik terfavorit yang menyatukan kekuatan espresso blend andalan kami dengan kelembutan susu segar dingin. Keseimbangan yang sempurna antara kekentalan rasa creamy susu dan tendangan kafein yang bersih, menjadikannya penyegar tubuh instan yang andal.', '{"Komposisi": "Double Shot Espresso, Fresh Milk, Clean Ice Cubes", "Susu": "Full Cream / Oat Milk (Opsional)", "Pemanis": "Sirup Gula Aren Cair Organik (Opsional/Terpisah)", "Ukuran Gelas": "12 oz (360 ml)", "Kadar Kafein": "Sedang-Tinggi (~130mg)", "Karakter": "Creamy, Refreshing, Balanced"}'::jsonb, '4.9', '#6a7c6a', 8),
('foto9', 'Barista''s Precision', 'Brewing', 'Manual Brew', '/images/foto9.webp', 'Setiap langkah pembuatan kopi diukur secara akurat mulai dari berat bubuk hingga rasio air.', 'Di kedai kami, menyeduh kopi adalah perpaduan harmonis antara disiplin sains dan kepekaan seni. Barista kami menimbang bubuk kopi hingga akurasi miligram, memonitor laju aliran penuangan air, serta mengukur total padatan terlarut (TDS) secara konsisten untuk memastikan cita rasa yang seragam di setiap cangkir.', '{"Alat Ukur": "Acaia Pearl Digital Scale & Timer", "Akurasi Timbangan": "0.1 gram", "Tingkat TDS Target": "1.35% - 1.45% (Ekstraksi Optimal)", "Sertifikasi Barista": "SCA (Specialty Coffee Association) Certified", "Grinder": "Mahlkönig EK43S (Konsistensi Partikel Tinggi)", "Standardisasi": "SOP Seduh Ketat Harian"}'::jsonb, '4.8', '#4E5E4E', 9),
('foto10', 'Signature Espresso', 'Espresso', 'Espresso', '/images/foto10.webp', 'Espresso murni dari house-blend kami, kaya akan notes cokelat hitam dan citrus manis.', 'Merupakan intisari dari filosofi kopi kami. Diekstraksi dari biji kopi musiman terbaik yang dipadukan untuk menghasilkan espresso yang seimbang: asam jeruk citrus yang segar di awal penuangan, disusul kepekatan rasa manis gula merah, dan diakhiri dengan aftertaste cokelat hitam yang membekas indah.', '{"Notes Rasa Dominan": "Dark Chocolate, Sweet Citrus, Brown Sugar", "Komposisi Blend": "50% Flores Bajawa (Washed), 50% Colombia Huila (Natural)", "Dosis Portafilter": "20 gram", "Yield Cairan": "40 gram (Rasio 1:2)", "Waktu Ekstraksi": "27 detik", "Tingkat Keasaman": "Medium-High, Lembut"}'::jsonb, '5.0', '#1d291e', 10),
('foto11', 'Vanilla Cloud Latte', 'Beverages', 'Spesialitas', '/images/foto11.webp', 'Kombinasi latte lembut dengan sirup vanilla organik buatan sendiri dan foam krim tebal.', 'Minuman kreasi spesial yang memanjakan lidah. Kami mengekstraksi sirup vanilla secara in-house dari batang vanilla Madagaskar pilihan, mencampurkannya ke dalam espresso pekat dan susu hangat, lalu menyempurnakannya dengan lapisan cold-foam vanilla yang tebal namun selembut awan di atasnya.', '{"Pemanis Utama": "Sirup Vanilla Organik Madagaskar (Homemade)", "Topping": "Vanilla Cold Foam & Sedikit Bubuk Vanilla Bean", "Espresso": "Single-Origin Colombia (Profil Sweet-Caramel)", "Suhu Saji": "62°C (Hangat) / Dingin dengan Es", "Notes Rasa": "Rich Vanilla, Buttery, Mildly Coffee-Forward", "Kategori Populer": "Best Seller Sweet Beverage"}'::jsonb, '5.0', '#806d5c', 11),
('foto12', 'Matcha Harmony', 'Beverages', 'Spesialitas', '/images/foto12.webp', 'Matcha murni Uji, Jepang, yang dikokok tradisional lalu dituangkan di atas susu segar.', 'Bagi pencinta non-kopi, kami menghadirkan Matcha Jepang berkualitas ceremonial dari bukit teh Uji, Kyoto. Bubuk matcha hijau pekat dikocok menggunakan chasen (kocokan bambu) tradisional untuk menghasilkan emulsi busa yang tebal dan aroma umami alami yang khas, lalu disatukan dengan susu segar yang creamy.', '{"Bahan Utama": "100% Ceremonial-Grade Uji Matcha", "Alat Pengocok": "Chasen (Bambu Jepang Tradisional) & Chawan (Mangkuk)", "Metode Campuran": "Whisked-to-order (Dibuat langsung saat dipesan)", "Susu Pendukung": "Fresh Whole Milk / Almond Milk (Sangat Direkomendasikan)", "Notes Rasa": "Earthy, Umami, Vegetal, Creamy Sweetness", "Kandungan Gula": "Tanpa gula tambahan (Hanya kemanisan alami susu)"}'::jsonb, '4.9', '#556B2F', 12),
('foto13', 'Blueberry Crumble Muffin', 'Pastries', 'Pastry', '/images/foto13.webp', 'Muffin lembut yang dipanggang segar setiap pagi, penuh dengan buah blueberry berair dan taburan renyah.', 'Kudapan pendamping sempurna untuk secangkir kopi hitam hangat Anda. Dipanggang segar setiap pagi sebelum pintu kedai dibuka, muffin mentega ini memiliki bagian dalam yang sangat lembut dan sarat dengan buah blueberry utuh berair yang meletup saat digigit, berpadu kontras dengan taburan crumble mentega renyah manis di atasnya.', '{"Status Pembuatan": "Baked Fresh Daily In-house", "Bahan Utama": "Fresh Blueberry, French Butter, Flour, Demerara Sugar", "Tekstur": "Soft-moist crumb inside, Crunchy buttery crumble top", "Saran Pasangan Kopi": "Filter Coffee (Black) / Espresso Shot", "Alergen": "Mengandung Gluten, Dairy (Mentega & Susu), Telur", "Saran Konsumsi": "Paling lezat disajikan hangat (bisa dipanaskan kembali)"}'::jsonb, '4.8', '#4B382A', 13)
on conflict (id) do nothing;

-- 6. UPGRADE MENU ITEMS SCHEMA FOR EXTENDED METADATA
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS category text DEFAULT 'Coffee' NOT NULL;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS sizes text DEFAULT 'Regular' NOT NULL;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS special_instructions text DEFAULT '' NOT NULL;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 5.0;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS reviews jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS is_signature boolean DEFAULT false NOT NULL;

