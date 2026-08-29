'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, 
  ShoppingBag, 
  Wallet, 
  Clock, 
  Search, 
  RefreshCw, 
  Edit3,
  Trash2, 
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
  Store, 
  BookOpen, 
  Calendar, 
  Eye, 
  BarChart2, 
  FileText, 
  AlertTriangle
} from 'lucide-react';

export default function StoreDashboardPage() {
  const params = useParams();
  const rawStoreParam = (params?.store as string) || '';
  const storeParam = decodeURIComponent(rawStoreParam).toUpperCase();

  const [storeId, setStoreId] = useState<string>('');
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [isDesktopOnline, setIsDesktopOnline] = useState<boolean>(false);
  const [loadingStore, setLoadingStore] = useState<boolean>(true);

  // Auth State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'PIN' | 'EMAIL'>('PIN');
  const [pinInput, setPinInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passInput, setPassInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Tab & Finance State
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'products' | 'shifts' | 'orders'>('overview');
  const [loading, setLoading] = useState(true);
  const [financePeriod, setFinancePeriod] = useState<'today' | '7days' | 'month' | 'custom' | 'all'>('month');
  const [customStartDate, setCustomStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customEndDate, setCustomEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Stats & Summaries
  const [stats, setStats] = useState({
    omzetToday: 0,
    trxCount: 0,
    profitEstimate: 0,
    activeShiftDrawer: 0,
    activeShiftNonCash: 0,
    activeShiftStatus: 'CLOSED',
    activeCashier: '-',
  });

  const [financeSummary, setFinanceSummary] = useState({
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    operationalExpenses: 0,
    netProfit: 0,
  });

  const [weeklyTrend, setWeeklyTrend] = useState<{ label: string; date: string; amount: number }[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBarcode, setNewBarcode] = useState('');
  const [newName, setNewName] = useState('');
  const [newUnitType, setNewUnitType] = useState('PCS');
  const [newCost, setNewCost] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newStock, setNewStock] = useState<number>(0);
  const [newDiscount, setNewDiscount] = useState<number>(0);

  // Receipt Details Modal
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [receiptItems, setReceiptItems] = useState<any[]>([]);
  const [loadingReceiptItems, setLoadingReceiptItems] = useState(false);

  // 1. Resolve Store By Dynamic Slug (/TOKO-01)
  useEffect(() => {
    if (!storeParam) {
      setLoadingStore(false);
      return;
    }

    const resolveStore = async () => {
      setLoadingStore(true);
      try {
        const { data: storeData } = await supabase
          .from('stores')
          .select('id, store_name, store_code, auth_mode, phone, address, is_active, updated_at')
          .eq('store_code', storeParam)
          .single();

        if (storeData) {
          setStoreId(storeData.id);
          setStoreInfo(storeData);
          setAuthView(storeData.auth_mode === 'EMAIL' ? 'EMAIL' : 'PIN');
          const savedSession = localStorage.getItem(`natapos_unlocked_${storeData.id}`);
          if (savedSession === 'true') setIsUnlocked(true);
        }
      } catch (err) {
        console.error('Resolve store error:', err);
      } finally {
        setLoadingStore(false);
      }
    };

    resolveStore();
  }, [storeParam]);

  // 2. Fetch Data Paralel
  const fetchData = async () => {
    if (!storeId || !isUnlocked) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01 00:00:00`;

      const d7 = new Date();
      d7.setDate(d7.getDate() - 6);
      const sevenDaysAgo = `${d7.toISOString().split('T')[0]} 00:00:00`;

      const [
        storeRes,
        trxTodayRes,
        shiftRes,
        prodRes,
        orderRes,
        expRes,
        trx7DaysRes,
        monthTrxRes,
        monthExpRes
      ] = await Promise.all([
        supabase.from('stores').select('id, store_name, store_code, auth_mode, phone, address, is_active, updated_at').eq('id', storeId).single(),
        supabase.from('cloud_transactions').select('*').eq('store_id', storeId).gte('created_at', `${today} 00:00:00`).order('created_at', { ascending: false }),
        supabase.from('cloud_shift_logs').select('*').eq('store_id', storeId).order('start_time', { ascending: false }).limit(15),
        supabase.from('cloud_products').select('*').eq('store_id', storeId).eq('is_deleted', 0).order('name', { ascending: true }),
        supabase.from('cloud_orders_jasa').select('*').eq('store_id', storeId).order('tgl_order', { ascending: false }),
        supabase.from('cloud_expenses').select('*').eq('store_id', storeId).order('created_at', { ascending: false }).limit(30),
        supabase.from('cloud_transactions').select('total_amount, created_at').eq('store_id', storeId).gte('created_at', sevenDaysAgo),
        supabase.from('cloud_transactions').select('total_amount, total_cost').eq('store_id', storeId).gte('created_at', monthStart),
        supabase.from('cloud_expenses').select('amount').eq('store_id', storeId).neq('category', 'RESTOCK').neq('category', 'KAS_MASUK').neq('category', 'TAMBAH_MODAL').gte('created_at', monthStart)
      ]);

      if (storeRes.data) {
        setStoreInfo(storeRes.data);
        if (storeRes.data.updated_at) {
          const lastPing = new Date(storeRes.data.updated_at).getTime();
          setIsDesktopOnline((Date.now() - lastPing) / 1000 < 90);
        }
      }

      const allTrxToday = trxTodayRes.data || [];
      const omzet = allTrxToday.reduce((acc: number, curr: any) => acc + Number(curr.total_amount || 0), 0);
      const cost = allTrxToday.reduce((acc: number, curr: any) => acc + Number(curr.total_cost || 0), 0);

      const shiftList = shiftRes.data || [];
      const latestShift = shiftList[0];

      let expectedDrawer = 0;
      let nonCashShiftTotal = 0;

      if (latestShift?.status === 'OPEN') {
        const shiftStart = latestShift.start_time || '';
        const modalAwal = Number(latestShift.initial_cash || 0);
        let cashSales = 0;
        let nonCashSales = 0;

        allTrxToday.forEach((t: any) => {
          if (!shiftStart || String(t.created_at) >= shiftStart) {
            const pm = String(t.payment_method || 'TUNAI').toUpperCase();
            const total = Number(t.total_amount || 0);

            if (pm.includes('SPLIT')) {
              const matchTunai = pm.match(/TUNAI\s*(?:RP)?\s*([\d\.\,]+)/i);
              const matchQRIS = pm.match(/QRIS\s*(?:RP)?\s*([\d\.\,]+)/i);
              const cVal = matchTunai ? parseInt(matchTunai[1].replace(/[\.,]/g, ''), 10) : 0;
              const qVal = matchQRIS ? parseInt(matchQRIS[1].replace(/[\.,]/g, ''), 10) : Math.max(0, total - cVal);
              cashSales += cVal;
              nonCashSales += qVal;
            } else if (pm.includes('KASBON') || pm.includes('VOID')) {
              // Bukan Uang Fisik Laci
            } else if (pm.includes('QRIS') || pm.includes('TRANS') || pm.includes('ONLINE') || pm.includes('DEBIT')) {
              nonCashSales += total;
            } else {
              cashSales += total;
            }
          }
        });

        nonCashShiftTotal = nonCashSales;
        const expList = expRes.data || [];
        const cashIn = expList.filter((e: any) => Number(e.is_cash) === 1 && ['KAS_MASUK', 'TAMBAH_MODAL'].includes(e.category) && (!shiftStart || String(e.created_at) >= shiftStart)).reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
        const cashOut = expList.filter((e: any) => Number(e.is_cash) === 1 && !['RESTOCK', 'KAS_MASUK', 'TAMBAH_MODAL'].includes(e.category) && (!shiftStart || String(e.created_at) >= shiftStart)).reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
        expectedDrawer = modalAwal + cashSales + cashIn - cashOut;
      } else {
        expectedDrawer = 0;
        nonCashShiftTotal = 0;
      }

      const dayMap: { [key: string]: number } = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dayMap[d.toISOString().split('T')[0]] = 0;
      }

      (trx7DaysRes.data || []).forEach((t: any) => {
        const dKey = String(t.created_at || '').substring(0, 10);
        if (dayMap[dKey] !== undefined) dayMap[dKey] += Number(t.total_amount || 0);
      });

      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const trendList = Object.keys(dayMap).map((dStr) => {
        const dt = new Date(dStr);
        return { label: `${dayNames[dt.getDay()]} (${dStr.substring(8, 10)}/${dStr.substring(5, 7)})`, date: dStr, amount: dayMap[dStr] };
      });
      setWeeklyTrend(trendList);

      setTransactions(allTrxToday);
      setShifts(shiftList);
      setProducts(prodRes.data || []);
      setOrders(orderRes.data || []);
      setExpenses(expRes.data || []);

      setStats({
        omzetToday: omzet,
        trxCount: allTrxToday.length,
        profitEstimate: omzet - cost,
        activeShiftDrawer: expectedDrawer,
        activeShiftNonCash: nonCashShiftTotal,
        activeShiftStatus: latestShift?.status === 'OPEN' ? 'OPEN' : 'CLOSED',
        activeCashier: latestShift?.cashier_name || 'Kasir',
      });

      if (financePeriod === 'month') {
        const rev = (monthTrxRes.data || []).reduce((acc: number, curr: any) => acc + Number(curr.total_amount || 0), 0);
        const cogs = (monthTrxRes.data || []).reduce((acc: number, curr: any) => acc + Number(curr.total_cost || 0), 0);
        const ops = (monthExpRes.data || []).reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0);
        setFinanceSummary({ revenue: rev, cogs: cogs, grossProfit: rev - cogs, operationalExpenses: ops, netProfit: (rev - cogs) - ops });
      }
    } catch (error) {
      console.error('Fetch parallel error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch Laporan Keuangan
  const fetchFinanceData = async (period: string, customStart = customStartDate, customEnd = customEndDate) => {
    if (!storeId) return;
    try {
      let trxQuery = supabase.from('cloud_transactions').select('total_amount, total_cost, created_at').eq('store_id', storeId);
      let expQuery = supabase.from('cloud_expenses').select('amount, category, created_at').eq('store_id', storeId).neq('category', 'RESTOCK').neq('category', 'KAS_MASUK').neq('category', 'TAMBAH_MODAL');

      const now = new Date();
      let startFilter = '';
      let endFilter = '';

      if (period === 'today') startFilter = `${now.toISOString().split('T')[0]} 00:00:00`;
      else if (period === '7days') { const d = new Date(); d.setDate(d.getDate() - 6); startFilter = `${d.toISOString().split('T')[0]} 00:00:00`; }
      else if (period === 'month') { const y = now.getFullYear(); const m = String(now.getMonth() + 1).padStart(2, '0'); startFilter = `${y}-${m}-01 00:00:00`; }
      else if (period === 'custom') { startFilter = `${customStart} 00:00:00`; endFilter = `${customEnd} 23:59:59`; }

      if (startFilter) { trxQuery = trxQuery.gte('created_at', startFilter); expQuery = expQuery.gte('created_at', startFilter); }
      if (endFilter) { trxQuery = trxQuery.lte('created_at', endFilter); expQuery = expQuery.lte('created_at', endFilter); }

      const [{ data: trxList }, { data: expList }] = await Promise.all([trxQuery, expQuery]);

      const rev = (trxList || []).reduce((acc: number, curr: any) => acc + Number(curr.total_amount || 0), 0);
      const cogs = (trxList || []).reduce((acc: number, curr: any) => acc + Number(curr.total_cost || 0), 0);
      const ops = (expList || []).reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0);

      setFinanceSummary({ revenue: rev, cogs: cogs, grossProfit: rev - cogs, operationalExpenses: ops, netProfit: (rev - cogs) - ops });
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenReceiptDetail = async (trx: any) => {
    setSelectedReceipt(trx);
    setLoadingReceiptItems(true);
    try {
      const { data } = await supabase.from('cloud_transaction_items').select('*').eq('store_id', storeId).eq('receipt_no', trx.receipt_no);
      setReceiptItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReceiptItems(false);
    }
  };

  useEffect(() => {
    if (storeId && isUnlocked) {
      fetchData();
      const channel = supabase
        .channel('pos_realtime_feed')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cloud_transactions', filter: `store_id=eq.${storeId}` }, () => {
          clearTimeout((window as any).__refreshTimer);
          (window as any).__refreshTimer = setTimeout(() => fetchData(), 250);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cloud_shift_logs', filter: `store_id=eq.${storeId}` }, () => {
          clearTimeout((window as any).__refreshTimer);
          (window as any).__refreshTimer = setTimeout(() => fetchData(), 250);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cloud_expenses', filter: `store_id=eq.${storeId}` }, () => {
          clearTimeout((window as any).__refreshTimer);
          (window as any).__refreshTimer = setTimeout(() => fetchData(), 250);
        })
        .subscribe();

      const interval = setInterval(() => fetchData(), 20000);
      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }
  }, [storeId, isUnlocked]);

  useEffect(() => {
    if (storeId && isUnlocked && financePeriod !== 'month') {
      fetchFinanceData(financePeriod, customStartDate, customEndDate);
    }
  }, [financePeriod, customStartDate, customEndDate, storeId, isUnlocked]);

  const handleVerifyPIN = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const { data: isValid, error } = await supabase.rpc('verify_store_pin', {
        p_store_id: storeId,
        p_pin: pinInput.trim()
      });

      if (error || isValid !== true) {
        setAuthError('PIN Toko salah! Silakan coba lagi.');
        setPinInput('');
      } else {
        setIsUnlocked(true);
        setAuthError('');
        if (rememberMe) localStorage.setItem(`natapos_unlocked_${storeId}`, 'true');
      }
    } catch (err) {
      setAuthError('Gagal memverifikasi PIN.');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: passInput });
      if (error) setAuthError(error.message);
      else {
        setIsUnlocked(true);
        if (rememberMe) localStorage.setItem(`natapos_unlocked_${storeId}`, 'true');
      }
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleLockDashboard = () => {
    localStorage.removeItem(`natapos_unlocked_${storeId}`);
    setIsUnlocked(false);
    setPinInput('');
  };

  const formatTimeDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    const str = String(dateStr).trim();
    if (str.length >= 16 && str.includes(' ')) return str.substring(11, 16);
    if (str.includes('T')) return str.split('T')[1].substring(0, 5);
    return str;
  };

  const formatFullDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    const str = String(dateStr).trim();
    if (str.length >= 10) return `${str.substring(0, 10)}${str.length >= 16 ? ` ${str.substring(11, 16)}` : ''}`;
    return dateStr;
  };

  const handleSavePrice = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('cloud_products')
        .update({ price: editPrice, discount: editDiscount, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .eq('store_id', storeId);

      if (!error) {
        setSaveSuccessMsg('Harga berhasil diubah! Kasir otomatis terupdate.');
        setEditingId(null);
        fetchData();
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert('Gagal: ' + err.message);
    }
  };

  // Delete Product Handler (Soft Delete)
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus produk '${productName}' dari katalog?`)) {
      return;
    }
    try {
      const { error } = await supabase
        .from('cloud_products')
        .update({ is_deleted: 1, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .eq('store_id', storeId);

      if (!error) {
        setSaveSuccessMsg(`Produk '${productName}' berhasil dihapus dari katalog!`);
        fetchData();
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      } else {
        alert('Gagal menghapus produk: ' + error.message);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

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

  const isProductLowStock = (p: any) => {
    const st = Number(p.stock || 0);
    return p.unit_type === 'KG' ? st <= 2 : st <= 5;
  };

  const lowStockCount = products.filter(isProductLowStock).length;

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLowStock = showOnlyLowStock ? isProductLowStock(p) : true;
    return matchSearch && matchLowStock;
  });

  const maxTrendAmount = Math.max(...weeklyTrend.map((t: any) => t.amount), 1000);

  if (!loadingStore && !storeInfo) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-8 text-center text-white space-y-4">
          <Store className="w-12 h-12 text-rose-500 mx-auto" />
          <div>
            <h2 className="text-lg font-bold">Toko Tidak Ditemukan</h2>
            <p className="text-xs text-slate-400 mt-1">Kode toko <b>{storeParam}</b> tidak terdaftar di database.</p>
          </div>
          <a href="/" className="inline-block text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl transition">
            Kembali ke Halaman Utama
          </a>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center">
          <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            {authView === 'PIN' ? <KeyRound className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
          </div>
          <h2 className="text-lg font-extrabold text-white">{storeInfo?.store_name || 'NATA POS TOKO'}</h2>
          <p className="text-xs text-slate-400 mt-0.5 mb-5 font-mono text-indigo-300">{storeInfo?.store_code || storeParam}</p>

          {authView === 'PIN' ? (
            <form onSubmit={handleVerifyPIN} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Masukkan PIN Toko (4 Digit):</label>
                <input
                  type="password" maxLength={6} required placeholder="••••" value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full py-3 px-4 bg-slate-950 border border-slate-700 rounded-xl text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-indigo-500 font-bold"
                  autoFocus
                />
              </div>
              {authError && <p className="text-xs text-rose-400 font-bold">{authError}</p>}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox" id="remember" checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="remember" className="cursor-pointer">Ingat saya di perangkat ini</label>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30">
                Buka Dashboard Toko
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3 text-xs text-left">
              <div>
                <label className="font-bold text-slate-300">Email Pemilik Toko:</label>
                <input
                  type="email" required placeholder="owner@toko.com" value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-300">Password:</label>
                <input
                  type="password" required placeholder="••••••••" value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl mt-1 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              {authError && <p className="text-xs text-rose-400 font-bold text-center">{authError}</p>}
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition mt-2">
                Login Pemilik Toko
              </button>
            </form>
          )}
          <div className="pt-4 border-t border-slate-800 mt-6">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition">&larr; Kembali ke Beranda</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="NATA POS" className="h-9 w-auto object-contain rounded" onError={(e: any) => { e.target.style.display = 'none'; }} />
          <div>
            <h1 className="font-extrabold text-base leading-tight text-white flex items-center gap-2">
              {storeInfo?.store_name || 'NATA POS PUSAT'}
              <span className="bg-indigo-600/80 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                {storeInfo?.store_code || storeParam}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Smart POS & Cloud Services Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold border transition ${
            isDesktopOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isDesktopOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            <span className="hidden sm:inline">POS Kasir:</span> {isDesktopOnline ? 'Online' : 'Offline'}
          </div>

          <a href="/docs" target="_blank" className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-700">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Panduan</span>
          </a>

          <button onClick={fetchData} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button onClick={handleLockDashboard} title="Kunci / Keluar" className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition">
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
            { id: 'orders', label: `Antrean Produksi & Jasa (${orders.length})`, icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  isActive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
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
                  <h3 className={`text-2xl font-black mt-1 ${stats.activeShiftStatus === 'OPEN' ? 'text-slate-900' : 'text-slate-400'}`}>
                    {stats.activeShiftStatus === 'OPEN' ? `Rp ${stats.activeShiftDrawer.toLocaleString()}` : 'Rp 0'}
                  </h3>
                  <div className="text-[11px] font-bold mt-1 space-y-0.5">
                    {stats.activeShiftStatus === 'OPEN' ? (
                      <>
                        <div className="text-emerald-600">🟢 Shift Buka ({stats.activeCashier})</div>
                        <div className="text-slate-500 text-[10px] font-normal flex items-center gap-1.5 pt-0.5">
                          <span>💵 Tunai: <b>Rp {stats.activeShiftDrawer.toLocaleString()}</b></span>
                          <span>•</span>
                          <span>📱 QRIS/Bank: <b className="text-indigo-600">Rp {stats.activeShiftNonCash.toLocaleString()}</b></span>
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-400">🔴 Shift Tutup (Standby)</span>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stats.activeShiftStatus === 'OPEN' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Visual 7 Days Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900">Grafik Penjualan 7 Hari Terakhir</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">Tren Omzet Toko</span>
              </div>

              <div className="grid grid-cols-7 gap-2 pt-6 items-end h-44">
                {weeklyTrend.map((item: any, idx: number) => {
                  const heightPercent = Math.max(8, Math.round((item.amount / maxTrendAmount) * 100));
                  const isToday = idx === weeklyTrend.length - 1;
                  return (
                    <div key={item.date} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        Rp {item.amount >= 1000000 ? `${(item.amount / 1000000).toFixed(1)}jt` : `${(item.amount / 1000).toFixed(0)}k`}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[42px] rounded-t-lg transition-all duration-500 ${
                          isToday ? 'bg-indigo-600 shadow-md shadow-indigo-500/30' : 'bg-slate-200 group-hover:bg-indigo-400'
                        }`}
                      ></div>
                      <span className={`text-[10px] font-bold mt-1 text-center truncate ${isToday ? 'text-indigo-600' : 'text-slate-500'}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Penjualan Terkini Hari Ini */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Penjualan Terkini (Hari Ini)
                </h3>
                <span className="text-xs text-slate-500">{transactions.length} Struk Masuk</span>
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
                      <th className="px-4 py-3 text-center">Rincian Item</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {transactions.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Belum ada transaksi penjualan hari ini.</td></tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.receipt_no} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono font-bold text-indigo-600">{t.receipt_no}</td>
                          <td className="px-4 py-3 text-slate-500 font-mono">{formatTimeDisplay(t.created_at)}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{t.customer_name || 'Umum'}</td>
                          <td className="px-4 py-3">
                            {t.payment_method === 'KASBON' ? (
                                <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">🔴 HUTANG</span>
                            ) : (
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{t.payment_method}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600">Rp {Number(t.total_amount).toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleOpenReceiptDetail(t)}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded font-bold text-xs inline-flex items-center gap-1 transition"
                            >
                              <Eye className="w-3.5 h-3.5" /> Lihat
                            </button>
                          </td>
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
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-sm text-slate-900">Laporan Laba Rugi & Arus Kas</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  {[
                    { id: 'today', label: 'Hari Ini' },
                    { id: '7days', label: '7 Hari' },
                    { id: 'month', label: 'Bulan Ini' },
                    { id: 'custom', label: 'Rentang Kustom' },
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

                {financePeriod === 'custom' && (
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="bg-white border border-slate-200 px-2 py-0.5 rounded text-xs font-medium"
                    />
                    <span>s/d</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="bg-white border border-slate-200 px-2 py-0.5 rounded text-xs font-medium"
                    />
                  </div>
                )}
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
                <p className="text-[11px] text-slate-400 mt-1">Gaji, Listrik, Operasional, dll.</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm bg-gradient-to-br from-white to-emerald-50/40">
                <div className="flex justify-between items-center"><p className="text-xs font-bold text-emerald-800 uppercase">Laba Bersih Riil</p><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                <h3 className="text-2xl font-black text-emerald-600 mt-2">Rp {financeSummary.netProfit.toLocaleString()}</h3>
                <p className="text-[11px] text-slate-500 mt-1">Laba Kotor dikurangi Beban Operasional</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-bold text-sm text-slate-900">Rincian Pengeluaran Toko</h3></div>
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

            {lowStockCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 text-amber-950 px-4 py-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Perhatian: Terdapat <b className="text-rose-600 font-black">{lowStockCount} produk</b> dengan stok menipis (&le; 5 PCS / 2 KG).</span>
                </div>
                <button
                  onClick={() => setShowOnlyLowStock(!showOnlyLowStock)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition shadow-sm ${
                    showOnlyLowStock ? 'bg-indigo-600 text-white' : 'bg-amber-200/90 hover:bg-amber-300 text-amber-900'
                  }`}
                >
                  {showOnlyLowStock ? 'Tampilkan Semua Produk' : '⚠️ Filter Stok Menipis Saja'}
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text" placeholder="Cari produk atau barcode..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4" /> Tambah Produk Baru
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
                                type="number" value={editPrice}
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
                                type="number" value={editDiscount}
                                onChange={(e) => setEditDiscount(Number(e.target.value))}
                                className="w-14 px-1 py-1 border border-indigo-500 rounded text-center"
                              />
                            ) : (
                              p.discount > 0 ? <span className="text-emerald-600 font-bold">{p.discount}%</span> : '-'
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-bold">
                            {isProductLowStock(p) ? (
                              <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[11px] font-black border border-rose-200 inline-flex items-center gap-1">
                                ⚠️ {p.unit_type === 'KG' ? `${Number(p.stock)} KG` : `${p.stock} PCS`}
                              </span>
                            ) : (
                              <span className="text-slate-700">{p.unit_type === 'KG' ? `${Number(p.stock)} KG` : `${p.stock} PCS`}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-1">
                                <button onClick={() => handleSavePrice(p.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded font-bold flex items-center gap-1 text-xs shadow-sm">
                                  <Check className="w-3 h-3" /> Simpan
                                </button>
                                <button onClick={() => setEditingId(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold text-xs">
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingId(p.id);
                                    setEditPrice(Number(p.price));
                                    setEditDiscount(Number(p.discount || 0));
                                  }}
                                  className="bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 px-2 py-1 rounded font-bold flex items-center gap-1 text-xs border border-slate-200"
                                  title="Edit Harga / Diskon"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-1 rounded font-bold flex items-center gap-1 text-xs border border-rose-200"
                                  title="Hapus Produk"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
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

        {/* TAB 5: ANTREAN PRODUKSI & JASA */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-bold text-sm text-slate-900">Monitoring Antrean Order Jasa & Produksi</h3></div>
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

      {/* MODAL: DETAIL RINCIAN STRUK PENJUALAN */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Rincian Struk Penjualan
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  No: <b className="text-indigo-600">{selectedReceipt.receipt_no}</b> | {formatFullDateDisplay(selectedReceipt.created_at)}
                </p>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
              <div>Pelanggan: <b className="text-slate-800">{selectedReceipt.customer_name || 'Umum'}</b></div>
              <div>Metode Bayar: <b className="text-indigo-600">{selectedReceipt.payment_method}</b></div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Item Barang</th>
                    <th className="px-3 py-2 text-center">Qty</th>
                    <th className="px-3 py-2 text-right">Harga</th>
                    <th className="px-3 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {loadingReceiptItems ? (
                    <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-400">Memuat rincian item...</td></tr>
                  ) : receiptItems.length === 0 ? (
                    <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-400">Tidak ada rincian item tersimpan.</td></tr>
                  ) : (
                    receiptItems.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-semibold text-slate-800">{item.product_name}</td>
                        <td className="px-3 py-2 text-center text-slate-600">{item.quantity} {item.unit_name || 'PCS'}</td>
                        <td className="px-3 py-2 text-right text-slate-600">Rp {Number(item.price_at_sale).toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">Rp {Number(item.subtotal).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-right">
              {Number(selectedReceipt.discount_amount || 0) > 0 && (
                <div className="text-slate-500">Diskon Transaksi: - Rp {Number(selectedReceipt.discount_amount).toLocaleString()}</div>
              )}
              <div className="text-sm font-black text-slate-900">
                Total Tagihan: <span className="text-emerald-600">Rp {Number(selectedReceipt.total_amount).toLocaleString()}</span>
              </div>
              <div className="text-slate-500">
                Dibayar: Rp {Number(selectedReceipt.paid_amount).toLocaleString()} | Kembalian: Rp {Number(selectedReceipt.change_amount).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH PRODUK BARU */}
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
                  type="text" required placeholder="Scan / Ketik barcode"
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
