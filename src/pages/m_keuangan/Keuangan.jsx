import React, { useState, useCallback } from "react";
import { useNavbar } from "../../hooks/useNavbar"; // sesuaikan path jika beda
import { useNavigate } from "react-router-dom";

const Keuangan = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Pemasukan");
  const [nominal, setNominal] = useState("Rp 0");
  const [kontak, setKontak] = useState("");
  const [tanggal, setTanggal] = useState("2025-08-05");
  const [catatan, setCatatan] = useState("");
  const [cashdrawer, setCashdrawer] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState("0");

  const onSave = useCallback(() => {
    const payload = { tab, nominal, kontak, tanggal, catatan, cashdrawer };
    console.log("Simpan Keuangan:", payload);
    alert("Tersimpan (dummy). Cek console untuk payload.");
  }, [tab, nominal, kontak, tanggal, catatan, cashdrawer]);

    useNavbar(
        {
            variant: "page",
            title: "Keuangan",
            backTo: () => navigate(-1),
            actions: [
                // {
                //   type: "button",
                //   title: "Simpan",
                //   onClick: onSave,
                //   className:
                //     "inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700",
                // },
            ],
        },
        [onSave]
    );

  const handleCalcClick = (val) => {
    if (val === "AC") setCalcDisplay("0");
    else if (val === "→") setCalcDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    else if (val === ",") setCalcDisplay((prev) => (prev.includes(",") ? prev : prev + ","));
    else if (["÷", "×", "−", "+", "%", "±"].includes(val)) {
      // placeholder operator
    } else {
      setCalcDisplay((prev) => (prev === "0" ? val : prev + val));
    }
  };

  const kontakOptions = [
    { value: "", label: "Pilih Kontak" },
    { value: "kontak1", label: "Kontak 1" },
    { value: "kontak2", label: "Kontak 2" },
  ];

  const calcRows = [
    ["AC", "→", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["0", "0", ",", "±"],
  ];

  return (
    <div className="h-screen w-screen bg-white text-gray-800 font-sans flex flex-col">
      {/* Konten full-screen di bawah navbar global */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full flex flex-col xl:flex-row">
          {/* Kiri: Form (scroll sendiri) */}
          <div className="w-full xl:w-1/2 p-6 md:p-8 space-y-8 overflow-auto">
            {/* Tab */}
            <div className="inline-flex bg-gray-100 rounded-2xl p-1">
              <button
                className={`px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-lg md:text-xl transition ${
                  tab === "Pemasukan"
                    ? "bg-green-300 text-green-900 shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setTab("Pemasukan")}
              >
                Pemasukan
              </button>
              <button
                className={`px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-lg md:text-xl transition ${
                  tab === "Pengeluaran"
                    ? "bg-green-300 text-green-900 shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setTab("Pengeluaran")}
              >
                Pengeluaran
              </button>
            </div>

            {/* Nominal */}
            <div>
              <label className="block mb-2 md:mb-3 font-semibold text-lg md:text-xl text-gray-700">
                Nominal
              </label>
              <input
                type="text"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="w-full border rounded-2xl px-5 md:px-6 py-4 md:py-5 text-2xl md:text-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-sm text-gray-400 mt-2">Contoh: Rp 150.000</p>
            </div>

            {/* Kontak & Tanggal */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <label className="block mb-2 md:mb-3 font-semibold text-lg md:text-xl text-gray-700">
                  Kontak
                </label>
                <select
                  className="w-full border rounded-2xl px-5 md:px-6 py-4 md:py-5 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  value={kontak}
                  onChange={(e) => setKontak(e.target.value)}
                >
                  {kontakOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-2 md:mb-3 font-semibold text-lg md:text-xl text-gray-700">
                  Tanggal Dibuat
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full border rounded-2xl px-5 md:px-6 py-4 md:py-5 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label className="block mb-2 md:mb-3 font-semibold text-lg md:text-xl text-gray-700">
                Catatan
              </label>
              <input
                type="text"
                placeholder="Catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full border rounded-2xl px-5 md:px-6 py-4 md:py-5 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Checkbox */}
            <label className="inline-flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-6 h-6 accent-green-600"
                checked={cashdrawer}
                onChange={() => setCashdrawer((v) => !v)}
              />
              <span className="text-lg md:text-xl">Masukkan ke Cashdrawer</span>
            </label>

            {/* Simpan (tetap di bawah form untuk UX, action utama ada di navbar) */}
            <button
              onClick={onSave}
              className="bg-green-600 hover:bg-green-700 active:scale-[0.99] transition text-white font-bold py-4 md:py-5 w-full rounded-2xl text-2xl md:text-3xl shadow-sm"
            >
              SIMPAN
            </button>
          </div>

          {/* Kanan: Kalkulator (scroll sendiri) */}
          <div className="w-full xl:w-1/2 p-6 md:p-8 bg-gray-50 overflow-auto">
            <div className="text-right text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              {calcDisplay}
            </div>

            <div className="grid grid-cols-4 gap-3 md:gap-4 text-center text-2xl md:text-3xl font-bold">
              {calcRows.map((row, rIdx) =>
                row.map((btn, cIdx) => {
                  const isWideZero = rIdx === 4 && cIdx === 0;
                  const isFunction = ["AC", "→", "%"].includes(btn);
                  const isOperator = ["÷", "×", "−", "+", "±"].includes(btn);
                  return (
                    <button
                      key={`${rIdx}-${cIdx}-${btn}`}
                      className={
                        "py-5 md:py-6 rounded-xl transition active:scale-[0.99] " +
                        (isWideZero ? "col-span-2 " : "") +
                        (isFunction
                          ? "bg-green-100 hover:bg-green-200"
                          : isOperator
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-white border hover:bg-gray-50")
                      }
                      onClick={() => handleCalcClick(btn)}
                    >
                      {btn}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keuangan;