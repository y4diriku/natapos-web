'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, 
  ShoppingBag, 
  Wallet, 
  Clock, 
  Search, 
  RefreshCw, 
  Edit3, 
  Check, 
  Layers, 
  CheckCircle2, 
  PlusCircle,
  DollarSign,
  PieChart,
  ArrowDownRight,
  ArrowUpRight,
  X,
  Lock,
  Mail,
  KeyRound,
  LogOut,
  Store,
  ShieldCheck,
  BookOpen,
  Smartphone
} from 'lucide-react';

export default function WebDashboard() {
  const [storeId, setStoreId] = useState<string>('');
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [isDesktopOnline, setIsDesktopOnline] = useState<boolean>(false);
  const [loadingStore, setLoadingStore] = useState<boolean>(true);

  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'PIN' | 'EMAIL'>('PIN');
  const [pinInput, setPinInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passInput, setPassInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'products' | 'shifts' | 'orders'>('overview');
  const [loading, setLoading] = useState(true);
  const [financePeriod, setFinancePeriod] = useState<'today' | '7days' | 'month' | 'all'>('month');

  // Stats
  const [stats, setStats] = useState({
    omzetToday: 0,
    trxCount: 0,
    profitEstimate: 0,
    activeShiftDrawer: 0,
  });

  const [financeSummary, setFinanceSummary] = useState({
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    operationalExpenses: 0,
    netProfit: 0,
  });

  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Modal Tambah Produk
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBarcode, setNewBarcode] = useState('');
  const [newName, setNewName] = useState('');
  const [newUnitType, setNewUnitType] = useState('PCS');
  const [newCost, setNewCost] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newStock, setNewStock] = useState<number>(0);
  const [newDiscount, setNewDiscount] = useState<number>(0);

  // 1. Inisialisasi Toko & Cek Sesi Kunci Tersimpan
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storeParam = params.get('store');
    const idParam = params.get('id') || params.get('store_id');

    const resolveStore = async () => {
      setLoadingStore(true);
      try {
        let storeData: any = null;

        if (storeParam) {
          const { data } = await supabase
            .from('stores')
            .select('*')
            .eq('store_code', storeParam.toUpperCase())
            .single();
          storeData = data;
        }

        if (!storeData) {
          const targetId = idParam || process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || '';
          if (targetId) {
            const { data } = await supabase
              .from('stores')
              .select('*')
              .eq('id', targetId)
              .single();
            storeData = data;
          }
        }

        if (storeData) {
          setStoreId(storeData.id);
          setStoreInfo(storeData);
          setAuthView(storeData.auth_mode === 'EMAIL' ? 'EMAIL' : 'PIN');

          // Cek apakah token PIN sudah tersimpan di browser ini
          const savedSession = localStorage.getItem(`natapos_unlocked_${storeData.id}`);
          if (savedSession === 'true') {
            setIsUnlocked(true);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStore(false);
      }
    };

    resolveStore();
  }, []);

  // 2. Fetch Seluruh Data Toko
  const fetchData = async () => {
    if (!storeId || !isUnlocked) return;
    try {
      // Cek Status Online Kasir
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

      if (storeData) {
        setStoreInfo(storeData);
        if (storeData.updated_at) {
          const lastPing = new Date(storeData.updated_at).getTime();
          const now = new Date().getTime();
          const diffSeconds = Math.floor((now - lastPing) / 1000);
          setIsDesktopOnline(diffSeconds < 90);
        }
      }

      // Transaksi Hari Ini
      const today = new Date().toISOString().split('T')[0];
      const { data: trxToday } = await supabase
        .from('cloud_transactions')
        .select('*')
        .eq('store_id', storeId)
        .gte('created_at', `${today} 00:00:00`)
        .order('created_at', { ascending: false });

      const allTrxToday = trxToday || [];
      setTransactions(allTrxToday);

      const omzet = allTrxToday.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
      const cost = allTrxToday.reduce((acc, curr) => acc + Number(curr.total_cost || 0), 0);

      // Shift Terakhir
      const { data: shiftData } = await supabase
        .from('cloud_shift_logs')
        .select('*')
        .eq('store_id', storeId)
        .order('start_time', { ascending: false })
        .limit(15);
      setShifts(shiftData || []);
      
      const latestShift = (shiftData || [])[0];
      const expectedDrawer = latestShift?.status === 'OPEN' ? Number(latestShift.expected_cash || latestShift.initial_cash || 0) : 0;

      setStats({
        omzetToday: omzet,
        trxCount: allTrxToday.length,
        profitEstimate: omzet - cost,
        activeShiftDrawer: expectedDrawer,
      });

      // Katalog Produk
      const { data: prodData } = await supabase
        .from('cloud_products')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_deleted', 0)
        .order('name', { ascending: true });
      setProducts(prodData || []);

      // Antrean Jasa
      const { data: orderData } = await supabase
        .from('cloud_orders_jasa')
        .select('*')
        .eq('store_id', storeId)
        .order('tgl_order', { ascending: false });
      setOrders(orderData || []);

      // Pengeluaran Biaya
      const { data: expData } = await supabase
        .from('cloud_expenses')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(30);
      setExpenses(expData || []);

      fetchFinanceData(financePeriod);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinanceData = async (period: string) => {
    if (!storeId) return;
    try {
      let query = supabase.from('cloud_transactions').select('total_amount, total_cost, created_at').eq('store_id', storeId);
      const now = new Date();

      if (period === 'today') {
        const todayStr = now.toISOString().split('T')[0];
        query = query.gte('created_at', `${todayStr} 00:00:00`);
      } else if (period === '7days') {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
        query = query.gte('created_at', `${sevenDaysAgo} 00:00:00`);
      } else if (period === 'month') {
        const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01 00:00:00`;
        query = query.gte('created_at', monthStart);
      }

      const { data: trxList } = await query;
      const rev = (trxList || []).reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
      const cogs = (trxList || []).reduce((acc, curr) => acc + Number(curr.total_cost || 0), 0);
      const gross = rev - cogs;

      let expQuery = supabase.from('cloud_expenses').select('amount, category, created_at').eq('store_id', storeId).neq('category', 'RESTOCK').neq('category', 'KAS_MASUK').neq('category', 'TAMBAH_MODAL');
      if (period === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        expQuery = expQuery.gte('created_at', `${todayStr} 00:00:00`);
      } else if (period === 'month') {
        const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01 00:00:00`;
        expQuery = expQuery.gte('created_at', monthStart);
      }

      const { data: expList } = await expQuery;
      const ops = (expList || []).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

      setFinanceSummary({
        revenue: rev,
        cogs: cogs,
        grossProfit: gross,
        operationalExpenses: ops,
        netProfit: gross - ops,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (storeId && isUnlocked) {
      fetchData();
      const channel = supabase
        .channel('pos_realtime_feed')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cloud_transactions', filter: `store_id=eq.${storeId}` }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cloud_shift_logs', filter: `store_id=eq.${storeId}` }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cloud_expenses', filter: `store_id=eq.${storeId}` }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stores', filter: `id=eq.${storeId}` }, () => fetchData())
        .subscribe();

      const interval = setInterval(() => fetchData(), 20000);
      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }
  }, [storeId, isUnlocked]);

  useEffect(() => {
    if (storeId && isUnlocked) fetchFinanceData(financePeriod);
  }, [financePeriod, storeId, isUnlocked]);

  // Handle Verifikasi PIN Toko
  const handleVerifyPIN = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = String(storeInfo?.pin || '1234').trim();
    if (pinInput.trim() === correctPin) {
      setIsUnlocked(true);
      setAuthError('');
      if (rememberMe) {
        localStorage.setItem(`natapos_unlocked_${storeId}`, 'true');
      }
    } else {
      setAuthError('PIN Toko salah! Silakan coba lagi.');
      setPinInput('');
    }
  };

  // Handle Login Email (Supabase Auth)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passInput,
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setIsUnlocked(true);
        if (rememberMe) {
          localStorage.setItem(`natapos_unlocked_${storeId}`, 'true');
        }
      }
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  // Handle Kunci / Keluar Sesi
  const handleLockDashboard = () => {
    localStorage.removeItem(`natapos_unlocked_${storeId}`);
    setIsUnlocked(false);
    setPinInput('');
  };

  // Format Helper Waktu
  const formatTimeDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    const str = String(dateStr).trim();
    if (str.length >= 16 && str.includes(' ')) return str.substring(11, 16);
    if (str.includes('T')) return str.split('T')[1].substring(0, 5);
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatFullDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    const str = String(dateStr).trim();
    if (str.length >= 10) {
      const tgl = str.substring(0, 10);
      const jam = str.length >= 16 ? ` ${str.substring(11, 16)}` : '';
      return tgl + jam;
    }
    return dateStr;
  };

  // Save Price Handler
  const handleSavePrice = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('cloud_products')
        .update({ price: editPrice, discount: editDiscount, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .eq('store_id', storeId);

      if (!error) {
        setSaveSuccessMsg('Harga berhasil diubah! Kasir desktop otomatis terupdate dalam 30 detik.');
        setEditingId(null);
        fetchData();
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert('Gagal: ' + err.message);
    }
  };

  // Create Product Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarcode || !newName || newPrice <= 0) {
      alert('Isi barcode, nama produk, dan harga jual dengan benar!');
      return;
    }

    try {
      const payload = {
        store_id: storeId,
        sync_id: `PROD-WEB-${Date.now()}`,
        barcode: newBarcode.trim(),
        name: newName.trim(),
        unit_type: newUnitType.toUpperCase(),
        cost_price: newCost,
        price: newPrice,
        stock: newStock,
        discount: newDiscount,
        is_deleted: 0,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('cloud_products').insert([payload]);
      if (!error) {
        setSaveSuccessMsg(`Produk '${newName}' berhasil ditambahkan ke Cloud!`);
        setShowAddModal(false);
        setNewBarcode(''); setNewName(''); setNewCost(0); setNewPrice(0); setNewStock(0); setNewDiscount(0);
        fetchData();
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const filteredProducts = products.filter(
    (p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // =========================================================================
  // SCREEN 1: JIKA TOKO TIDAK DITEMUKAN / NONAKTIF
  // =========================================================================
  if (!loadingStore && !storeInfo) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-8 text-center text-white">
          <Store className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold">Toko Tidak Ditemukan</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">Periksa kembali link atau parameter kode toko Anda.</p>
          <a href="/superadmin" className="text-xs text-indigo-400 font-bold hover:underline">
            Buka Portal Superadmin &rarr;
          </a>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: LAYAR PROTEKSI KUNCI PIN / LOGIN EMAIL (BELUM UNLOCKED)
  // =========================================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center">
          <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            {authView === 'PIN' ? <KeyRound className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
          </div>

          <h2 className="text-lg font-extrabold text-white">{storeInfo?.store_name || 'NATA POS TOKO'}</h2>
          <p className="text-xs text-slate-400 mt-0.5 mb-5 font-mono text-indigo-300">
            {storeInfo?.store_code || 'TOKO-01'}
          </p>

          {authView === 'PIN' ? (
            <form onSubmit={handleVerifyPIN} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Masukkan PIN Toko (4 Digit):</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full py-3 px-4 bg-slate-950 border border-slate-700 rounded-xl text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-indigo-500 font-bold"
                  autoFocus
                />
              </div>

              {authError && <p className="text-xs text-rose-400 font-bold">{authError}</p>}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="remember" className="cursor-pointer">Ingat saya di perangkat ini</label>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
              >
                Buka Dashboard Toko
              </button>

              <div className="pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setAuthView('EMAIL'); setAuthError(''); }}
                  className="text-xs text-slate-400 hover:text-indigo-300 transition"
                >
                  Atau login dengan <b>Email & Password</b> &rarr;
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3 text-xs text-left">
              <div>
                <label className="font-bold text-slate-300">Email Pemilik Toko:</label>
                <input
                  type="email"
                  required
                  placeholder="owner@toko.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300">Password:</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {authError && <p className="text-xs text-rose-400 font-bold text-center">{authError}</p>}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition mt-2"
              >
                Login Pemilik Toko
              </button>

              <div className="pt-3 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => { setAuthView('PIN'); setAuthError(''); }}
                  className="text-xs text-slate-400 hover:text-indigo-300 transition"
                >
                  &larr; Kembali ke <b>Login PIN Toko</b>
                </button>
              </div>
            </form>
          )}

          <p className="text-[11px] text-slate-500 mt-6">© 2026 NATA POS Protected Dashboard</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 3: DASHBOARD UTAMA TOKO (SESI TERBUKA)
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="NATA POS" className="h-9 w-auto object-contain rounded" onError={(e:any)=>{e.target.style.display='none'}} />
          <div>
            <h1 className="font-extrabold text-base leading-tight text-white flex items-center gap-2">
              {storeInfo?.store_name || 'NATA POS PUSAT'}
              <span className="bg-indigo-600/80 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                {storeInfo?.store_code || 'TOKO-01'}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Smart POS & Cloud Services Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold border transition ${
            isDesktopOnline 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {isDesktopOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden sm:inline">POS Kasir:</span> Online
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span className="hidden sm:inline">POS Kasir:</span> Offline
              </>
            )}
          </div>

          <a
         href="/docs"
         target="_blank"
         className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700"
       >
         <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
         <span className="hidden sm:inline">Panduan</span>
       </a>

       <button
         onClick={fetchData}
         className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
       >
         <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
         <span className="hidden sm:inline">Refresh</span>
       </button>

          <button
            onClick={handleLockDashboard}
            title="Kunci / Keluar Sesi Dashboard"
            className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Tabs */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Ringkasan Toko', icon: TrendingUp },
            { id: 'finance', label: 'Laporan Keuangan & Laba Rugi', icon: DollarSign },
            { id: 'products', label: `Katalog Produk (${products.length})`, icon: ShoppingBag },
            { id: 'shifts', label: 'Rekap Kas Laci (Shift)', icon: Wallet },
            { id: 'orders', label: `Antrean Percetakan (${orders.length})`, icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Omzet Hari Ini</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">Rp {stats.omzetToday.toLocaleString()}</h3>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Total Transaksi</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.trxCount} <span className="text-sm font-normal text-slate-500">Struk</span></h3>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><ShoppingBag className="w-6 h-6" /></div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Estimasi Laba Kotor</p>
                  <h3 className="text-2xl font-black text-emerald-600 mt-1">Rp {stats.profitEstimate.toLocaleString()}</h3>
                </div>
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl"><Wallet className="w-6 h-6" /></div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Kas Laci Kasir (Fisik)</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">Rp {stats.activeShiftDrawer.toLocaleString()}</h3>
                </div>
                <div className="bg-amber-50 text-amber-600 p-3 rounded-xl"><Clock className="w-6 h-6" /></div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Penjualan Terkini (Hari Ini)
                </h3>
                <span className="text-xs text-slate-500">{transactions.length} Transaksi Masuk</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">No. Struk</th>
                      <th className="px-4 py-3">Waktu</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Metode</th>
                      <th className="px-4 py-3 text-right">Total Belanja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {transactions.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Belum ada transaksi penjualan hari ini.</td></tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.receipt_no} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono font-bold text-indigo-600">{t.receipt_no}</td>
                          <td className="px-4 py-3 text-slate-500 font-mono">{formatTimeDisplay(t.created_at)}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{t.customer_name || 'Umum'}</td>
                          <td className="px-4 py-3"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{t.payment_method}</span></td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600">Rp {Number(t.total_amount).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LAPORAN KEUANGAN */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-sm text-slate-900">Laporan Laba Rugi & Arus Kas</span>
              </div>
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
                {[
                  { id: 'today', label: 'Hari Ini' },
                  { id: '7days', label: '7 Hari' },
                  { id: 'month', label: 'Bulan Ini' },
                  { id: 'all', label: 'Semua' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setFinancePeriod(btn.id as any)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition ${financePeriod === btn.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center"><p className="text-xs font-bold text-slate-500 uppercase">Omzet Penjualan</p><ArrowUpRight className="w-4 h-4 text-blue-600" /></div>
                <h3 className="text-2xl font-black text-blue-600 mt-2">Rp {financeSummary.revenue.toLocaleString()}</h3>
                <p className="text-[11px] text-slate-400 mt-1">HPP Modal: Rp {financeSummary.cogs.toLocaleString()}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center"><p className="text-xs font-bold text-slate-500 uppercase">Beban Operasional</p><ArrowDownRight className="w-4 h-4 text-rose-600" /></div>
                <h3 className="text-2xl font-black text-rose-600 mt-2">Rp {financeSummary.operationalExpenses.toLocaleString()}</h3>
                <p className="text-[11px] text-slate-400 mt-1">Gaji, Listrik, Bensin, dll.</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm bg-gradient-to-br from-white to-emerald-50/40">
                <div className="flex justify-between items-center"><p className="text-xs font-bold text-emerald-800 uppercase">Laba Bersih Riil</p><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                <h3 className="text-2xl font-black text-emerald-600 mt-2">Rp {financeSummary.netProfit.toLocaleString()}</h3>
                <p className="text-[11px] text-slate-500 mt-1">Laba Kotor dikurangi Beban Operasional</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200">
                <h3 className="font-bold text-sm text-slate-900">Rincian Pengeluaran Toko</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Tanggal & Waktu</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Sumber Dana</th>
                      <th className="px-4 py-3">Keterangan</th>
                      <th className="px-4 py-3 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {expenses.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Belum ada catatan pengeluaran toko.</td></tr>
                    ) : (
                      expenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500 font-mono">{formatFullDateDisplay(exp.created_at)}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">{exp.category}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded font-bold text-[10px] ${exp.is_cash === 1 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>{exp.is_cash === 1 ? '💰 Kas Laci' : '🏦 Bank'}</span></td>
                          <td className="px-4 py-3 text-slate-600">{exp.note || '-'}</td>
                          <td className="px-4 py-3 text-right font-bold text-rose-600">Rp {Number(exp.amount).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KATALOG PRODUK */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {saveSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {saveSuccessMsg}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari produk atau barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4" />
                Tambah Produk Baru
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Barcode</th>
                      <th className="px-4 py-3">Nama Produk</th>
                      <th className="px-4 py-3">Satuan</th>
                      <th className="px-4 py-3 text-right">Modal (HPP)</th>
                      <th className="px-4 py-3 text-right">Harga Jual (Web)</th>
                      <th className="px-4 py-3 text-center">Diskon (%)</th>
                      <th className="px-4 py-3 text-center">Stok</th>
                      <th className="px-4 py-3 text-center">Aksi Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredProducts.map((p) => {
                      const isEditing = editingId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono text-slate-600">{p.barcode}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">{p.name}</td>
                          <td className="px-4 py-3 font-semibold text-slate-600">{p.unit_type}</td>
                          <td className="px-4 py-3 text-right text-slate-500">Rp {Number(p.cost_price).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-bold text-indigo-600">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-24 px-2 py-1 border border-indigo-500 rounded text-right font-bold"
                              />
                            ) : (
                              `Rp ${Number(p.price).toLocaleString()}`
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editDiscount}
                                onChange={(e) => setEditDiscount(Number(e.target.value))}
                                className="w-14 px-1 py-1 border border-indigo-500 rounded text-center"
                              />
                            ) : (
                              p.discount > 0 ? <span className="text-emerald-600 font-bold">{p.discount}%</span> : '-'
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-slate-700">
                            {p.unit_type === 'KG' ? `${Number(p.stock)} KG` : `${p.stock} PCS`}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <button onClick={() => handleSavePrice(p.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 mx-auto text-xs">
                                <Check className="w-3.5 h-3.5" /> Simpan
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(p.id);
                                  setEditPrice(Number(p.price));
                                  setEditDiscount(Number(p.discount || 0));
                                }}
                                className="bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 px-2.5 py-1 rounded font-bold flex items-center gap-1 mx-auto text-xs border border-slate-200"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SHIFTS */}
        {activeTab === 'shifts' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-bold text-sm text-slate-900">Riwayat Kas Laci & Tutup Shift</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Kasir</th>
                    <th className="px-4 py-3">Waktu Buka</th>
                    <th className="px-4 py-3">Waktu Tutup</th>
                    <th className="px-4 py-3 text-right">Modal Awal</th>
                    <th className="px-4 py-3 text-right">Total Seharusnya</th>
                    <th className="px-4 py-3 text-right">Uang Fisik Laci</th>
                    <th className="px-4 py-3 text-right">Selisih</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {shifts.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{s.cashier_name}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{formatFullDateDisplay(s.start_time)}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{s.closed_at ? formatFullDateDisplay(s.closed_at) : '-'}</td>
                      <td className="px-4 py-3 text-right">Rp {Number(s.initial_cash).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-semibold">Rp {Number(s.expected_cash).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">Rp {Number(s.actual_cash).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-600">Rp {Number(s.variance).toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${s.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ANTREAN PERCETAKAN */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-bold text-sm text-slate-900">Monitoring Antrean Produksi Percetakan</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">No. Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">No. WhatsApp</th>
                    <th className="px-4 py-3">Prioritas</th>
                    <th className="px-4 py-3 text-right">Total Biaya</th>
                    <th className="px-4 py-3 text-center">Status Bayar</th>
                    <th className="px-4 py-3 text-center">Status Produksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-600">{o.no_order}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{o.nama_pelanggan}</td>
                      <td className="px-4 py-3 text-slate-500">{o.phone || '-'}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded font-bold text-[10px] ${o.prioritas === 'KILAT' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>{o.prioritas}</span></td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-600">Rp {Number(o.total_harga).toLocaleString()}</td>
                      <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded font-bold text-[10px] ${o.status_bayar === 'LUNAS' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{o.status_bayar}</span></td>
                      <td className="px-4 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold text-[10px]">{o.status_order}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL TAMBAH PRODUK BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Tambah Produk Baru ke Cloud
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Barcode / SKU Produk:</label>
                <input
                  type="text" required placeholder="Scan / Ketik barcode (contoh: 1001)"
                  value={newBarcode} onChange={(e) => setNewBarcode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg mt-1 font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Nama Produk Lengkap:</label>
                <input
                  type="text" required placeholder="Nama barang..."
                  value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg mt-1 font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Tipe Satuan:</label>
                  <select
                    value={newUnitType} onChange={(e) => setNewUnitType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg mt-1 font-semibold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="PCS">PCS</option>
                    <option value="LEMBAR">LEMBAR</option>
                    <option value="BUKU">BUKU</option>
                    <option value="KG">KG (Timbangan)</option>
                    <option value="BOX">BOX</option>
                    <option value="PACK">PACK</option>
                    <option value="SET">SET</option>
                    <option value="RIM">RIM</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Stok Awal:</label>
                  <input
                    type="number" value={newStock} onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg mt-1 font-semibold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Modal (HPP):</label>
                  <input
                    type="number" value={newCost} onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg mt-1 font-semibold focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Harga Jual Dasar (Rp):</label>
                  <input
                    type="number" required value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg mt-1 font-bold text-indigo-600 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm">
                  Simpan Produk ke Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}