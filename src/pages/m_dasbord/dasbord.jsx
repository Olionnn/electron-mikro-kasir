import React from "react";
import { useNavbar } from "../../hooks/useNavbar";
import { Card } from "../../component/SimpleCard";
import { Badge } from "../../component/SimpleBadge";

// Sidebar link
// const NavItem = ({ label, active, icon = null, children }) => (
//   <div className={cx(
//     "group w-full",
//     active ? "bg-emerald-700/20" : "hover:bg-emerald-700/10"
//   )}>
//     <button className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-white/90">
//       <span className="w-5 h-5 grid place-items-center">{icon}</span>
//       <span className="text-sm font-medium">{label}</span>
//       {children && <span className="ml-auto text-xs opacity-70">▸</span>}
//     </button>
//     {children}
//   </div>
// );

export default function DashboardKasir() {
  // Pasang navbar global (ganti topbar manual)
  useNavbar({
    variant: "page",
    title: "Dashboard",
    actions: [
      {
        type: "button",
        title: "Fitur Baru",
        onClick: () => console.log("Fitur Baru"),
        className: "px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50",
        label: "Fitur Baru ▾",
      },
      {
        type: "button",
        title: "Bahasa",
        onClick: () => console.log("Bahasa"),
        className: "px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50",
        label: "🇮🇩",
      },
      {
        type: "button",
        title: "Notifikasi",
        onClick: () => console.log("Notifikasi"),
        className: "relative w-8 h-8 grid place-items-center rounded-full bg-gray-100",
        label: "🔔",
      },
      {
        type: "span",
        title: "User",
        className: "hidden md:inline-flex items-center gap-2 text-sm text-gray-700",
        label: "Narin Elvarelle",
      },
    ],
  }, []); // tidak perlu deps

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Top bar DIHAPUS karena sudah diganti Navbar via useNavbar */}

      {/* Main Content Scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4 grid grid-cols-12 gap-4">
          {/* Main */}
          <main className="col-span-12">
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
    </div>
  );
}