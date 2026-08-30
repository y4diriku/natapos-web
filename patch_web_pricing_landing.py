import os
import shutil

# Path relatif ke pos_web/app/page.tsx
web_page_path = "../pos_web/app/page.tsx" if os.path.exists("../pos_web/app/page.tsx") else "pos_web/app/page.tsx"

if not os.path.exists(web_page_path):
    # Coba cari di folder sejajar
    curr = os.getcwd()
    candidate = os.path.abspath(os.path.join(curr, "..", "pos_web", "app", "page.tsx"))
    if os.path.exists(candidate):
        web_page_path = candidate

if os.path.exists(web_page_path):
    shutil.copy(web_page_path, web_page_path + ".bak_pricing")
    with open(web_page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Anchor tempat penyisipan (Setelah Business Segment Section)
    anchor = "</section>\n\n        {/* Feature Highlights Matrix */}"
    
    pricing_section_html = '''</section>

        {/* PRICING & FEATURE TIER COMPARISON SECTION (v1.0 vs v2.0 Enterprise) */}
        <section className="py-20 px-4 sm:px-8 border-b border-slate-800/80 bg-slate-900/30">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                Pilihan Paket Fleksibel
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Pilih Versi yang Sesuai dengan Skala Usaha Anda
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Mulai dari toko mandiri satu kasir hingga jaringan percetakan modern multi-terminal dengan layar produksi workshop.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              
              {/* TIER 1: NATA POS PRO v1.0 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition">
                <div className="space-y-4">
                  <div className="inline-block bg-slate-800 text-slate-300 text-[11px] font-bold px-3 py-1 rounded-lg border border-slate-700">
                    STANDALONE SINGLE-PC
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">NATA POS PRO</h3>
                    <p className="text-xs text-slate-400 mt-1">Solusi teruji untuk 1 komputer kasir di toko ritel, ATK, fotokopi, atau agen mandiri.</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>1 Komputer Kasir</b> (Offline-First SQLite)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Fitur Ritel & Order Jasa 2-in-1</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>QRIS Dinamis Otomatis</b> (Tag 54 EMVCo)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Cetak Thermal HD (Smart Dithering Logo)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Kirim E-Nota Teks via WhatsApp</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Web Dashboard Pantau Omzet HP 24 Jam</span></div>
                    <div className="flex items-center gap-2.5 text-slate-500"><X className="w-4 h-4 text-slate-600 shrink-0" /> <span>Multi-Kasir Jaringan LAN (WiFi)</span></div>
                    <div className="flex items-center gap-2.5 text-slate-500"><X className="w-4 h-4 text-slate-600 shrink-0" /> <span>Layar Touchscreen Operator Workshop</span></div>
                  </div>
                </div>

                <a
                  href="https://wa.me/6285163193387?text=Halo%20NataPOS,%20saya%20tertarik%20dengan%20Paket%20NATA%20POS%20PRO%20(v1.0)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-xs transition border border-slate-700 block"
                >
                  Konsultasi Paket Pro
                </a>
              </div>

              {/* TIER 2: NATA POS ENTERPRISE v2.0 (HIGHLIGHT) */}
              <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border-2 border-indigo-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl shadow-indigo-950/50 relative lg:-translate-y-2">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-black text-[10px] tracking-wider uppercase px-4 py-1 rounded-full shadow-md">
                  ⭐ PALING POPULER / BEST VALUE
                </div>

                <div className="space-y-4">
                  <div className="inline-block bg-indigo-500/20 text-indigo-300 text-[11px] font-bold px-3 py-1 rounded-lg border border-indigo-500/30">
                    MULTI-TERMINAL LAN & WORKSHOP
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                      NATA POS ENTERPRISE
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">Solusi komplit untuk percetakan sibuk, swalayan, atau ruko dengan ruang produksi terpisah.</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2.5 text-xs text-slate-200 font-medium">
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Semua Fitur Versi Pro v1.0</b></span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Multi-Kasir LAN Server</b> (Kasir 1, 2, 3 terhubung)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Local Owner Web Portal (/portal)</b> kelola via WiFi</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Live Workshop Display (/workshop)</b> bunyi bel 🔔</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Auto-Notifikasi WhatsApp</b> saat operator klik Selesai</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Buku Piutang Terpusat</b> & Early Warning Hutang</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Zero-Config Discovery (Auto Scan IP Server)</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>HPP Moving Average Akuntansi Akurat</span></div>
                  </div>
                </div>

                <a
                  href="https://wa.me/6285163193387?text=Halo%20NataPOS,%20saya%20ingin%20memilih%20Paket%20NATA%20POS%20ENTERPRISE%20(v2.0)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 block"
                >
                  Pilih Paket Enterprise 🚀
                </a>
              </div>

              {/* TIER 3: CUSTOM MULTI-CABANG / FRANCHISE */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition">
                <div className="space-y-4">
                  <div className="inline-block bg-purple-500/20 text-purple-300 text-[11px] font-bold px-3 py-1 rounded-lg border border-purple-500/30">
                    FRANCHISE & MULTI-CABANG
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">CUSTOM FRANCHISE</h3>
                    <p className="text-xs text-slate-400 mt-1">Untuk pemilik banyak cabang toko dengan laporan keuangan konsolidasi terpusat.</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span><b>Semua Fitur Enterprise v2.0</b></span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Konsolidasi Laporan Multi-Cabang</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Mutasi Stok Antar-Cabang Terpusat</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Dedicated Cloud Server & Database</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Custom WhatsApp Gateway VPS Sendiri</span></div>
                    <div className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <span>Prioritas Dukungan Teknis 24/7</span></div>
                  </div>
                </div>

                <a
                  href="https://wa.me/6285163193387?text=Halo%20NataPOS,%20saya%20ingin%20konsultasi%20Kustomisasi%20Multi-Cabang%20/%20Franchise."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-xs transition border border-slate-700 block"
                >
                  Konsultasi Khusus Franchise
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* Feature Highlights Matrix */}'''

    if anchor in content:
        content = content.replace(anchor, pricing_section_html)
        with open(web_page_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ PATCH SUKSES! Seksi Perbandingan 3 Paket Produk berhasil disematkan di: {web_page_path}")
    else:
        print("⚠️ Anchor tidak ditemukan pada page.tsx.")
else:
    print(f"❌ File tidak ditemukan: {web_page_path}")