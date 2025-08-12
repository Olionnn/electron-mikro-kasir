import React, { useMemo, useState, useCallback } from "react";
import { FiChevronLeft, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";

const LaporanKeuangan = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("09/08/2025 - 11/08/2025");

  // Setup Navbar
  const onBack = useCallback(() => navigate("/laporan"), [navigate]);
  const onClearDate = useCallback(() => setDateRange(""), []);

  useNavbar(
    {
      variant: "page",
      title: "Laporan Keuangan",
      backTo: "/laporan",
      rightExtra: (
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center border rounded-lg px-3 py-1.5 text-sm">
            <FiCalendar className="text-green-600 mr-2" />
            <span className="text-gray-700">{dateRange || "Pilih rentang tanggal"}</span>
          </div>
          <button
            onClick={onClearDate}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
            title="Bersihkan tanggal"
          >
            Bersihkan
          </button>
        </div>
      ),
      actions: [],
    },
    [onBack, onClearDate, dateRange]
  );

  // DUMMY ringkasan
  const transaksi = [
    { tanggal: "2025-08-11", pemasukan: 444444, pengeluaran: 555500 },
    { tanggal: "2025-08-10", pemasukan: 1250000, pengeluaran: 2500000 },
    { tanggal: "2025-08-09", pemasukan: 355000, pengeluaran: 0 },
  ];

  const sum = useMemo(() => {
    const pemasukan = transaksi.reduce((s, x) => s + x.pemasukan, 0);
    const pengeluaran = transaksi.reduce((s, x) => s + x.pengeluaran, 0);
    return { pemasukan, pengeluaran };
  }, [transaksi]);

  const toID = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const rp = (n) => `Rp ${n.toLocaleString("id-ID")}`;

  const goToDetail = (isoDate) => {
    navigate(`/laporan/laporan-keuangan/detail`);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col p-6">
      {/* Header lokal (biarkan, tapi sekarang Navbar utama dikontrol useNavbar) */}
      <div className="flex items-center gap-3 mb-4 sm:hidden">
        <button className="text-2xl text-gray-600" onClick={() => navigate("/laporan")}>
          <FiChevronLeft />
        </button>
        <h1 className="text-lg font-semibold">Laporan Keuangan</h1>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        *Hanya memuat data <span className="font-semibold">Pemasukan & Pengeluaran</span> dari menu{" "}
        <span className="font-semibold">Keuangan</span>
      </p>

      {/* Date Picker (versi mobile) */}
      <div className="flex items-center gap-3 mb-5 sm:hidden">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm w-fit">
          <FiCalendar className="text-green-500 mr-2" />
          <span>{dateRange || "Pilih rentang tanggal"}</span>
          <button
            className="ml-3 text-gray-400 hover:text-red-500"
            onClick={() => setDateRange("")}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Pemasukan Lain</p>
          <p className="text-green-600 font-bold text-lg">{rp(sum.pemasukan)}</p>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Pengeluaran Lain</p>
          <p className="text-red-500 font-bold text-lg">{rp(sum.pengeluaran)}</p>
        </div>
      </div>

      {/* Tabel + tombol Detail */}
      <div className="w-full">
        <div className="grid grid-cols-5 bg-gray-100 text-sm font-medium text-gray-600 py-2 px-3 rounded-t-lg">
          <span>Tanggal</span>
          <span>Jumlah Transaksi</span>
          <span>Pemasukan Lain</span>
          <span>Pengeluaran Lain</span>
          <span className="text-right">Aksi</span>
        </div>

        {transaksi.map((r, idx) => (
          <div
            key={idx}
            className="grid grid-cols-5 items-center py-2 px-3 border-b hover:bg-gray-50 text-sm"
          >
            <span className="font-medium">{toID(r.tanggal)}</span>
            <span className="text-gray-600">
              {(r.pemasukan > 0 ? 1 : 0) + (r.pengeluaran > 0 ? 1 : 0)}
            </span>
            <span className="text-green-600 font-semibold">{rp(r.pemasukan)}</span>
            <span className="text-red-500 font-semibold">{rp(r.pengeluaran)}</span>

            <div className="flex justify-end">
              <button
                onClick={() => goToDetail(r.tanggal)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold
                           border border-green-600 text-green-700 hover:bg-green-50 transition"
                aria-label={`Lihat detail ${toID(r.tanggal)}`}
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaporanKeuangan;