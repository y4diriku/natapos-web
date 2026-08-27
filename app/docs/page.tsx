'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Printer, 
  MessageCircle, 
  ArrowLeft, 
  Zap, 
  ShoppingBag, 
  Layers, 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  Smartphone, 
  Keyboard, 
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { id: 'quickstart', label: '1. Mulai Cepat & Buka Toko', icon: Zap },
    { id: 'kasir-retail', label: '2. Kasir & Penjualan Ritel', icon: ShoppingBag },
    { id: 'percetakan-jasa', label: '3. Percetakan & Order Jasa', icon: Layers },
    { id: 'stok-hpp', label: '4. Stok, Multi-Satuan & HPP', icon: TrendingUp },
    { id: 'keuangan-shift', label: '5. Kas Laci & Tutup Shift', icon: Wallet },
    { id: 'whatsapp-gateway', label: '6. WhatsApp & Notifikasi', icon: MessageCircle },
    { id: 'cloud-sync', label: '7. Cloud Sync & Web Dashboard', icon: Smartphone },
    { id: 'superadmin', label: '8. Portal Superadmin Founder', icon: ShieldCheck },
    { id: 'keamanan-lisensi', label: '9. Keamanan & Lisensi Resmi', icon: ShieldCheck },
    { id: 'shortcuts', label: '10. Kamus Shortcut Keyboard', icon: Keyboard },
    { id: 'faq', label: '11. Solusi Masalah Populer (FAQ)', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans print:bg-white print:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <img src="/logo.png" alt="NATA POS" className="h-8 w-auto object-contain rounded" onError={(e:any)=>{e.target.style.display='none'}} />
          <div>
            <h1 className="font-extrabold text-base leading-tight text-white flex items-center gap-2">
              NATA POS PRO
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider">
                DOCS
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Pusat Bantuan & Panduan Resmi Pengguna</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari fitur / shortcut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-48 focus:w-64 transition-all"
            />
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak Panduan</span>
          </button>

          <a
            href="https://wa.me/6285163193387?text=Halo%20Developer%20NataPOS,%20saya%20ingin%20tanya%20panduan."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bantuan WA</span>
          </a>
        </div>
      </header>

      {/* Container */}
      <div className="max-w-7xl mx-auto flex">
        {/* Sticky Sidebar */}
        <aside className="hidden lg:block w-72 p-6 sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto border-r border-slate-200 bg-white/80 backdrop-blur-sm print:hidden">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">Daftar Isi Panduan</p>
          <nav className="space-y-1 text-xs font-semibold">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 transition group"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                  <span className="truncate">{sec.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-slate-900 text-white rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" /> NATA POS PRO
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Versi 1.0.0 (Native C++ Release 2026). Dirancang khusus untuk kemajuan UMKM ritel dan percetakan Indonesia.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-4xl space-y-8 print:p-0 print:space-y-6">
          
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 print:bg-none print:text-black print:p-0 print:shadow-none">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30">
              <BookOpen className="w-3.5 h-3.5" /> Panduan Pengoperasian Resmi
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Buku Panduan NATA POS PRO
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Panduan lengkap cara melayani transaksi cepat di kasir, menghitung spanduk meteran otomatis, pencatatan kas laci anti-selisih, hingga pantau omzet dari HP via Web Dashboard.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-bold">
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">⚡ Ritel & Percetakan</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">📱 QRIS Dinamis [Q]</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">☁️ Sinkronisasi 2 Arah</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">💵 Anti-Bocor Shift</span>
            </div>
          </div>

          {/* BAB 1: QUICK START */}
          <section id="quickstart" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">1</div>
              <h2 className="text-lg font-extrabold text-slate-900">Mulai Cepat & Pembukaan Shift Kasir</h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <h3 className="font-bold text-sm text-slate-900">1.1 Perbedaan Hak Akses Akun</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold text-[10px]">ROLE ADMIN</span>
                  <p className="font-bold text-slate-900 text-sm">Akses Penuh Pengelola</p>
                  <p className="text-slate-500">Mengubah harga, belanja stok (kulakan), melihat laporan laba rugi, mengatur WhatsApp, dan membuat akun staff.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">ROLE KASIR</span>
                  <p className="font-bold text-slate-900 text-sm">Meja Transaksi Kasir</p>
                  <p className="text-slate-500">Melayani transaksi pembeli, scan barcode, menerima pembayaran, menahan antrean, dan mencatat kas keluar operasional.</p>
                </div>
              </div>

              <h3 className="font-bold text-sm text-slate-900 pt-3">1.2 Membuka Shift Kasir (Input Modal Awal Laci)</h3>
              <p>Setiap kasir login di awal jam kerja, sistem otomatis memunculkan dialog <b>Buka Toko</b>:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Ketik jumlah uang fisik modal awal di laci kasir (contoh: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">50000</code>).</li>
                <li>Tekan <kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-[11px] font-bold">Enter</kbd> atau klik <b>BUKA TOKO</b>.</li>
                <li>Header kasir akan menyala hijau bertuliskan nama kasir: <span className="text-emerald-600 font-bold">Udin (OPEN)</span>.</li>
              </ol>

              <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div><b>Catatan Finansial:</b> Uang modal awal ini murni sebagai uang kembalian pembeli pertama dan <b>tidak dihitung sebagai omzet penjualan</b>, sehingga laporan laba rugi toko tetap bersih.</div>
              </div>

              <h3 className="font-bold text-sm text-slate-900 pt-2">1.3 Memilih 4 Tema Ergonomis Layar Kasir</h3>
              <p>Admin dapat memilih palet warna kasir yang paling nyaman untuk mata di menu <b>Pengaturan Toko &rarr; TEMA WARNA KASIR</b>:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><b>🌑 Matte Charcoal (Standar Supermarket):</b> Warna hitam arang doff elegan, bebas silau lampu toko.</li>
                <li><b>🌌 Nordic Steel (Abu-abu Baja Lembut):</b> Mengurangi radiasi cahaya biru, sangat sejuk untuk shift malam.</li>
                <li><b>⚪ Clean Studio Light (Putih Minimalis):</b> Nuansa terang bersih modern ala butik dan kafe.</li>
                <li><b>🔵 Classic Midnight Slate:</b> Tema biru dongker klasik bawaan sistem.</li>
              </ul>
            </div>
          </section>

          {/* BAB 2: KASIR & PENJUALAN RETAIL */}
          <section id="kasir-retail" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">2</div>
              <h2 className="text-lg font-extrabold text-slate-900">Operasional Kasir & Penjualan Ritel</h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <h3 className="font-bold text-sm text-slate-900">2.1 Scan Barcode & Fitur Pintar Multiplier Scan</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><b>Scan Standar:</b> Arahkan barcode scanner &rarr; Masuk 1 PCS dengan bunyi <i>beep</i> sukses.</li>
                <li><b>Scan Perkalian Cepat (Multiplier):</b> Ketik jumlah pengali diikuti tanda bintang <kbd>*</kbd> atau huruf <kbd>x</kbd>, lalu scan barcode:
                  <ul className="list-circle pl-5 mt-1 space-y-0.5 text-slate-600">
                    <li>Ketik <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-indigo-600">10*</code> lalu scan barcode &rarr; Masuk <b>10 PCS</b> sekaligus.</li>
                    <li>Ketik <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-indigo-600">5x</code> lalu scan barcode &rarr; Masuk <b>5 PCS</b>.</li>
                    <li>Ketik <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-indigo-600">1.5*</code> pada barang timbangan &rarr; Masuk <b>1,5 KG</b>.</li>
                  </ul>
                </li>
                <li><b>Smart Scanner Auto-Refocus:</b> Meskipun kursor kasir sedang berada di tabel atau tombol lain, kasir tidak perlu klik kotak barcode. Langsung scan barang, sistem otomatis memindahkan kursor ke kolom barcode!</li>
              </ul>

              <h3 className="font-bold text-sm text-slate-900 pt-3">2.2 Mengubah Qty & Pilihan Satuan (Dus / Renceng)</h3>
              <p>Kasir bisa mengklik 1 kali kotak putih di kolom <b>Qty</b> untuk langsung mengetik angka baru, atau tekan <kbd>F2</kbd>. Pada produk multi-satuan, klik dropdown di kolom <b>Satuan</b> untuk beralih antara <i>PCS</i>, <i>DUS</i>, atau <i>RENCENG</i>.</p>

              <h3 className="font-bold text-sm text-slate-900 pt-3">2.3 Memilih Customer / Pelanggan Ritel</h3>
              <p>Default pembeli adalah <b>Umum</b>. Jika pembeli adalah pelanggan tetap atau ingin dikirimi nota WhatsApp:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Klik tombol <b>+ Pelanggan</b> di atas kotak Total Tagihan (atau tekan shortcut <kbd>Alt</kbd> + <kbd>P</kbd>).</li>
                <li>Ketik nama/nomor WA di kolom pencarian &rarr; tekan <kbd>Enter</kbd> untuk memilih.</li>
                <li>Jika pelanggan baru, ketik Nama & No. WA di baris bawah dialog &rarr; klik <b>Simpan & Pilih</b>.</li>
                <li>Klik tombol merah <kbd>✕</kbd> jika ingin mereset kembali ke pelanggan Umum.</li>
              </ol>

              <h3 className="font-bold text-sm text-slate-900 pt-3">2.4 Pembayaran Lengkap & QRIS Dinamis [Q]</h3>
              <p>Tekan <kbd>Space</kbd> untuk membuka dialog pembayaran. Tersedia 4 tab metode bayar cepat:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-bold text-center">
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">1. TUNAI <span className="block text-[10px] text-slate-500 font-normal">[Alt+1] / F1-F4</span></div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">2. QRIS <span className="block text-[10px] text-slate-500 font-normal">[Alt+2] / Tekan Q</span></div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">3. TRANSFER <span className="block text-[10px] text-slate-500 font-normal">[Alt+3]</span></div>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">4. SPLIT <span className="block text-[10px] text-slate-500 font-normal">[Alt+4]</span></div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-start gap-2.5 mt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div><b>Fitur QRIS Dinamis:</b> Pada metode QRIS, tekan tombol <kbd>Q</kbd> untuk menampilkan QR Code. Nominal tagihan <b>otomatis terkunci di HP pembeli</b> tanpa pembeli perlu mengetik angka manual!</div>
              </div>
            </div>
          </section>

          {/* BAB 3: PERCETAKAN & JASA */}
          <section id="percetakan-jasa" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">3</div>
              <h2 className="text-lg font-extrabold text-slate-900">Modul Percetakan & Layanan Jasa (Custom Order)</h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <h3 className="font-bold text-sm text-slate-900">3.1 Buat Pesanan Cetak Meteran (<kbd>F3</kbd>)</h3>
              <p>Tekan <kbd>F3</kbd> di kasir untuk membuka kalkulator percetakan:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Pilih layanan cetak (misal: <i>Spanduk Flexi 280gr</i>).</li>
                <li>Ketik ukuran: <b>Panjang (P)</b> dan <b>Lebar (L)</b> dalam meter (misal: 3m x 1m = 3 m²). Sistem otomatis menerapkan minimum charge 1.00 m².</li>
                <li>Pilih opsi finishing (Mata Ayam / Selongsong) dan tentukan waktu janji ambil.</li>
                <li>Pilih <b>Jasa Langsung (Express)</b> untuk cetak kilat jadi di tempat, atau <b>Order Produksi (Antrean)</b> untuk pesanan yang ditinggal.</li>
              </ul>

              <h3 className="font-bold text-sm text-slate-900 pt-3">3.2 Aturan Proteksi Produksi Workshop</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 font-bold border-b border-slate-200">
                    <tr><th className="p-3">Status Bayar</th><th className="p-3">Kondisi DP</th><th className="p-3">Aturan Produksi Mesin</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr><td className="p-3 font-bold text-rose-600">BELUM BAYAR</td><td className="p-3">DP = Rp 0</td><td className="p-3 font-semibold text-rose-700">DIBLOKIR: Operator tidak boleh menyetel ke PROSES sebelum ada DP/Lunas.</td></tr>
                    <tr><td className="p-3 font-bold text-amber-600">DP (Uang Muka)</td><td className="p-3">DP &gt; Rp 0</td><td className="p-3 text-emerald-700 font-semibold">DIIZINKAN: Operator boleh naik cetak karena ada DP masuk.</td></tr>
                    <tr><td className="p-3 font-bold text-emerald-600">LUNAS</td><td className="p-3">Sisa = Rp 0</td><td className="p-3 text-slate-700 font-semibold">SIAP AMBIL: Barang boleh diserahkan ke pelanggan.</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-bold text-sm text-slate-900 pt-3">3.3 Alur Antrean & Notifikasi WA Selesai Otomatis</h3>
              <p>Pada tabel antrean produksi di bawah kasir, klik tombol <b>Opsi ▾</b>:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Cetak SPK Kerja:</b> Cetak tiket instruksi teknis untuk operator mesin workshop.</li>
                <li><b>Set SELESAI:</b> Menandai pesanan selesai dan <b>otomatis mengirim pesan WhatsApp ke pelanggan</b> bahwa barang siap diambil!</li>
                <li><b>Lunasi Sisa Tagihan:</b> Memindahkan pesanan ke kasir. Nama pelanggan otomatis terpasang di atas Total Tagihan kasir.</li>
              </ul>
            </div>
          </section>

          {/* BAB 4: INVENTORI & SMART HPP */}
          <section id="stok-hpp" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">4</div>
              <h2 className="text-lg font-extrabold text-slate-900">Manajemen Stok, Multi-Satuan & Smart HPP (Admin)</h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <h3 className="font-bold text-sm text-slate-900">4.1 Fitur Smart HPP saat Belanja Stok</h3>
              <p>Saat kulakan barang masuk dari supplier di tab <b>Belanja Stok</b>: jika harga beli dari supplier naik dibanding data lama, sistem otomatis memunculkan dialog <b>Peringatan Kenaikan HPP</b> dan memberikan rekomendasi harga jual baru agar margin keuntungan toko Anda tetap aman!</p>

              <h3 className="font-bold text-sm text-slate-900 pt-3">4.2 Stock Opname Mandiri</h3>
              <p>Jika ada barang rusak atau hilang, klik tombol <b>Stock Opname</b> pada produk yang bersangkutan. Sistem otomatis menyesuaikan stok fisik dan <b>mencatat nilai modal barang yang rusak tersebut ke dalam laporan beban kerugian toko</b> secara otomatis.</p>
            </div>
          </section>

          {/* BAB 5: KAS LACI & SHIFT */}
          <section id="keuangan-shift" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">5</div>
              <h2 className="text-lg font-extrabold text-slate-900">Kas Laci Kasir & Rekonsiliasi Shift</h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="p-3 bg-slate-900 text-indigo-300 font-mono rounded-xl">
                # FORMULA REKONSILIASI KAS LACI:<br/>
                Total Kas Seharusnya = Modal Awal + Penjualan Tunai + Kas Masuk - Kas Keluar
              </div>

              <h3 className="font-bold text-sm text-slate-900 pt-2">5.1 Tutup Shift Kasir</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Kasir klik tombol merah <b>Tutup Shift</b> di header atas kasir.</li>
                <li>Ketik jumlah total lembaran uang fisik yang ada di laci kasir.</li>
                <li>Sistem mendeteksi status selisih: <span className="text-emerald-600 font-bold">PAS (Rp 0)</span>, <span className="text-rose-600 font-bold">KURANG</span>, atau <span className="text-blue-600 font-bold">LEBIH</span>.</li>
                <li>Klik <b>Tutup Shift & Cetak Struk</b>. Printer kasir otomatis mencetak laporan fisik dan <b>rekap kas laci langsung terkirim ke WhatsApp Owner</b>!</li>
              </ol>
            </div>
          </section>

          {/* BAB 6: WHATSAPP GATEWAY */}
          <section id="whatsapp-gateway" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">6</div>
              <h2 className="text-lg font-extrabold text-slate-900">Integrasi WhatsApp Gateway & Notifikasi</h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div><b>Aktivasi WhatsApp Toko:</b> Kolom <i>URL Server</i> dan <i>API Key</i> pada saat instalasi awal dibiarkan kosong. Hubungi Tim Pengembang (<code>0851-6319-3387</code>) untuk dipandu menyambungkan nomor WhatsApp resmi toko Anda.</div>
              </div>

              <h3 className="font-bold text-sm text-slate-900 pt-2">6.1 Mengatur Nomor WA Owner</h3>
              <p>Buka menu <b>Admin &rarr; Pengaturan Toko &rarr; No. WA Owner (Live Rekap)</b>. Masukkan nomor WhatsApp pribadi Anda (contoh: <code>081234567890</code>) agar menerima laporan kas laci otomatis setiap shift ditutup.</p>
            </div>
          </section>

          {/* BAB 7: CLOUD SYNC & DASHBOARD */}
          <section id="cloud-sync" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">7</div>
              <h2 className="text-lg font-extrabold text-slate-900">Cloud Sync & Web Dashboard (2-Way Sync)</h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><b>Pantau Live dari HP:</b> Buka link web dashboard toko Anda dari browser HP untuk melihat grafik omzet, kas laci kasir, dan transaksi hari ini secara real-time.</li>
                <li><b>Edit Harga 2 Arah:</b> Ubah harga barang di tab <i>Katalog Produk</i> pada web dashboard &rarr; dalam waktu 30 detik, kasir desktop otomatis memperbarui harga tersebut!</li>
                <li><b>Indikator Kasir Online/Offline:</b> Web dashboard menampilkan status koneksi komputer kasir desktop secara otomatis.</li>
              </ul>
            </div>
          </section>

          {/* BAB 8: SUPERADMIN */}
          <section id="superadmin" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">8</div>
              <h2 className="text-lg font-extrabold text-slate-900">Portal Superadmin Khusus Founder (/superadmin)</h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p>Khusus Pengembang / Founder untuk mengelola puluhan toko klien dari satu pintu:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Buka rute <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-indigo-600">/superadmin</code> &rarr; Masukkan Password Master Founder.</li>
                <li>Daftarkan toko klien baru dalam 5 detik dengan <b>Store Code kustom</b> (misal: <code>BERKAH</code>, <code>NATA-PRINT</code>).</li>
                <li>Atur PIN akses default atau mode login email untuk klien.</li>
              </ul>
            </div>
          </section>

          {/* BAB 9: KEAMANAN & LISENSI */}
          <section id="keamanan-lisensi" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">9</div>
              <h2 className="text-lg font-extrabold text-slate-900">Keamanan, Backup & Lisensi Resmi</h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><b>Auto-Backup 30 File:</b> Database otomatis dicadangkan setiap aplikasi ditutup dan file usang dibersihkan otomatis.</li>
                <li><b>Proteksi Anti-Clock Rollback:</b> Sistem mengunci otomatis jika jam komputer dimundurkan secara sengaja.</li>
                <li><b>Aktivasi Kunci RSA-1024:</b> Salin Device ID di menu Aktivasi dan kirimkan ke tim NATA POS untuk mendapatkan kunci lisensi permanen resmi.</li>
              </ul>
            </div>
          </section>

          {/* BAB 10: SHORTCUTS */}
          <section id="shortcuts" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">10</div>
              <h2 className="text-lg font-extrabold text-slate-900">Kamus Cepat Shortcut Keyboard Kasir</h2>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold border-b border-slate-200">
                  <tr><th className="p-3 w-36">Tombol Pintasan</th><th className="p-3">Fungsi Operasional Kasir</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F1</kbd></td><td className="p-3">Cari Barang Katalog</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F2</kbd></td><td className="p-3">Ubah Kuantitas (Qty) Item</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F3</kbd></td><td className="p-3">Pemesanan Jasa / Percetakan</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F4</kbd></td><td className="p-3">Diskon Khusus Item</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F5</kbd></td><td className="p-3">Reprint Struk Transaksi Terakhir</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F6</kbd> / <kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F7</kbd></td><td className="p-3">Hold & Recall Antrean Belanja</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F8</kbd> / <kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F9</kbd></td><td className="p-3">Diskon Global & Void Keranjang</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F10</kbd></td><td className="p-3">Cetak Struk Fisik Thermal</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">F12</kbd></td><td className="p-3">Kirim E-Nota WhatsApp</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">Q</kbd></td><td className="p-3">Tampilkan QRIS Dinamis di Dialog Bayar</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">Alt</kbd> + <kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">P</kbd></td><td className="p-3">Direktori & Tambah Customer Cepat</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">Alt</kbd> + <kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">1..4</kbd></td><td className="p-3">Pilih Metode: Tunai, QRIS, Transfer, Split</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600"><kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5">Space</kbd></td><td className="p-3">Buka Dialog Pembayaran (Bayar)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* BAB 11: FAQ */}
          <section id="faq" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">11</div>
              <h2 className="text-lg font-extrabold text-slate-900">Solusi Masalah Populer (FAQ)</h2>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">❓ Printer thermal tidak merespons atau tidak mencetak struk?</p>
                <p className="text-slate-600">Buka menu <i>Admin &rarr; Pengaturan Toko</i>. Pastikan nama printer di baris <b>Nama Printer Windows</b> sesuai persis dengan nama printer di Control Panel Windows (contoh: <code>POS-58</code>), dan tipe koneksi disetel ke <code>win32</code>.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">❓ Apakah kasir desktop bisa dipakai saat toko offline tanpa internet?</p>
                <p className="text-slate-600"><b>100% Bisa!</b> Seluruh transaksi kasir, scan barcode, cetak printer, hitung meteran spanduk, dan tutup shift berjalan mandiri di komputer kasir. Begitu ada internet, data otomatis terunggah ke Cloud.</p>
              </div>
            </div>

            <footer className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
              © 2026 NATA POS PRO. All rights reserved.
            </footer>
          </section>

        </main>
      </div>
    </div>
  );
}