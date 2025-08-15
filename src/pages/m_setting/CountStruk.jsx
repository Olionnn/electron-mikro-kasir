import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";
import {
  MdArrowBack,
  MdDownload,
  MdQrCode2,
  MdLink,
  MdRestartAlt,
  MdPrint,
  MdSave,
} from "react-icons/md";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={
        "relative inline-flex h-6 w-11 items-center rounded-full transition " +
        (checked ? "bg-green-500" : "bg-gray-300")
      }
      aria-pressed={checked}
    >
      <span
        className={
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition " +
          (checked ? "translate-x-5" : "translate-x-1")
        }
      />
    </button>
  );
}

export default function PengaturanStruk() {
  const navigate = useNavigate();

  const [showLogo, setShowLogo] = useState(true);
  const [logoChars, setLogoChars] = useState("16");
  const [logoCanvas, setLogoCanvas] = useState("16");
  const [showOnlineLink, setShowOnlineLink] = useState(false);
  const [showOnlineQR, setShowOnlineQR] = useState(true);

  const onBack = useCallback(() => navigate(-1), [navigate]);
  const onTestPrint = useCallback(() => alert("Tes print…"), []);
  const onSave = useCallback(() => alert("Simpan pengaturan…"), []);

  // Actions di Navbar
  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Tes Print",
        onClick: onTestPrint,
        className:
          "inline-flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-gray-100",
        icon: <MdPrint size={18} />,
      },
      {
        type: "button",
        title: "Simpan",
        onClick: onSave,
        className:
          "inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700",
        icon: <MdSave size={18} />,
        label: "Simpan",
      },
    ],
    [onTestPrint, onSave]
  );

  // Pasang Navbar global
  useNavbar(
    {
      variant: "page",
      title: "Pengaturan Struk",
      backTo: onBack, // pakai action back custom biar animasi/riwayat tetap
      actions: [
        {
          type: "button",
          title: "Kembali",
          onClick: onBack,
          className:
            "inline-flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-gray-100",
          icon: <MdArrowBack size={18} />,
        },
        ...actions,
      ],
    },
    [onBack, actions]
  );

  return (
    <div className="flex h-[calc(100vh-72px)] bg-white">
      {/* LEFT */}
      <div className="w-2/5 p-6 overflow-y-auto border-r">
        {/* Cloud download banner */}
        <div className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-3 rounded-xl">
          <div className="text-sm text-green-900">
            Klik untuk unduh pengaturan dari Cloud
          </div>
          <button
            className="inline-flex items-center justify-center bg-green-600 text-white w-9 h-9 rounded-full hover:bg-green-700"
            title="Download dari Cloud"
            onClick={() => alert("Download dari Cloud…")}
          >
            <MdDownload size={18} />
          </button>
        </div>

        {/* Logo */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="font-semibold text-lg">Tampilkan Logo</label>
            <Toggle checked={showLogo} onChange={() => setShowLogo((v) => !v)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Panjang Logo (Karakter)
              </label>
              <input
                type="text"
                value={logoChars}
                onChange={(e) => setLogoChars(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Panjang Canvas Logo
              </label>
              <input
                type="text"
                value={logoCanvas}
                onChange={(e) => setLogoCanvas(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-8 space-y-4">
          {[
            "Tampilkan Kode Struk",
            "Tampilkan No Urut",
            "Tampilkan Satuan Sebelah Qty",
            "Tampilkan Alamat Pelanggan",
            "Tampilkan Nomor Struk",
            "Tampilkan Total Kuantitas",
            "Tampilkan Kolom Tanda Tangan Hutang / Piutang",
            "Tampilkan tipe harga",
            "Pisah biaya admin toko",
          ].map((label, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm">{label}</span>
              <Toggle checked={false} onChange={() => {}} />
            </div>
          ))}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm">Tampilkan poin akhir pada struk</div>
              <div className="text-xs text-gray-500">
                (auto print nonaktif jika offline)
              </div>
            </div>
            <Toggle checked onChange={() => {}} />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Sembunyikan Persentase(%) Pajak</span>
            <Toggle checked onChange={() => {}} />
          </div>
        </div>

        <hr className="my-6" />

        {/* Struk online */}
        <div className="mb-3 font-semibold">Struk Online & Kritik/Saran</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowOnlineLink((v) => !v)}
            className={[
              "inline-flex items-center gap-2 px-3 py-2 rounded-lg border",
              showOnlineLink
                ? "border-green-500 text-green-700 bg-green-50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50",
            ].join(" ")}
            title="Mode Link"
          >
            <MdLink />
            Mode Link
          </button>
          <button
            onClick={() => setShowOnlineQR((v) => !v)}
            className={[
              "inline-flex items-center gap-2 px-3 py-2 rounded-lg border",
              showOnlineQR
                ? "border-green-500 text-green-700 bg-green-50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50",
            ].join(" ")}
            title="Mode QR Code"
          >
            <MdQrCode2 />
            Mode QR Code
          </button>
        </div>

        {/* Header/Footer note + nomor struk */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Keterangan Footer
            </label>
            <textarea
              rows={3}
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Keterangan Header
            </label>
            <textarea
              rows={3}
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-600">
              Nomor Struk
            </label>
            <input
              type="text"
              defaultValue="2"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
          <button
            className="inline-flex items-center gap-2 border border-green-600 text-green-700 px-3 py-2 rounded-lg hover:bg-green-50"
            onClick={() => alert("Reset nomor struk…")}
          >
            <MdRestartAlt />
            Reset Nomor Struk
          </button>
        </div>
      </div>

      {/* RIGHT – Preview */}
      <div className="w-3/5 bg-gray-50 p-6 flex flex-col items-center">
        <div className="text-center text-xs text-gray-600 border-b-2 border-green-500 w-full pb-2 mb-4">
          32 Karakter
        </div>

        <div className="bg-white shadow p-4 rounded-xl w-[200px] text-[11px] font-mono border">
          <div className="text-center font-bold mb-2">Abror G4nteng</div>
          <div className="border-t border-dashed border-black mb-2" />
          <div className="flex justify-between">
            <span>2025-08-06</span>
            <span>Kasir 1</span>
          </div>
          <div className="flex justify-between">
            <span>10:44:50</span>
            <span>Pelanggan 1</span>
          </div>
          <div className="border-t border-dashed border-black my-2" />

          <div className="flex justify-between">
            <span className="font-semibold">Jus Apel</span>
            <span>3.000</span>
          </div>
          <div className="text-[10px] text-gray-600">1 x 3.000</div>

          <div className="flex justify-between mt-1">
            <span className="font-semibold">Jus Mangga</span>
            <span>3.000</span>
          </div>
          <div className="text-[10px] text-gray-600">1 x 3.000</div>

          <div className="border-t border-dashed border-black my-2" />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>6.000</span>
          </div>
          <div className="flex justify-between">
            <span>Pajak : PPN</span>
            <span>1.000</span>
          </div>
          <div className="flex justify-between">
            <span>Bayar</span>
            <span>6.000</span>
          </div>
          <div className="flex justify-between">
            <span>Kembali</span>
            <span>0</span>
          </div>

        {/* QR / Link sesuai toggle */}
          {(showOnlineQR || showOnlineLink) && (
            <div className="flex flex-col items-center mt-3 gap-1">
              {showOnlineQR && (
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=contoh"
                  alt="QR Code"
                  className="h-20 w-20"
                />
              )}
              {showOnlineLink && (
                <div className="text-[10px] text-gray-600 underline">
                  kasirpintar.app/s/ABC123
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-2">
          *Preview hanya contoh tampilan
        </div>
      </div>
    </div>
  );
}