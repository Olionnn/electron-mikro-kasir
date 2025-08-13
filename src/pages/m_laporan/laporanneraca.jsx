import React from "react";

const cx = (...a) => a.filter(Boolean).join(" ");

const Card = ({ title, children, className = "" }) => (
  <div className={cx("bg-white rounded-xl border border-gray-200 shadow-sm", className)}>
    {title && (
      <div className="px-4 py-3 border-b">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

export default function LaporanNeraca() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Laporan Neraca</h1>
          <div className="flex items-center gap-2">
            <input
              type="date"
              defaultValue="2025-08-13"
              className="px-3 py-2 border rounded-lg text-sm"
            />
            <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
              Tampilkan
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Aset */}
            <div>
              <h2 className="font-semibold text-gray-800 mb-3">Aset</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-2 text-gray-700">Kas</td>
                    <td className="py-2 text-right text-gray-800 font-medium">Rp 5.000.000</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-700">Piutang Usaha</td>
                    <td className="py-2 text-right text-gray-800 font-medium">Rp 2.500.000</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 font-semibold text-gray-900">Total Aset</td>
                    <td className="py-2 text-right font-bold text-gray-900">Rp 7.500.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Kewajiban & Ekuitas */}
            <div>
              <h2 className="font-semibold text-gray-800 mb-3">Kewajiban</h2>
              <table className="w-full text-sm mb-6">
                <tbody>
                  <tr>
                    <td className="py-2 text-gray-700">Hutang Usaha</td>
                    <td className="py-2 text-right text-gray-800 font-medium">Rp 1.500.000</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-700">Hutang Bank</td>
                    <td className="py-2 text-right text-gray-800 font-medium">Rp 2.000.000</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 font-semibold text-gray-900">Total Kewajiban</td>
                    <td className="py-2 text-right font-bold text-gray-900">Rp 3.500.000</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="font-semibold text-gray-800 mb-3">Ekuitas</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-2 text-gray-700">Modal Pemilik</td>
                    <td className="py-2 text-right text-gray-800 font-medium">Rp 4.000.000</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 font-semibold text-gray-900">Total Ekuitas</td>
                    <td className="py-2 text-right font-bold text-gray-900">Rp 4.000.000</td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t mt-4 pt-2 font-bold text-gray-900 flex justify-between">
                <span>Total Kewajiban & Ekuitas</span>
                <span>Rp 7.500.000</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
