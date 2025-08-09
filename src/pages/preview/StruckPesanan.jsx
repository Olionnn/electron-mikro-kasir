import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const Struk = () => {
  const navigate = useNavigate();
  const [lastPaidOrder, setLastPaidOrder] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const paidOrders = JSON.parse(localStorage.getItem("paidOrders")) || [];
    if (paidOrders.length > 0) {
      setLastPaidOrder(paidOrders[paidOrders.length - 1]);
    } else {
      navigate("/pesanan");
    }
  }, [navigate]);

  if (!lastPaidOrder) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Tidak ada struk untuk ditampilkan</p>
      </div>
    );
  }

  const kembalian =
    (lastPaidOrder.paidAmount || lastPaidOrder.total) - lastPaidOrder.total;

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=300,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            @page { size: 58mm auto; margin: 0; }
            body { margin:0; padding:0; font-size:10px; font-family: 'Courier New', monospace; }
            .receipt { width: 58mm; padding: 4mm; }
            .text-center { text-align: center; }
            .dashed { border-top: 1px dashed #000; margin: 4px 0; }
            .flex { display: flex; justify-content: space-between; }
            .small { font-size: 9px; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="flex h-screen w-full font-sans">
      {/* Kiri */}
      <div className="w-1/2 flex flex-col justify-between bg-white p-6 no-print">
        <div>
          <h2 className="text-xl font-bold mb-6">TRANSAKSI</h2>
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center shadow-inner">
            <FaCheckCircle className="text-green-600 text-6xl mb-4" />
            <h3 className="text-lg font-semibold mb-2">Transaksi Berhasil</h3>

            <div className="w-full text-sm mt-4">
              <div className="flex justify-between py-1">
                <span>Kembalian</span>
                <span className="font-semibold">
                  Rp {kembalian.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="text-gray-500">{lastPaidOrder.customer}</div>
              <hr className="my-3" />
              <div className="space-y-2">
                <button
                  onClick={handlePrint}
                  className="w-full border rounded px-3 py-2 text-left hover:bg-gray-100"
                >
                  Cetak Struk
                </button>
                <button className="w-full border rounded px-3 py-2 text-left hover:bg-gray-100">
                  Cetak Struk Dapur <span className="text-xs">*Tanpa Harga</span>
                </button>
                <button className="w-full border rounded px-3 py-2 text-left hover:bg-gray-100">
                  Cetak Pesanan
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/pos")}
          className="bg-green-600 text-white w-full py-3 rounded-lg font-bold hover:bg-green-700"
        >
          Selesai (Enter)
        </button>
      </div>

      {/* Kanan - Receipt for print */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 p-6">
        <div ref={printRef} className="bg-white receipt">
          <h2 className="text-center font-bold text-sm">TOKO SEMBAKO</h2>
          <div className="dashed"></div>

          <div className="small">
            <div className="flex">
              <span>{new Date(lastPaidOrder.paidAt).toLocaleDateString("id-ID")} {new Date(lastPaidOrder.paidAt).toLocaleTimeString("id-ID")}</span>
              <span>{lastPaidOrder.customer}</span>
            </div>
            <div>Meja 3/1</div>
          </div>

          <div className="dashed"></div>

          <div className="small">
            {lastPaidOrder.items.map((item, idx) => (
              <div key={idx} className="flex">
                <span>
                  {item.nama}
                  <div>{item.quantity} x Rp {item.hargaJual.toLocaleString("id-ID")}</div>
                </span>
                <span>Rp {(item.quantity * item.hargaJual).toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>

          <div className="dashed"></div>

          <div className="flex small font-bold">
            <span>Total</span>
            <span>Rp {lastPaidOrder.total.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex small">
            <span>Bayar (cash)</span>
            <span>
              Rp {(lastPaidOrder.paidAmount || lastPaidOrder.total).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex small">
            <span>Kembali</span>
            <span>Rp {kembalian.toLocaleString("id-ID")}</span>
          </div>

          <div className="text-center small mt-2">Tidak Ada Keterangan</div>
        </div>
      </div>
    </div>
  );
};

export default Struk;
