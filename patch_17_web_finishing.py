import os
import shutil

web_path = r"../pos_web/app/[store]/page.tsx"
if os.path.exists(web_path):
    shutil.copy(web_path, web_path + ".bak_finishing")
    with open(web_path, 'r', encoding='utf-8') as f: content = f.read()
    
    # Memberikan Label Merah "KASBON" di Tabel Web Dashboard
    old_code = "<td className=\"px-4 py-3\"><span className=\"bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold\">{t.payment_method}</span></td>"
    new_code = """<td className="px-4 py-3">
                            {t.payment_method === 'KASBON' ? (
                                <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">🔴 HUTANG</span>
                            ) : (
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{t.payment_method}</span>
                            )}
                          </td>"""
                          
    if old_code in content:
        content = content.replace(old_code, new_code)
        with open(web_path, 'w', encoding='utf-8') as f: f.write(content)
        print("✅ WEB FINISHING SUKSES! Badge Kasbon merah telah terpasang di Web.")
    else:
        print("⚠️ Anchor web tidak ditemukan.")
else:
    print("⚠️ Folder pos_web tidak ditemukan. Jika belum ditarik ke PC ini, lewati langkah ini.")