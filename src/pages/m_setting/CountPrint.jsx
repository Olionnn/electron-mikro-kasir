import React from "react";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";

// Icons
import { MdArrowBack, MdPrint, MdReceiptLong, MdChevronRight } from "react-icons/md";

export default function PengaturanPrinter() {
  const navigate = useNavigate();

  // Set Navbar global
  useNavbar(
    {
      variant: "page",
      title: "Printer & Struk",
      backTo: "/pengaturan", // balik ke halaman Pengaturan
      actions: [],
    },
    [navigate]
  );

  return (
    <div className="flex h-full bg-white"> 
      {/* Konten (60%) */}
      <main className="hidden lg:block w-full p-8 overflow-y-auto">
        {/* Title row */}
        <div className="rounded-2xl border overflow-hidden">
          {["Struk Transaksi", "Struk Pesanan", "Struk Dapur"].map((label, idx) => (
            <div
              key={label}
              className={`flex items-center justify-between px-5 py-4 ${idx !== 2 ? "border-b" : ""} bg-white`}
            >
              <div>
                <div className="font-semibold">{label}</div>
                <div className="text-sm text-gray-500 mt-0.5">Belum ada yang terhubung</div>
              </div>
              <button
                className="text-sm border border-violet-600 text-violet-700 rounded-full px-4 py-2 hover:bg-violet-50 transition"
                onClick={() => alert(`Tambah printer untuk ${label}`)}
              >
                + Tambah
              </button>
            </div>
          ))}

          {/* Struk Label - Coming soon */}
          <div className="flex items-center justify-between px-5 py-4 bg-white">
            <div className="font-semibold">Struk Label</div>
            <span className="bg-yellow-400 text-white px-4 py-1.5 text-xs font-semibold rounded-full">
              Coming Soon!
            </span>
          </div>
        </div>
      </main>

      {/* Mobile content (opsional): tampilkan konten kanan di bawah sidebar saat layar kecil */}
      <section className="lg:hidden w-full p-5 border-t">
        <h3 className="text-base font-semibold mb-3">PENGATURAN PRINTER</h3>
        <div className="space-y-3">
          {["Struk Transaksi", "Struk Pesanan", "Struk Dapur"].map((label) => (
            <div key={label} className="p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Belum ada yang terhubung</div>
                </div>
                <button
                  className="text-xs border border-violet-600 text-violet-700 rounded-full px-3 py-1.5 hover:bg-violet-50 transition"
                  onClick={() => alert(`Tambah printer untuk ${label}`)}
                >
                  + Tambah
                </button>
              </div>
            </div>
          ))}
          <div className="p-4 rounded-xl border flex items-center justify-between">
            <div className="font-medium">Struk Label</div>
            <span className="bg-yellow-400 text-white px-3 py-1 text-[10px] font-semibold rounded-full">
              Coming Soon!
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}