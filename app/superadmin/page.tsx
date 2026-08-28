'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ShieldCheck, 
  Store, 
  PlusCircle, 
  Search, 
  Copy, 
  ExternalLink, 
  Check, 
  Lock, 
  RefreshCw, 
  Power, 
  Layers,
  X,
  Phone,
  Key,
  Calendar,
  CheckCircle2,
  Users,
  Edit3,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function SuperadminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal Tambah Toko
  const [showAddModal, setShowAddModal] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pin, setPin] = useState('1234');
  const [authMode, setAuthMode] = useState<'PIN' | 'EMAIL'>('PIN');
  const [createdSuccess, setCreatedSuccess] = useState<any>(null);

  // Modal Edit Toko
  const [editingStore, setEditingStore] = useState<any | null>(null);
  const [editStoreName, setEditStoreName] = useState('');
  const [editStoreCode, setEditStoreCode] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPin, setEditPin] = useState('');
  const [editAuthMode, setEditAuthMode] = useState<'PIN' | 'EMAIL'>('PIN');
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Fetch All Stores
  const fetchAllStores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setStores(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllStores();
    }
  }, [isAuthenticated]);

  // Handle Login Master Founder via Server RPC
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const { data: isValid, error } = await supabase.rpc('verify_superadmin_password', {
        p_password: passInput.trim()
      });

      if (error || isValid !== true) {
        setErrorMsg('Password Master Founder salah!');
        setPassInput('');
      } else {
        setIsAuthenticated(true);
        setErrorMsg('');
      }
    } catch (err) {
      setErrorMsg('Gagal memverifikasi password master.');
    }
  };

  const handleNameChange = (val: string) => {
    setStoreName(val);
    const slug = val
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setStoreCode(slug);
  };

  const handleEditNameChange = (val: string) => {
    setEditStoreName(val);
  };

  // Submit Toko Baru
  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !storeCode) {
      alert('Nama Toko dan Store Code wajib diisi!');
      return;
    }

    try {
      const payload = {
        store_name: storeName.trim(),
        store_code: storeCode.trim().toUpperCase(),
        phone: phone.trim() || '-',
        address: address.trim() || '-',
        pin: pin.trim() || '1234',
        auth_mode: authMode,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('stores')
        .insert([payload])
        .select()
        .single();

      if (error) {
        alert('Gagal membuat toko: ' + error.message);
        return;
      }

      setCreatedSuccess(data);
      fetchAllStores();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Open Edit Modal
  const openEditModal = (store: any) => {
    setEditingStore(store);
    setEditStoreName(store.store_name || '');
    setEditStoreCode(store.store_code || '');
    setEditPhone(store.phone || '');
    setEditAddress(store.address || '');
    setEditPin(store.pin || '1234');
    setEditAuthMode(store.auth_mode === 'EMAIL' ? 'EMAIL' : 'PIN');
    setEditIsActive(store.is_active !== false);
  };

  // Save Edit Store
  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore || !editStoreName || !editStoreCode) {
      alert('Nama Toko dan Store Code wajib diisi!');
      return;
    }

    try {
      const payload = {
        store_name: editStoreName.trim(),
        store_code: editStoreCode.trim().toUpperCase(),
        phone: editPhone.trim() || '-',
        address: editAddress.trim() || '-',
        pin: editPin.trim() || '1234',
        auth_mode: editAuthMode,
        is_active: editIsActive,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('stores')
        .update(payload)
        .eq('id', editingStore.id);

      if (error) {
        alert('Gagal mengupdate toko: ' + error.message);
        return;
      }

      setSaveSuccessMsg(`Toko '${editStoreName}' berhasil diperbarui!`);
      setEditingStore(null);
      fetchAllStores();
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Hapus Toko Permanen (Cascade Clean Database)
  const handleDeleteStore = async (store: any) => {
    const confirmMsg = `⚠️ PERINGATAN HAPUS PERMANEN!\n\nApakah Anda yakin ingin menghapus toko '${store.store_name}' (${store.store_code})?\n\nSeluruh data transaksi, produk, shift, dan keuangan cloud toko ini akan dihapus total.`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    const doubleCheck = prompt(`Ketik '${store.store_code}' untuk konfirmasi penghapusan permanen:`);
    if (doubleCheck !== store.store_code) {
      alert('Penghapusan dibatalkan. Kode toko tidak cocok.');
      return;
    }

    try {
      // Bersihkan data transaksi dan entitas anak
      await Promise.all([
        supabase.from('cloud_transaction_items').delete().eq('store_id', store.id),
        supabase.from('cloud_transactions').delete().eq('store_id', store.id),
        supabase.from('cloud_products').delete().eq('store_id', store.id),
        supabase.from('cloud_product_units').delete().eq('store_id', store.id),
        supabase.from('cloud_shift_logs').delete().eq('store_id', store.id),
        supabase.from('cloud_expenses').delete().eq('store_id', store.id),
        supabase.from('cloud_orders_jasa').delete().eq('store_id', store.id),
        supabase.from('cloud_customers').delete().eq('store_id', store.id),
        supabase.from('cloud_services').delete().eq('store_id', store.id),
      ]);

      // Hapus data toko di master tabel stores
      const { error } = await supabase.from('stores').delete().eq('id', store.id);

      if (error) {
        alert('Gagal menghapus toko: ' + error.message);
        return;
      }

      alert(`Toko '${store.store_name}' berhasil dihapus permanen dari database.`);
      fetchAllStores();
    } catch (err: any) {
      alert('Error saat menghapus: ' + err.message);
    }
  };

  const copyStoreLink = (code: string, id: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/${code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const copyUUID = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    setCopiedId(uuid);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-white">NATA POS Superadmin</h1>
          <p className="text-xs text-slate-400 mt-1 mb-6">Portal Khusus Founder & Manajemen Klien</p>

          <form onSubmit={handleAuth} className="space-y-3">
            <input
              type="password"
              placeholder="Masukkan Password Master..."
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 text-center font-bold"
              autoFocus
            />
            {errorMsg && <p className="text-xs text-rose-400 font-bold">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20"
            >
              Buka Portal Superadmin
            </button>
          </form>
          <p className="text-[11px] text-slate-500 mt-6">© 2026 Nata Developer Master Portal</p>
        </div>
      </div>
    );
  }

  const filteredStores = stores.filter(
    (s) =>
      s.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.store_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-lg">
            N
          </div>
          <div>
            <h1 className="font-extrabold text-base leading-none text-white flex items-center gap-2">
              NATA POS SUPERADMIN PORTAL
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                Founder Mode
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Pusat Manajemen Multi-Toko Klien NATA POS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllStores}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Power className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {saveSuccessMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {saveSuccessMsg}
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Toko Klien</p>
              <h3 className="text-3xl font-black text-white mt-1">{stores.length} Toko</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toko Aktif</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">
                {stores.filter((s) => s.is_active !== false).length} Aktif
              </h3>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Akses Cepat</p>
              <button
                onClick={() => {
                  setCreatedSuccess(null);
                  setShowAddModal(true);
                }}
                className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/30"
              >
                <PlusCircle className="w-4 h-4" /> + Daftarkan Toko Baru
              </button>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama toko, kode toko, atau nomor telepon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap font-medium">
            Menampilkan {filteredStores.length} dari {stores.length} toko
          </span>
        </div>

        {/* Stores Table */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                <tr>
                  <th className="px-5 py-4">Toko / Brand</th>
                  <th className="px-4 py-4">Kode Toko (URL)</th>
                  <th className="px-4 py-4">Kunci Store ID (UUID)</th>
                  <th className="px-4 py-4">PIN Akses</th>
                  <th className="px-4 py-4">Mode Login</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Kontak / Alamat</th>
                  <th className="px-5 py-4 text-center">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-medium">
                {filteredStores.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                      Tidak ada toko klien yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredStores.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/80 transition">
                      <td className="px-5 py-4">
                        <div className="font-extrabold text-sm text-white">{s.store_name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Dibuat: {new Date(s.created_at).toLocaleDateString('id-ID')}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2.5 py-1 rounded-lg border border-indigo-500/30">
                          {s.store_code}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-300 text-[11px]">
                            {s.id.substring(0, 13)}...
                          </span>
                          <button
                            onClick={() => copyUUID(s.id)}
                            title="Salin UUID Lengkap"
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition"
                          >
                            {copiedId === s.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-slate-900 text-slate-300 font-mono font-bold px-2 py-1 rounded border border-slate-700">
                          {s.pin || '1234'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.auth_mode === 'EMAIL' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {s.auth_mode || 'PIN'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.is_active !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {s.is_active !== false ? 'AKTIF' : 'NONAKTIF'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        <div>{s.phone || '-'}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{s.address || '-'}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => copyStoreLink(s.store_code, s.id)}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                            title="Salin Link Dashboard Klien"
                          >
                            {copiedId === s.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            Link
                          </button>
                          <a
                            href={`/${s.store_code}`}
                            target="_blank"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                            title="Buka Dashboard Toko Ini"
                          >
                            <ExternalLink className="w-3 h-3" /> Buka
                          </a>
                          <button
                            onClick={() => openEditModal(s)}
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                            title="Edit Data / Kode Toko"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStore(s)}
                            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                            title="Hapus Toko Permanen"
                          >
                            <Trash2 className="w-3 h-3" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL 1: TAMBAH TOKO BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-400" />
                Daftarkan Toko Klien Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdSuccess ? (
              <div className="space-y-4 text-xs">
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" /> Toko Berhasil Didaftarkan!
                  </div>
                  <p>Berikan Kunci Store ID ini kepada klien untuk dimasukkan ke aplikasi desktop:</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-slate-400">Nama Toko: <b className="text-white">{createdSuccess.store_name}</b></div>
                  <div className="text-slate-400">Store Code: <b className="text-indigo-400">{createdSuccess.store_code}</b></div>
                  <div className="text-slate-400">PIN Default: <b className="text-white">{createdSuccess.pin}</b></div>
                  <div className="text-slate-400 pt-1">Kunci Store ID (UUID):</div>
                  <div className="font-mono text-emerald-400 font-bold break-all bg-slate-900 p-2 rounded border border-slate-800">
                    {createdSuccess.id}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => copyUUID(createdSuccess.id)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition"
                  >
                    Salin Store ID
                  </button>
                  <button
                    onClick={() => {
                      setCreatedSuccess(null);
                      setShowAddModal(false);
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateStore} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300">Nama Toko / Brand:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Toko Berkah Jaya / Nata Printing"
                    value={storeName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300">Store Code (URL Kustom):</label>
                  <input
                    type="text"
                    required
                    placeholder="BERKAH-JAYA"
                    value={storeCode}
                    onChange={(e) => setStoreCode(e.target.value.toUpperCase().replace(/\s+/g, '-'))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-indigo-400 font-mono font-bold focus:outline-none focus:border-indigo-500 uppercase"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Link Klien: <code>natapos.vercel.app/{storeCode || 'KODE'}</code></p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-300">PIN Akses (4-6 Digit):</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-mono font-bold text-center focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300">Mode Proteksi:</label>
                    <select
                      value={authMode}
                      onChange={(e) => setAuthMode(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-bold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="PIN">Proteksi PIN Toko</option>
                      <option value="EMAIL">Login Email & Password</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300">No. WhatsApp Klien:</label>
                  <input
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300">Alamat Toko (Opsional):</label>
                  <input
                    type="text"
                    placeholder="Kota / Alamat lengkap..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition"
                  >
                    Daftarkan & Generate ID
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT DATA TOKO / KODE TOKO */}
      {editingStore && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Edit Data Toko / Kode Toko
              </h3>
              <button onClick={() => setEditingStore(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStore} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300">Nama Toko / Brand:</label>
                <input
                  type="text"
                  required
                  value={editStoreName}
                  onChange={(e) => handleEditNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300">Store Code (URL Kustom):</label>
                <input
                  type="text"
                  required
                  value={editStoreCode}
                  onChange={(e) => setEditStoreCode(e.target.value.toUpperCase().replace(/\s+/g, '-'))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-indigo-400 font-mono font-bold focus:outline-none focus:border-indigo-500 uppercase"
                />
                <p className="text-[10px] text-slate-500 mt-1">Link Klien: <code>natapos.vercel.app/{editStoreCode}</code></p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-300">PIN Akses Toko:</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={editPin}
                    onChange={(e) => setEditPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-mono font-bold text-center focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300">Status Toko:</label>
                  <select
                    value={editIsActive ? 'AKTIF' : 'NONAKTIF'}
                    onChange={(e) => setEditIsActive(e.target.value === 'AKTIF')}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-bold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="AKTIF">🟢 Aktif</option>
                    <option value="NONAKTIF">🔴 Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300">Mode Proteksi Login:</label>
                <select
                  value={editAuthMode}
                  onChange={(e) => setEditAuthMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-bold focus:outline-none focus:border-indigo-500"
                >
                  <option value="PIN">Proteksi PIN Toko</option>
                  <option value="EMAIL">Login Email & Password</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300">No. WhatsApp Klien:</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300">Alamat Toko:</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStore(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold shadow-lg transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
