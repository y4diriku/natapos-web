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
  Info
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
    { id: 'keamanan-lisensi', label: '8. Keamanan & Lisensi Resmi', icon: ShieldCheck },
    { id: 'shortcuts', label: '9. Kamus Shortcut Keyboard', icon: Keyboard },
    { id: 'faq', label: '10. Solusi Masalah Populer (FAQ)', icon: HelpCircle },
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
            <p className="text-[11px] text-slate-400">Pusat Bantuan & Panduan Resmi Pengguna Toko</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              Panduan resmi pengoperasian sistem kasir cerdas & manajemen retail offline-first.
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
              Panduan lengkap cara melayani transaksi kasir cepat, hitung cetak spanduk meteran otomatis, pencatatan kas laci anti-selisih, hingga pantau omzet dari HP via Web Dashboard.
            </p>
          </div>

          {/* BAB 1: QUICK START */}
          <section id="quickstart" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">1</div>
              <h2 className="text-lg font-extrabold text-slate-900">Mulai Cepat & Pembukaan Shift Kasir</h2>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <h3 className="font-bold text-sm text-slate-900">1.1 Buka Shift Kasir</h3>
              <p>Setiap kasir login di awal jam kerja, masukkan modal awal di laci kasir (contoh: <code>50000</code>). Modal awal ini murni sebagai uang kembalian dan <b>tidak dihitung sebagai omzet penjualan</b>.</p>
            </div>
          </section>

          {/* BAB 2: KASIR */}
          <section id="kasir-retail" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">2</div>
              <h2 className="text-lg font-extrabold text-slate-900">Operasional Kasir & Penjualan Ritel</h2>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p>Scan barcode produk secara langsung atau gunakan fitur <b>Multiplier Scan</b> (ketik <code>5*</code> lalu scan untuk memasukkan 5 pcs sekaligus). Tekan <kbd className="bg-slate-100 border px-1.5 py-0.5 rounded">Space</kbd> untuk membuka pembayaran.</p>
            </div>
          </section>

          {/* BAB 3: PERCETAKAN & JASA */}
          <section id="percetakan-jasa" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">3</div>
              <h2 className="text-lg font-extrabold text-slate-900">Modul Percetakan & Layanan Jasa (Custom Order)</h2>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p>Tekan <kbd className="bg-slate-100 border px-1.5 py-0.5 rounded">F3</kbd> untuk membuat pesanan cetak meteran (Panjang x Lebar) dengan opsi DP dan estimasi waktu selesai.</p>
            </div>
          </section>

          {/* BAB 4: INVENTORI */}
          <section id="stok-hpp" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">4</div>
              <h2 className="text-lg font-extrabold text-slate-900">Manajemen Stok, Multi-Satuan & Smart HPP</h2>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p>Mendukung konversi satuan bertingkat (Dus/Pcs) dan peringatan kenaikan HPP saat belanja stok restock.</p>
            </div>
          </section>

          {/* BAB 5: KAS LACI */}
          <section id="keuangan-shift" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">5</div>
              <h2 className="text-lg font-extrabold text-slate-900">Kas Laci Kasir & Rekonsiliasi Shift</h2>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p>Formula Rekonsiliasi Kas: <b>Modal Awal + Penjualan Tunai + Kas Masuk - Kas Keluar</b>. Cetak struk shift dan kirim live rekap otomatis ke WhatsApp Owner.</p>
            </div>
          </section>

          {/* BAB 6: WHATSAPP */}
          <section id="whatsapp-gateway" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">6</div>
              <h2 className="text-lg font-extrabold text-slate-900">Integrasi WhatsApp & Notifikasi E-Nota</h2>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p>Kirim invoice digital otomatis, notifikasi pesanan selesai, dan laporan shift kasir via WhatsApp Gateway.</p>
            </div>
          </section>

          {/* BAB 7: CLOUD SYNC */}
          <section id="cloud-sync" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">7</div>
              <h2 className="text-lg font-extrabold text-slate-900">Cloud Sync & Web Dashboard (2-Way Sync)</h2>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p>Pantau omzet realtime dari smartphone. Ubah harga di web dashboard dan otomatis sinkron ke komputer kasir dalam hitungan detik.</p>
            </div>
          </section>

          {/* BAB 8: KEAMANAN & LISENSI */}
          <section id="keamanan-lisensi" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">8</div>
              <h2 className="text-lg font-extrabold text-slate-900">Keamanan, Auto-Backup & Lisensi Resmi</h2>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <p>Proteksi Anti-Rollback Jam, auto-backup 10 file rotasi, dan enkripsi lisensi asimetris RSA-1024.</p>
            </div>
          </section>

          {/* BAB 9: SHORTCUTS */}
          <section id="shortcuts" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">9</div>
              <h2 className="text-lg font-extrabold text-slate-900">Kamus Shortcut Keyboard Kasir</h2>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 font-bold border-b border-slate-200">
                  <tr><th className="p-3 w-36">Tombol</th><th className="p-3">Fungsi</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr><td className="p-3 font-mono font-bold text-indigo-600">F1</td><td className="p-3">Cari Barang Katalog</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600">F2</td><td className="p-3">Ubah Qty Item</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600">F3</td><td className="p-3">Order Cetak / Jasa Meteran</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600">Space</td><td className="p-3">Buka Pembayaran</td></tr>
                  <tr><td className="p-3 font-mono font-bold text-indigo-600">Q</td><td className="p-3">Tampilkan QRIS Dinamis</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* BAB 10: FAQ */}
          <section id="faq" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">10</div>
              <h2 className="text-lg font-extrabold text-slate-900">Solusi Masalah Populer (FAQ)</h2>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">❓ Apakah kasir desktop tetap bisa dipakai saat internet mati?</p>
                <p className="text-slate-600"><b>100% Bisa!</b> Sistem beroperasi penuh secara offline. Begitu koneksi internet kembali, data otomatis disinkronkan ke cloud.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
