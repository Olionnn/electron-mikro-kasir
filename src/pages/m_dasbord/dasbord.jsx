import React from "react";

// Utility: join class names
const cx = (...a) => a.filter(Boolean).join(" ");

// Simple Badge component
const Badge = ({ children, className = "" }) => (
  <span className={cx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", className)}>
    {children}
  </span>
);

// Simple Card component
const Card = ({ title, action, children, className = "" }) => (
  <div className={cx("bg-white rounded-xl border border-gray-200 shadow-sm", className)}>
    {(title || action) && (
      <div className="flex items-center justify-between px-4 py-3 border-b">
        {typeof title === "string" ? (
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        ) : (
          title
        )}
        {action}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

// Sidebar link
const NavItem = ({ label, active, icon = null, children }) => (
  <div className={cx(
    "group w-full",
    active ? "bg-emerald-700/20" : "hover:bg-emerald-700/10"
  )}>
    <button className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-white/90">
      <span className="w-5 h-5 grid place-items-center">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      {children && <span className="ml-auto text-xs opacity-70">▸</span>}
    </button>
    {children}
  </div>
);

export default function DashboardKasir() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Open menu">
                <span className="text-2xl">☰</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 grid place-items-center text-white font-bold">K</div>
                <div className="leading-tight">
                  <div className="font-semibold text-gray-800">KasirPintar®</div>
                  <div className="text-[10px] text-gray-500">Web Kasir Pintar v1.031 2025-08-13</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">Fitur Baru ▾</button>
              <button className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">🇮🇩</button>
              <button className="relative w-8 h-8 grid place-items-center rounded-full bg-gray-100">🔔</button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 grid place-items-center text-white">N</div>
                <span className="text-sm font-medium text-gray-700">Narin Elvarelle</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4 grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-2">
          <div className="bg-emerald-700 rounded-2xl text-white overflow-hidden shadow-md">
            <div className="px-4 py-3 border-b border-white/10">
              <Badge className="bg-yellow-400/90 text-emerald-900 font-semibold">Misi Dapat Hadiah <span className="ml-1 text-[10px]">Baru</span></Badge>
            </div>
            <nav className="py-2">
              <NavItem label="PEMBAYARAN" icon={<span>💳</span>} />
              <NavItem label="DASHBOARD" active icon={<span>📊</span>} />
              <div className="px-2"><div className="h-px bg-white/10 my-2" /></div>
              <NavItem label="DATABASE" icon={<span>🗂️</span>} />
              <NavItem label="TRANSAKSI" icon={<span>🧾</span>} />
              <NavItem label="LAPORAN" icon={<span>📈</span>} />
              <NavItem label="CABANG" icon={<span>🏷️</span>} />
              <NavItem label="PENGATURAN" icon={<span>⚙️</span>} />
              <NavItem label="E-KATALOG" icon={<span>🛒</span>} />
              <NavItem label="PPOB" icon={<span>📱</span>} />
              <NavItem label="PROGRAM REFERRAL" icon={<span>🎁</span>} />
              <NavItem label="E-WALLET" icon={<span>👛</span>} />
              <NavItem label="PINJAMAN" icon={<span>💼</span>} />
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 lg:col-span-10">
          {/* Dismiss info banner */}
          <Card className="mb-3 border-amber-200 bg-amber-50">
            <div className="text-sm text-amber-800">
              Toko Anda belum atur titik pin lokasi toko, ayo atur titik lokasi sekarang.
            </div>
            <div className="mt-2">
              <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm">Atur Lokasi</button>
            </div>
          </Card>

          {/* Survey banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="text-sm text-emerald-900">
                <div className="font-semibold mb-1">Survey Singkat Kebutuhan Anda!</div>
                Isi survey untuk membantu kami memperbaiki layananmu dan memenuhi kebutuhanmu, hanya perlu 5 menit.
              </div>
              <button className="shrink-0 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">Isi Survey Sekarang</button>
            </div>
          </div>

          {/* Header row: filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input type="date" className="px-3 py-2 bg-white border rounded-lg text-sm" defaultValue="2025-08-13" />
                <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" className="rounded" />
                  Tampilkan Total Pendapatan Sebelum Piutang Dibayar
                </label>
                <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" className="rounded" />
                  Tampilkan Untung Sebelum Piutang Dibayar
                </label>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><span>Jumlah Transaksi</span><Badge className="bg-gray-100 text-gray-600 ml-2">13-08-2025</Badge></div>}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🪙</span>
                <div>
                  <div className="text-2xl font-bold text-gray-800">0</div>
                </div>
              </div>
            </Card>
            <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><span>Pendapatan</span><Badge className="bg-gray-100 text-gray-600 ml-2">13-08-2025</Badge></div>}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🪙</span>
                <div className="text-2xl font-bold text-gray-800">0</div>
              </div>
            </Card>
            <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><span>Keuntungan</span><Badge className="bg-gray-100 text-gray-600 ml-2">13-08-2025</Badge></div>}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🪙</span>
                <div className="text-2xl font-bold text-gray-800">0</div>
              </div>
            </Card>
          </div>

          {/* Graph Cards */}
          <div className="grid grid-cols-12 gap-4 mb-6">
            <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><Badge className="bg-emerald-600 text-white">Grafik Transaksi</Badge><Badge className="bg-gray-100 text-gray-600 ml-2">13-08-2025</Badge></div>}>
              <div className="h-28 grid place-items-center text-sm text-gray-500">Transaksi Kosong</div>
            </Card>
            <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><Badge className="bg-emerald-600 text-white">Grafik Pendapatan</Badge><Badge className="bg-gray-100 text-gray-600 ml-2">13-08-2025</Badge></div>}>
              <div className="h-28 grid place-items-center text-sm text-gray-500">Transaksi Kosong</div>
            </Card>
            <Card className="col-span-12 md:col-span-4" title={<div className="flex items-center gap-2"><Badge className="bg-emerald-600 text-white">Grafik Keuntungan</Badge><Badge className="bg-gray-100 text-gray-600 ml-2">13-08-2025</Badge></div>}>
              <div className="h-28 grid place-items-center text-sm text-gray-500">Transaksi Kosong</div>
            </Card>
          </div>

          {/* Reports Section */}
          <Card className="mb-6" title={<div className="font-semibold">Laporan Penjualan Barang <span className="text-xs font-normal text-gray-500">Rabu, 13 Agustus 2025</span></div>}>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="text-left py-2 pr-4">Kode</th>
                    <th className="text-left py-2 pr-4">Nama</th>
                    <th className="text-left py-2 pr-4">Jumlah Barang</th>
                    <th className="text-left py-2 pr-4">Jumlah Transaksi</th>
                    <th className="text-left py-2 pr-4">Keuntungan</th>
                    <th className="text-left py-2 pr-4">Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 pr-4 text-gray-500" colSpan={6}>Transaksi Kosong</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-right text-xs text-gray-500">Business Account</div>
          </Card>

          <div className="grid grid-cols-12 gap-4">
            <Card className="col-span-12 lg:col-span-6" title={<div className="font-semibold">Laporan Penjualan Per Staff <span className="text-xs font-normal text-gray-500">Rabu, 13 Agustus 2025</span></div>}>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-left py-2 pr-4">Email</th>
                      <th className="text-left py-2 pr-4">Jumlah Transaksi</th>
                      <th className="text-left py-2 pr-4">Keuntungan</th>
                      <th className="text-left py-2 pr-4">Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 pr-4 text-gray-500" colSpan={4}>Transaksi Kosong</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-right text-xs text-gray-500">Business Account</div>
            </Card>

            <Card className="col-span-12 lg:col-span-6" title={<div className="font-semibold">Laporan Manajemen Stok <span className="text-xs font-normal text-gray-500">Rabu, 13 Agustus 2025</span></div>}>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-left py-2 pr-4">Tanggal</th>
                      <th className="text-left py-2 pr-4">Nama</th>
                      <th className="text-left py-2 pr-4">Masuk</th>
                      <th className="text-left py-2 pr-4">Keluar</th>
                      <th className="text-left py-2 pr-4">Stok</th>
                      <th className="text-left py-2 pr-4">Email</th>
                      <th className="text-left py-2 pr-4">Mode</th>
                      <th className="text-left py-2 pr-4">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 pr-4 text-gray-500" colSpan={8}>Transaksi Kosong</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Floating helpers */}
          <div className="fixed right-4 bottom-4 flex flex-col gap-2">
            <button className="w-10 h-10 rounded-full bg-emerald-600 text-white grid place-items-center shadow-lg">💬</button>
            <button className="w-10 h-10 rounded-full bg-emerald-600 text-white grid place-items-center shadow-lg">❓</button>
          </div>
        </main>
      </div>
    </div>
  );
}
