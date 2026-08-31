import os
import shutil

# Path ke pos_web/app/page.tsx
web_page_path = "../pos_web/app/page.tsx" if os.path.exists("../pos_web/app/page.tsx") else "pos_web/app/page.tsx"

if not os.path.exists(web_page_path):
    curr = os.getcwd()
    candidate = os.path.abspath(os.path.join(curr, "..", "pos_web", "app", "page.tsx"))
    if os.path.exists(candidate):
        web_page_path = candidate

if os.path.exists(web_page_path):
    shutil.copy(web_page_path, web_page_path + ".bak_card_backup")
    with open(web_page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Teks lama yang ingin diganti
    old_text = "Database lokal otomatis dicadangkan setiap hari dengan proteksi anti-manipulasi jam komputer (Anti-Rollback Protection)."
    
    # Teks baru yang lebih elegan dan fokus pada proteksi menyeluruh
    new_text = "Database lokal dan cloud otomatis dicadangkan setiap hari sehingga data transaksi dan riwayat toko Anda selalu aman dari berbagai skenario gangguan."

    if old_text in content:
        content = content.replace(old_text, new_text)
        with open(web_page_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ SUKSES! Deskripsi kartu Backup & Keamanan berhasil diperbarui di: {web_page_path}")
    else:
        print("⚠️ Teks target tidak ditemukan persis. Mencoba pencarian parsial...")
        # Fallback pencarian parsial
        if "Anti-Rollback Protection" in content:
            import re
            pattern = r'<p className="text-slate-400">Database lokal otomatis dicadangkan.*?</p>'
            replacement = f'<p className="text-slate-400">{new_text}</p>'
            content = re.sub(pattern, replacement, content)
            with open(web_page_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ SUKSES via pattern match! Deskripsi kartu berhasil diperbarui.")
        else:
            print("❌ Gagal menemukan blok kartu Auto-Backup.")
else:
    print(f"❌ File tidak ditemukan: {web_page_path}")