import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'database.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('honda123', 10);
    db.prepare(`INSERT INTO users (username, password, nama) VALUES (?, ?, ?)`).run('admin', hashedPassword, 'Admin Honda');

    const mobil = [
      { nama: "Honda Brio", kategori: "Hatchback", harga: 205800000, transmisi: "Manual & CVT", kapasitas: 5, mesin: "1.2L i-VTEC", foto: "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&q=80", warna: JSON.stringify(["Merah", "Putih", "Hitam", "Silver"]), fitur: JSON.stringify(["AC Digital", "Dual SRS Airbag", "ABS+EBD", "Power Window"]), deskripsi: "Mobil perkotaan yang kompak, lincah, dan hemat bahan bakar.", tipe: JSON.stringify([{"nama":"New Brio Satya S CVT","harga":205800000},{"nama":"New Brio Satya E CVT","harga":231900000},{"nama":"New Brio RS CVT","harga":288200000},{"nama":"Brio RS Two Tone CVT","harga":290700000}]) },
      { nama: "Honda WR-V", kategori: "SUV", harga: 304400000, transmisi: "CVT", kapasitas: 5, mesin: "1.5L i-VTEC", foto: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80", warna: JSON.stringify(["Merah", "Putih", "Hitam", "Kuning"]), fitur: JSON.stringify(["Honda Sensing", "Kunci Pintar", "Layar 7\"", "Kursi Kulit"]), deskripsi: "SUV kompak dengan gaya sporty dan performa tangguh.", tipe: JSON.stringify([{"nama":"WR-V E CVT","harga":304400000},{"nama":"WR-V RS CVT","harga":316900000},{"nama":"WR-V RS Two Tone CVT","harga":319400000},{"nama":"WR-V RS Honda Sensing CVT","harga":340900000},{"nama":"WR-V RS Honda Sensing Two Tone CVT","harga":343400000}]) },
      { nama: "Honda HR-V", kategori: "SUV", harga: 401700000, transmisi: "CVT", kapasitas: 5, mesin: "1.5L i-VTEC / e:HEV", foto: "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=600&q=80", warna: JSON.stringify(["Merah", "Putih", "Hitam", "Biru"]), fitur: JSON.stringify(["Honda Sensing", "Sunroof", "Layar 8\"", "Kursi Elektrik"]), deskripsi: "SUV premium dengan desain futuristik dan teknologi canggih.", tipe: JSON.stringify([{"nama":"New HR-V 1.5 E CVT","harga":401700000},{"nama":"New HR-V 1.5 E Two Tone CVT","harga":404200000},{"nama":"New HR-V 1.5 E+ CVT","harga":424500000},{"nama":"New HR-V 1.5 E+ Two Tone CVT","harga":427200000},{"nama":"New HR-V 1.5 e:HEV E CVT","harga":464300000},{"nama":"New HR-V 1.5 e:HEV Two Tone E CVT","harga":466800000},{"nama":"New HR-V 1.5 e:HEV Modulo E CVT","harga":476000000},{"nama":"New HR-V 1.5 e:HEV Modulo Two Tone E CVT","harga":478500000},{"nama":"New HR-V 1.5 RS e:HEV E CVT","harga":504300000},{"nama":"New HR-V 1.5 RS e:HEV Two Tone E CVT","harga":506800000}]) },
      { nama: "Honda BR-V", kategori: "SUV", harga: 329800000, transmisi: "Manual & CVT", kapasitas: 7, mesin: "1.5L i-VTEC", foto: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80", warna: JSON.stringify(["Merah", "Putih", "Hitam", "Abu-abu"]), fitur: JSON.stringify(["AC Dual Blower", "Layar 7\"", "Kursi Lipat", "Honda Sensing"]), deskripsi: "SUV 7-seater ideal untuk keluarga dengan kenyamanan maksimal.", tipe: JSON.stringify([{"nama":"BR-V S MT","harga":329800000},{"nama":"BR-V E MT","harga":345800000},{"nama":"BR-V N7X Edition CVT","harga":358600000},{"nama":"BR-V Prestige N7X Edition CVT","harga":383900000},{"nama":"BR-V Honda Sensing N7X CVT","harga":404300000}]) },
      { nama: "Honda City Hatchback", kategori: "Hatchback", harga: 399500000, transmisi: "CVT", kapasitas: 5, mesin: "1.5L i-VTEC", foto: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80", warna: JSON.stringify(["Merah", "Putih", "Hitam", "Silver"]), fitur: JSON.stringify(["Honda Connect", "Layar 8\"", "Kursi Kulit", "Kunci Pintar"]), deskripsi: "Hatchback stylish dengan fitur premium dan kenyamanan berkendara.", tipe: JSON.stringify([{"nama":"City Hatchback RS Honda Sensing MT","harga":399500000},{"nama":"City Hatchback RS Honda Sensing Two Tone MT","harga":402000000}]) },
      { nama: "Honda Civic RS", kategori: "Sedan", harga: 649800000, transmisi: "e:HEV CVT", kapasitas: 5, mesin: "2.0L e:HEV Hybrid", foto: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&q=80", warna: JSON.stringify(["Merah", "Putih", "Hitam", "Biru"]), fitur: JSON.stringify(["Honda Sensing", "Sunroof", "Layar 9\"", "Bose Audio", "Kursi Elektrik"]), deskripsi: "Sedan sporty dengan performa turbo dan desain agresif.", tipe: JSON.stringify([{"nama":"New Civic RS e:HEV CVT","harga":649800000}]) },
      { nama: "Honda CR-V", kategori: "SUV", harga: 797300000, transmisi: "e:HEV CVT", kapasitas: 7, mesin: "2.0L e:HEV Hybrid", foto: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=600&q=80", warna: JSON.stringify(["Merah", "Putih", "Hitam", "Silver"]), fitur: JSON.stringify(["Honda Sensing", "Sunroof", "Layar 8\"", "Kursi Kulit", "AC Dual Blower"]), deskripsi: "SUV keluarga premium dengan kabin luas dan teknologi keselamatan terkini.", tipe: JSON.stringify([{"nama":"All New CR-V 2.0 e:HEV Hybrid CVT","harga":797300000},{"nama":"All New CR-V 2.0 RS e:HEV Hybrid CVT","harga":849900000}]) },
      { nama: "Honda Accord", kategori: "Sedan", harga: 999000000, transmisi: "e:HEV CVT", kapasitas: 5, mesin: "2.0L e:HEV Hybrid", foto: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80", warna: JSON.stringify(["Merah", "Putih", "Hitam", "Silver"]), fitur: JSON.stringify(["Honda Sensing", "Sunroof", "Layar 9\"", "Bose Audio", "Kursi Elektrik", "Kursi Pemanas"]), deskripsi: "Sedan eksekutif dengan kemewahan dan kenyamanan terbaik.", tipe: JSON.stringify([{"nama":"All New Accord 2.0 RS e:HEV e CVT","harga":999000000}]) },
    ];

    const insertMobil = db.prepare(`INSERT INTO mobil (nama, kategori, harga, transmisi, kapasitas, mesin, foto, warna, fitur, deskripsi, tipe) VALUES (@nama, @kategori, @harga, @transmisi, @kapasitas, @mesin, @foto, @warna, @fitur, @deskripsi, @tipe)`);
    for (const m of mobil) insertMobil.run(m);

    const promo = [
      { judul: "DP Ringan Mulai 10%", deskripsi: "Dapatkan DP ringan hanya 10% untuk semua tipe Honda. Cicilan mulai dari Rp 3 jutaan.", diskon: "10%", kode: "HONDA10", gambar: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80", validUntil: "2026-07-31", warna: "bg-gradient-to-br from-honda-red to-orange-600" },
      { judul: "Trade In Bonus Rp 5 Juta", deskripsi: "Tukar tambah mobil lama Anda dan dapatkan bonus hingga Rp 5 juta untuk pembelian mobil baru.", diskon: "Rp 5 Juta", kode: "TRADEIN5", gambar: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80", validUntil: "2026-08-15", warna: "bg-gradient-to-br from-blue-600 to-purple-600" },
      { judul: "Gratis Servis 3 Tahun", deskripsi: "Nikmati gratis biaya jasa servis selama 3 tahun atau 30.000 km untuk pembelian bulan ini.", diskon: "Gratis", kode: "SERVIS3", gambar: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80", validUntil: "2026-09-01", warna: "bg-gradient-to-br from-emerald-600 to-teal-600" },
    ];

    const insertPromo = db.prepare(`INSERT INTO promo (judul, deskripsi, diskon, kode, gambar, validUntil, warna) VALUES (@judul, @deskripsi, @diskon, @kode, @gambar, @validUntil, @warna)`);
    for (const p of promo) insertPromo.run(p);

    const testimoni = [
      { nama: "Budi Santoso", rating: 5, komentar: "Pelayanan sangat memuaskan! Proses pembelian cepat dan staf sangat membantu. Honda CR-V baru saya luar biasa!", foto: "https://i.pravatar.cc/150?img=11", mobil: "Honda CR-V", tanggal: "2026-05-15" },
      { nama: "Siti Rahmawati", rating: 5, komentar: "Pengalaman test drive sangat menyenangkan. Salesnya ramah dan profesional. Akhirnya saya memilih Honda HR-V.", foto: "https://i.pravatar.cc/150?img=5", mobil: "Honda HR-V", tanggal: "2026-05-20" },
      { nama: "Ahmad Fauzi", rating: 4, komentar: "Proses kredit cepat dan mudah. DP ringan, cicilan terjangkau. Rekomendasi untuk yang mau beli mobil baru.", foto: "https://i.pravatar.cc/150?img=12", mobil: "Honda Brio", tanggal: "2026-06-01" },
      { nama: "Dewi Lestari", rating: 5, komentar: "Saya melakukan trade in mobil lama dan prosesnya sangat transparan. Harga appraisal sesuai ekspektasi.", foto: "https://i.pravatar.cc/150?img=9", mobil: "Honda Civic RS", tanggal: "2026-06-05" },
      { nama: "Rudi Hermawan", rating: 5, komentar: "Showroomnya mewah, pelayanan bintang 5. Honda Accord baru saya benar-benar impian jadi kenyataan.", foto: "https://i.pravatar.cc/150?img=33", mobil: "Honda Accord", tanggal: "2026-06-08" },
      { nama: "Maya Indah", rating: 4, komentar: "Layanan purna jual yang baik. Servis rutin selalu diingatkan oleh tim Honda. Sangat merekomendasikan!", foto: "https://i.pravatar.cc/150?img=23", mobil: "Honda BR-V", tanggal: "2026-06-10" },
    ];

    const insertTestimoni = db.prepare(`INSERT INTO testimoni (nama, rating, komentar, foto, mobil, tanggal) VALUES (@nama, @rating, @komentar, @foto, @mobil, @tanggal)`);
    for (const t of testimoni) insertTestimoni.run(t);

    const berita = [
      { judul: "Honda Auto Expo 2026 Digelar di Yogyakarta, Pamerkan Deretan Mobil Hybrid", kategori: "Event", tanggal: "2026-06-12", gambar: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&q=80", excerpt: "<p>Honda kembali menyapa masyarakat Yogyakarta melalui <strong>Honda Auto Expo 2026</strong> di Plaza Ambarrukmo pada 9–14 Juni 2026. Pameran ini menampilkan jajaran mobil hybrid (e:HEV) seperti HR-V, STEP WGN, Civic RS, dan CR-V. Pengunjung bisa mendapatkan program penjualan eksklusif seperti bunga 0%, DP mulai 15%, dan gratis paket perawatan hingga 4 tahun.</p>" },
      { judul: "Honda Serah Terima Prelude ke 20 Konsumen Pertama", kategori: "Berita", tanggal: "2026-05-23", gambar: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80", excerpt: "<p>PT Honda Prospect Motor resmi menyerahkan <strong>Honda Prelude</strong> kepada 20 konsumen pertama di Indonesia. Dibanderol Rp 974,9 juta, hanya 150 unit dialokasikan untuk 2026. Pemesanan sudah mencapai 287 unit, sisanya akan dipenuhi 2027. Prelude hadir sebagai sport coupe hybrid dengan mesin 2.000 LFC dan motor listrik 181 hp, total tenaga 200 hp.</p>" },
      { judul: "Honda Super One EV Mungil Meluncur di GIIAS 2026", kategori: "Berita", tanggal: "2026-07-30", gambar: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80", excerpt: "<p>Honda akan meluncurkan mobil listrik kompak <strong>Honda Super One</strong> di GIIAS 2026 (30 Juli – 9 Agustus 2026) di ICE BSD City. Harganya diperkirakan Rp 320 juta. Pada tahun pertama, hanya 100 unit tersedia dengan pengiriman mulai September 2026. Ini menandai langkah Honda menghadirkan EV yang lebih terjangkau di Indonesia.</p>" },
      { judul: "Honda Hadir di IIMS Surabaya 2026 dengan Program MAYgic", kategori: "Event", tanggal: "2026-05-26", gambar: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80", excerpt: "<p>Honda Surabaya Center menghadirkan line-up hybrid di IIMS Surabaya 2026 (26–31 Mei 2026). Mengusung tema <strong>\"Power for Every Drive, Start with Trust\"</strong>, Honda menampilkan STEP WGN e:HEV, HR-V RS e:HEV, CR-V RS e:HEV, WR-V RS, dan Brio Satya Special Edition. Program MAYgic Honda memberikan paket perawatan hingga 4 tahun/50.000 km.</p>" },
      { judul: "Honda Prelude Kena Goreng Harga, Tembus Rp 1,4 Miliar", kategori: "Berita", tanggal: "2026-06-12", gambar: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80", excerpt: "<p>Honda Prelude mengalami fenomena <strong>goreng harga</strong> di pasar sekunder. Sebuah unit baru muncul di situs jual beli dengan harga Rp 1,4 miliar — selisih Rp 400 juta dari harga resmi Rp 974,9 juta. HPM telah menyiapkan mekanisme pemesanan ketat dengan melarang perubahan nama pada faktur dan STNK setelah konfirmasi jadwal pengiriman.</p>" },
    ];

    const insertBerita = db.prepare(`INSERT INTO berita (judul, kategori, tanggal, gambar, excerpt) VALUES (@judul, @kategori, @tanggal, @gambar, @excerpt)`);
    for (const b of berita) insertBerita.run(b);

    const gallery = [
      { judul: "Showroom Utama", kategori: "Showroom", gambar: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80" },
      { judul: "Area Display Unit", kategori: "Display", gambar: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80" },
      { judul: "Serah Terima Kendaraan", kategori: "Serah Terima", gambar: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80" },
      { judul: "Bengkel Resmi", kategori: "Bengkel", gambar: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80" },
      { judul: "Ruang Tunggu Premium", kategori: "Showroom", gambar: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
      { judul: "Area Test Drive", kategori: "Test Drive", gambar: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80" },
      { judul: "Tim Sales Profesional", kategori: "Tim", gambar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" },
      { judul: "Interior Showroom", kategori: "Showroom", gambar: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80" },
      { judul: "Area Penjualan", kategori: "Display", gambar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
    ];

    const insertGallery = db.prepare(`INSERT INTO gallery (judul, kategori, gambar) VALUES (@judul, @kategori, @gambar)`);
    for (const g of gallery) insertGallery.run(g);

    const keunggulan = [
      { icon: "Building2", title: "Dealer Resmi", desc: "Authorized dealer resmi Honda dengan standar layanan internasional." },
      { icon: "ShieldCheck", title: "Garansi Resmi", desc: "Garansi pabrik resmi hingga 5 tahun untuk ketenangan berkendara." },
      { icon: "Wallet", title: "Kredit Mudah", desc: "Proses pengajuan kredit cepat dengan bunga kompetitif dan DP ringan." },
      { icon: "RefreshCw", title: "Trade In", desc: "Tukar tambah mobil lama dengan penilaian harga terbaik dan transparan." },
      { icon: "Wrench", title: "Servis Berkala", desc: "Layanan servis resmi dengan teknisi ahli dan peralatan modern." },
      { icon: "Car", title: "Test Drive Gratis", desc: "Rasakan pengalaman berkendara langsung sebelum memutuskan membeli." },
    ];

    const insertKeunggulan = db.prepare(`INSERT INTO keunggulan (icon, title, desc) VALUES (@icon, @title, @desc)`);
    for (const k of keunggulan) insertKeunggulan.run(k);
  }

  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
  if (settingsCount.count === 0) {
    const defaultSettings = [
      ['hero_title', 'Temukan Honda Impian Anda Hari Ini'],
      ['hero_subtitle', 'Promo terbaik, kredit mudah, dan layanan terpercaya dari dealer resmi Honda. Dapatkan mobil impian Anda sekarang!'],
      ['hero_image', 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=1920&q=85'],
      ['contact_alamat', 'Jl. Sudirman No. 123, Jakarta Pusat 10220'],
      ['contact_telepon', '(021) 1234-5678'],
      ['contact_whatsapp', '+62 812-3456-7890'],
      ['contact_email', 'info@honda-dealer.id'],
      ['contact_jam', 'Sen-Sab 08:00-20:00 | Min 09:00-17:00'],
      ['contact_maps_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.865059!3d-6.175192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJakarta!5e0!3m2!1sen!2sid!4v1'],
      ['contact_maps_label', 'Jakarta Pusat'],
      ['footer_about', 'Dealer resmi Honda terpercaya dengan layanan terbaik. Dapatkan mobil impian Anda bersama kami dengan proses mudah dan cepat.'],
      ['footer_tagline', 'Designed with passion for Honda enthusiasts'],
      ['productgrid_badge', 'Pilihan Mobil Honda'],
      ['productgrid_title', 'Jelajahi Koleksi'],
      ['productgrid_title_hl', 'Kami'],
      ['productgrid_desc', 'Temukan mobil yang sesuai dengan gaya hidup Anda. Dari city car hingga SUV keluarga.'],
      ['promo_badge', 'Promo Spesial'],
      ['promo_title', 'Penawaran'],
      ['promo_title_hl', 'Terbatas'],
      ['promo_desc', 'Jangan lewatkan promo spesial dari kami. Periode terbatas, kesempatan terbatas!'],
      ['keunggulan_badge', 'Mengapa Memilih Kami'],
      ['keunggulan_title', 'Keunggulan'],
      ['keunggulan_title_hl', 'Kami'],
      ['keunggulan_desc', 'Kami berkomitmen memberikan layanan terbaik untuk setiap pelanggan.'],
      ['testimoni_badge', 'Testimonial'],
      ['testimoni_title', 'Apa Kata'],
      ['testimoni_title_hl', 'Pelanggan Kami'],
      ['testimoni_desc', 'Kepuasan pelanggan adalah prioritas utama kami.'],
      ['berita_badge', 'Berita & Artikel'],
      ['berita_title', 'Informasi'],
      ['berita_title_hl', 'Terkini'],
      ['berita_desc', 'Dapatkan informasi terbaru seputar Honda dan dunia otomotif.'],
      ['gallery_badge', 'Galeri'],
      ['gallery_title', 'Galeri'],
      ['gallery_title_hl', 'Dealer Kami'],
      ['gallery_desc', 'Lihat langsung suasana dealer dan fasilitas kami.'],
      ['kredit_badge', 'Simulasi Kredit'],
      ['kredit_title', 'Hitung Cicilan'],
      ['kredit_title_hl', 'Mobil Impian'],
      ['kredit_desc', 'Gunakan kalkulator kredit untuk mengetahui estimasi cicilan bulanan Anda.'],
      ['kredit_button', 'Ajukan Kredit Sekarang'],
      ['testdrive_badge', 'Booking Test Drive'],
      ['testdrive_title', 'Rasakan Langsung'],
      ['testdrive_title_hl', 'Pengalaman Berkendara'],
      ['testdrive_desc', 'Isi form di bawah untuk menjadwalkan test drive mobil Honda impian Anda.'],
      ['testdrive_button', 'Jadwalkan Test Drive'],
      ['testdrive_success_title', 'Berhasil Terdaftar!'],
      ['testdrive_success_desc', 'Kami akan menghubungi Anda untuk konfirmasi jadwal test drive.'],
      ['testdrive_book_again', 'Booking Lagi'],
      ['tradein_badge', 'Trade In'],
      ['tradein_title', 'Tukar Tambah'],
      ['tradein_title_hl', 'Mobil Anda'],
      ['tradein_desc', 'Dapatkan penilaian terbaik untuk mobil lama Anda. Proses cepat dan transparan.'],
      ['tradein_button', 'Dapatkan Estimasi Harga'],
      ['tradein_success_title', 'Data Terkirim!'],
      ['tradein_success_desc', 'Tim kami akan menghubungi Anda dalam 1x24 jam untuk memberikan estimasi harga.'],
      ['tradein_apply_again', 'Ajukan Lagi'],
      ['social_facebook', 'https://facebook.com'],
      ['social_instagram', 'https://instagram.com'],
      ['social_youtube', 'https://youtube.com'],
      ['social_twitter', 'https://twitter.com'],
      ['logo_text', 'Honda'],
      ['logo_text_hl', 'Dealer'],
      ['logo_subtitle', 'Authorized Dealer Resmi'],
      ['logo_initial', 'H'],
      ['logo_image', ''],
      ['nav_items', JSON.stringify([
        { label: 'Beranda', href: '#beranda' },
        { label: 'Mobil Honda', href: '#mobil' },
        { label: 'Promo', href: '#promo' },
        { label: 'Simulasi Kredit', href: '#kredit' },
        { label: 'Trade In', href: '#tradein' },
        { label: 'Test Drive', href: '#testdrive' },
        { label: 'Berita', href: '#berita' },
        { label: 'Tentang Kami', href: '#tentang' },
        { label: 'Kontak', href: '#kontak' },
      ])],
    ];
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    for (const [key, value] of defaultSettings) insertSetting.run(key, value);
  }

  console.log('Database seeded successfully');
}

function ensureColumn(table, column, def) {
  const col = db.pragma(`table_info(${table})`).find(c => c.name === column);
  if (!col) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
}

const initMobil = `CREATE TABLE IF NOT EXISTS mobil (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL, kategori TEXT, harga INTEGER, transmisi TEXT,
  kapasitas INTEGER, mesin TEXT, foto TEXT, warna TEXT, fitur TEXT, deskripsi TEXT, tipe TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const initPromo = `CREATE TABLE IF NOT EXISTS promo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judul TEXT, deskripsi TEXT, diskon TEXT, kode TEXT,
  gambar TEXT, validUntil TEXT, warna TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const initTestimoni = `CREATE TABLE IF NOT EXISTS testimoni (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT, rating INTEGER, komentar TEXT, foto TEXT, mobil TEXT, tanggal TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const initBerita = `CREATE TABLE IF NOT EXISTS berita (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judul TEXT, kategori TEXT, tanggal TEXT, gambar TEXT, excerpt TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const initGallery = `CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judul TEXT, kategori TEXT, gambar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const initKeunggulan = `CREATE TABLE IF NOT EXISTS keunggulan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT, title TEXT, desc TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const initSettings = `CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL, value TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const initUsers = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, nama TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

db.exec(initSettings);
db.exec(initUsers);
db.exec(initMobil);
db.exec(initPromo);
db.exec(initTestimoni);
db.exec(initBerita);
db.exec(initGallery);
db.exec(initKeunggulan);

['mobil', 'promo', 'testimoni', 'berita', 'gallery', 'keunggulan'].forEach(t => ensureColumn(t, 'sort_order', 'INTEGER DEFAULT 0'));
ensureColumn('mobil', 'tipe', 'TEXT');

seedDatabase();

export default db;
