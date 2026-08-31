import os
import shutil
import re

# Path ke pos_web/app/page.tsx
web_page_path = "../pos_web/app/page.tsx" if os.path.exists("../pos_web/app/page.tsx") else "pos_web/app/page.tsx"

if not os.path.exists(web_page_path):
    curr = os.getcwd()
    candidate = os.path.abspath(os.path.join(curr, "..", "pos_web", "app", "page.tsx"))
    if os.path.exists(candidate):
        web_page_path = candidate

if os.path.exists(web_page_path):
    shutil.copy(web_page_path, web_page_path + ".bak_pricing_prices")
    with open(web_page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex untuk mengganti seksi pricing lama dengan yang memuat harga riil
    old_section_pattern = r'{\/\* PRICING & FEATURE TIER COMPARISON SECTION.*?<\/section>'
    
    new_pricing_section_with_prices = '''{/* PRICING & FEATURE TIER COMPARISON SECTION (WITH TRANSPARENT PRICING) */}
        <section className="relative py-24 px-4 sm:px-8 border-b border-slate-800/80 bg-slate-950/60 overflow-hidden">
          {/* Latar Belakang Cahaya Interaktif */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-6xl mx-auto space-y-14 relative z-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Pilihan Paket & Investasi
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Pilihan Paket Transparan Tanpa Biaya Tersembunyi
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                Beli putus software kasir desktop seumur hidup dengan bonus layanan cloud online di tahun pertama.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              
              {/* TIER 1: NATA POS PRO v1.0 */}
              <div className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-900/60 group">
                <div className="space-y-4">
                  <div className="inline-block bg-slate-800 text-slate-300 text-[11px] font-bold px-3 py-1 rounded-lg border border-slate-700">
                    STANDALONE (1 KASIR)
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors">NATA POS PRO</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">Solusi teruji untuk 1 komputer kasir di toko ritel, minimarket, ATK, fotokopi, atau agen mandiri.</p>
                  </div>

                  {/* Blok Harga */}
                  <div className="pt-2 pb-1 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-white">Rp 1.250.000</span>
                      <span className="text-xs text-slate-400 font-medium">/ sekali bayar</span>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold p-2.5 rounded-xl leading-relaxed">
                      🎁 <b>Bonus:</b> Gratis 1 Tahun Pertama Layanan Cloud Web HP & WhatsApp Gateway!
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 space-y-3 text-xs text-slate-300 font-medium">
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>1 Komputer Kasir Utama</b> (Milik Selamanya)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>100% Tetap Berjalan Tanpa Internet</b></span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Penjualan Barang Ritel & Order Jasa 2-in-1</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>QRIS Dinamis Otomatis</b> (Anti-Salah Transfer)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Cetak Struk Thermal & Logo Toko Jelas</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Kirim E-Nota Digital ke WhatsApp Pembeli</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Web Dashboard Pantau Omzet 24 Jam</b></span></div>
                    <div className="flex items-center gap-2.5 text-slate-500"><X className="w-4 h-4 text-slate-600 shrink-0" /> <span>Multi-Kasir Jaringan Lokal (WiFi/LAN)</span></div>
                    <div className="flex items-center gap-2.5 text-slate-500"><X className="w-4 h-4 text-slate-600 shrink-0" /> <span>Layar Monitor Pengerjaan Pesanan (Workshop)</span></div>
                  </div>
                </div>

                <a
                  href="https://wa.me/6285163193387?text=Halo%20NataPOS,%20saya%20tertarik%20dengan%20Paket%20NATA%20POS%20PRO%20(Rp%201.250.000)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-2xl text-xs transition duration-200 border border-slate-700 block shadow-sm"
                >
                  Pilih Paket Pro
                </a>
              </div>

              {/* TIER 2: NATA POS ENTERPRISE v2.0 (BEST VALUE & HIGHLIGHT GLOW) */}
              <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/50 border-2 border-indigo-500 hover:border-indigo-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl shadow-indigo-950/60 relative lg:-translate-y-3 transition-all duration-300 hover:-translate-y-4 group">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 text-white font-black text-[10px] tracking-wider uppercase px-4 py-1 rounded-full shadow-lg">
                  ⭐ PALING POPULER / REKOMENDASI
                </div>

                <div className="space-y-4">
                  <div className="inline-block bg-indigo-500/20 text-indigo-300 text-[11px] font-bold px-3 py-1 rounded-lg border border-indigo-500/30">
                    MULTI-TERMINAL & WORKSHOP
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                      NATA POS ENTERPRISE
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">Solusi lengkap untuk percetakan, swalayan, atau ruko bertingkat dengan ruang produksi terpisah.</p>
                  </div>

                  {/* Blok Harga */}
                  <div className="pt-2 pb-1 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-white">Rp 2.450.000</span>
                      <span className="text-xs text-slate-400 font-medium">/ lisensi server</span>
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold p-2.5 rounded-xl leading-relaxed">
                      🎁 <b>Bonus:</b> Gratis 1 Tahun Pertama Cloud Sync, Portal WiFi, Live Workshop & WA Gateway!
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 space-y-3 text-xs text-slate-200 font-medium">
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Semua Fitur Versi Pro Lengkap</b></span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Multi-Kasir Jaringan Lokal</b> (Kasir 1, 2, 3 terhubung)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Portal Kelola Produk & Omzet via WiFi</b></span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Layar Monitor Antrean Produksi</b> (Bel Notifikasi 🔔)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Notifikasi WhatsApp Otomatis</b> saat pesanan selesai</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Buku Piutang Terpusat</b> & Peringatan Hutang Pelanggan</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Pindai Server Otomatis (Tanpa Atur IP Manual)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Harga Pokok (HPP) Rata-Rata Otomatis</span></div>
                  </div>
                </div>

                <a
                  href="https://wa.me/6285163193387?text=Halo%20NataPOS,%20saya%20ingin%20memilih%20Paket%20NATA%20POS%20ENTERPRISE%20(Rp%202.450.000)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 rounded-2xl text-xs transition duration-200 shadow-xl shadow-indigo-600/40 block"
                >
                  Pilih Paket Enterprise 🚀
                </a>
              </div>

              {/* TIER 3: CUSTOM MULTI-CABANG / FRANCHISE */}
              <div className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-900/60 group">
                <div className="space-y-4">
                  <div className="inline-block bg-purple-500/20 text-purple-300 text-[11px] font-bold px-3 py-1 rounded-lg border border-purple-500/30">
                    FRANCHISE & MULTI-CABANG
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">CUSTOM FRANCHISE</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">Untuk pemilik banyak cabang toko dengan laporan omzet konsolidasi terpusat.</p>
                  </div>

                  {/* Blok Harga */}
                  <div className="pt-2 pb-1 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-white">Mulai Rp 4.9jt</span>
                      <span className="text-xs text-slate-400 font-medium">/ sesuai skala cabang</span>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold p-2.5 rounded-xl leading-relaxed">
                      ☁️ <b>Dedicated:</b> Server Database Cloud Mandiri & Setup Private Gateway!
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 space-y-3 text-xs text-slate-300 font-medium">
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Semua Fitur Enterprise Lengkap</b></span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Laporan Keuangan Konsolidasi Multi-Cabang</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Mutasi Stok Antar-Cabang Terpusat</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Server & Database Dedicated Mandiri</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>WhatsApp Gateway Server VPS Sendiri</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Prioritas Dukungan Teknis Langsung 24/7</span></div>
                  </div>
                </div>

                <a
                  href="https://wa.me/6285163193387?text=Halo%20NataPOS,%20saya%20ingin%20konsultasi%20Kustomisasi%20Multi-Cabang%20/%20Franchise."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-2xl text-xs transition duration-200 border border-slate-700 block shadow-sm"
                >
                  Konsultasi Khusus Franchise
                </a>
              </div>

            </div>

            {/* KOTAK TRANSPARANSI KEBIJAKAN BIAYA */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl max-w-4xl mx-auto text-center space-y-2 text-xs text-slate-400 shadow-xl">
              <p className="font-extrabold text-slate-200 text-sm flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Transparansi & Jaminan Kepemilikan Software:
              </p>
              <p className="leading-relaxed">
                Software kasir desktop NATA POS berstatus <b>Beli-Putus (Hak Milik Seumur Hidup)</b> dan tetap dapat digunakan transaksi offline selamanya tanpa biaya sewa aplikasi. 
                Layanan Cloud Web Dashboard HP & WhatsApp Gateway gratis selama 1 tahun pertama. Perpanjangan server cloud di tahun ke-2 sangat terjangkau (hanya Rp 250.000 – Rp 350.000 / tahun). Jika tidak diperpanjang, aplikasi kasir desktop tetap aktif 100% selamanya.
              </p>
            </div>
          </div>
        </section>'''

    new_content = re.sub(old_section_pattern, new_pricing_section_with_prices, content, flags=re.DOTALL)
    
    with open(web_page_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"✅ SUKSES! Seksi Harga Transparan & Kotak Kebijakan Beli-Putus berhasil disematkan di: {web_page_path}")
else:
    print(f"❌ File tidak ditemukan: {web_page_path}")