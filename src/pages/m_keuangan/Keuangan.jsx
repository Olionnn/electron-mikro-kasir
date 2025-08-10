import React, { useState } from "react";

const Keuangan = () => {
    const [tab, setTab] = useState("Pemasukan");
    const [nominal, setNominal] = useState("Rp 0");
    const [kontak, setKontak] = useState("");
    const [tanggal, setTanggal] = useState("2025-08-05");
    const [catatan, setCatatan] = useState("");
    const [cashdrawer, setCashdrawer] = useState(false);
    const [calcDisplay, setCalcDisplay] = useState("0");

    // Dummy kontak options
    const kontakOptions = [
        { value: "", label: "Pilih Kontak" },
        { value: "kontak1", label: "Kontak 1" },
        { value: "kontak2", label: "Kontak 2" },
    ];

    // Kalkulator handler (dummy, implement as needed)
    const handleCalcClick = (val) => {
        if (val === "AC") setCalcDisplay("0");
        else if (val === "→") setCalcDisplay(calcDisplay.slice(0, -1) || "0");
        else if (val === ",") setCalcDisplay((prev) => (prev.includes(",") ? prev : prev + ","));
        else if (["÷", "×", "−", "+", "%", "±"].includes(val)) {
            // Implement operator logic as needed
        } else {
            setCalcDisplay((prev) => (prev === "0" ? val : prev + val));
        }
    };

    const calcButtons = [
        ["AC", "→", "%", "÷"],
        ["7", "8", "9", "×"],
        ["4", "5", "6", "−"],
        ["1", "2", "3", "+"],
        ["0", "0", ",", "±"],
    ];

    return (
        <div className="bg-white text-gray-800 text-2xl md:text-3xl font-sans min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
                <button className="text-4xl">☰</button>
                <h1 className="text-4xl font-bold">Keuangan</h1>
                <span className="opacity-0">dummy</span>
            </div>

            <div className="flex flex-col xl:flex-row">
                {/* Form Kiri */}
                <div className="w-full xl:w-1/2 p-8 space-y-8">
                    {/* Tab */}
                    <div className="flex space-x-6">
                        <button
                            className={`px-10 py-4 rounded-xl font-bold ${
                                tab === "Pemasukan"
                                    ? "bg-green-300 text-green-900"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                            onClick={() => setTab("Pemasukan")}
                        >
                            Pemasukan
                        </button>
                        <button
                            className={`px-10 py-4 rounded-xl ${
                                tab === "Pengeluaran"
                                    ? "bg-green-300 text-green-900 font-bold"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                            onClick={() => setTab("Pengeluaran")}
                        >
                            Pengeluaran
                        </button>
                    </div>

                    {/* Nominal */}
                    <div>
                        <label className="block mb-3 font-bold">Nominal</label>
                        <input
                            type="text"
                            value={nominal}
                            onChange={(e) => setNominal(e.target.value)}
                            className="w-full border rounded-xl px-6 py-5 text-3xl focus:outline-none"
                        />
                    </div>

                    {/* Kontak dan Tanggal */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block mb-3 font-bold">Kontak</label>
                            <select
                                className="w-full border rounded-xl px-6 py-5 text-xl"
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
                            <label className="block mb-3 font-bold">Tanggal Dibuat</label>
                            <input
                                type="date"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                                className="w-full border rounded-xl px-6 py-5 text-xl"
                            />
                        </div>
                    </div>

                    {/* Catatan */}
                    <div>
                        <label className="block mb-3 font-bold">Catatan</label>
                        <input
                            type="text"
                            placeholder="Catatan"
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            className="w-full border rounded-xl px-6 py-5 text-xl"
                        />
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            id="cashdrawer"
                            className="w-6 h-6"
                            checked={cashdrawer}
                            onChange={() => setCashdrawer((v) => !v)}
                        />
                        <label htmlFor="cashdrawer" className="text-xl">
                            Masukkan ke Cashdrawer
                        </label>
                    </div>

                    {/* Simpan */}
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-5 w-full rounded-xl text-3xl">
                        SIMPAN
                    </button>
                </div>

                {/* Kalkulator Kanan */}
                <div className="w-full xl:w-1/2 p-8 bg-gray-50">
                    <div className="text-right text-5xl font-bold mb-6">{calcDisplay}</div>
                    <div className="grid grid-cols-4 gap-4 text-center text-3xl font-bold">
                        {/* Kalkulator Buttons */}
                        {[
                            ["AC", "→", "%", "÷"],
                            ["7", "8", "9", "×"],
                            ["4", "5", "6", "−"],
                            ["1", "2", "3", "+"],
                            ["0", "0", ",", "±"],
                        ].flat().map((btn, idx) =>
                            btn === "0" && idx === 16 ? (
                                <button
                                    key={idx}
                                    className="bg-white border col-span-2 py-6 rounded-lg"
                                    style={{ gridColumn: "span 2 / span 2" }}
                                    onClick={() => handleCalcClick(btn)}
                                >
                                    {btn}
                                </button>
                            ) : (
                                <button
                                    key={idx}
                                    className={`py-6 rounded-lg ${
                                        ["AC", "→", "%"].includes(btn)
                                            ? "bg-green-100"
                                            : ["÷", "×", "−", "+", "±"].includes(btn)
                                            ? "bg-green-600 text-white"
                                            : "bg-white border"
                                    }`}
                                    onClick={() => handleCalcClick(btn)}
                                >
                                    {btn}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Keuangan;