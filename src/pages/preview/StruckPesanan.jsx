import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { MdPrint, MdCheck } from "react-icons/md";
import { useNavbar } from "../../hooks/useNavbar";

const Struk = () => {
  const navigate = useNavigate();
  const [lastPaidOrder, setLastPaidOrder] = useState(null);
  const printRef = useRef();

  // Ambil data struk terakhir
  useEffect(() => {
    const paidOrders = JSON.parse(localStorage.getItem("paidOrders")) || [];
    if (paidOrders.length > 0) {
      setLastPaidOrder(paidOrders[paidOrders.length - 1]);
    } else {
      navigate("/pesanan");
    }
  }, [navigate]);

  const kembalian = useMemo(
    () =>
      (lastPaidOrder?.paidAmount || lastPaidOrder?.total || 0) -
      (lastPaidOrder?.total || 0),
    [lastPaidOrder]
  );

  // Print (dibuat stabil untuk dipakai di Navbar actions)
  const handlePrint = useCallback(() => {
    if (!printRef.current) return;
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
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, []);

  // Selesai → kembali ke POS
  const handleDone = useCallback(() => {
    navigate("/pos");
  }, [navigate]);

  // Shortcut Enter -> Selesai
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleDone();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleDone]);

  // Pasang Navbar (back & actions)
  const actions = useMemo(
    () => [
      {
        type: "button",
        title: "Cetak Struk",
        onClick: handlePrint,
        className:
          "inline-flex items-center gap-2 bg-white border px-3 py-2 rounded-lg hover:bg-gray-100",
        icon: <MdPrint size={20} />,
      },
      {
        type: "button",
        title: "Selesai (Enter)",
        onClick: handleDone,
        label: "Selesai (Enter)",
        className:
          "bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700",
        icon: <MdCheck size={18} />,
      },
    ],
    [handlePrint, handleDone]
  );

  useNavbar(
    { variant: "page", title: "Struk", backTo: "/pos", actions },
    [actions]
  );

  if (!lastPaidOrder) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Tidak ada struk untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Kiri */}
      <div className="w-1/2 flex flex-col justify-between p-6 border-r">
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
          onClick={handleDone}
          className="bg-green-600 text-white w-full py-3 rounded-lg font-bold hover:bg-green-700"
        >
          Selesai (Enter)
        </button>
      </div>

      {/* Kanan - Preview Struk */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <div
          ref={printRef}
          className="bg-white receipt shadow border rounded"
          style={{ width: "58mm" }}
        >
          <h2 className="text-center font-bold text-sm">TOKO SEMBAKO</h2>
          <div className="dashed" />

          <div className="small">
            <div className="flex">
              <span>
                {new Date(lastPaidOrder.paidAt).toLocaleDateString("id-ID")}{" "}
                {new Date(lastPaidOrder.paidAt).toLocaleTimeString("id-ID")}
              </span>
              <span>{lastPaidOrder.customer}</span>
            </div>
            <div>Meja 3/1</div>
          </div>

          <div className="dashed" />

          <div className="small">
            {lastPaidOrder.items.map((item, idx) => (
              <div key={idx} className="flex">
                <span>
                  {item.nama}
                  <div>
                    {item.quantity} x Rp{" "}
                    {item.hargaJual.toLocaleString("id-ID")}
                  </div>
                </span>
                <span>
                  Rp {(item.quantity * item.hargaJual).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          <div className="dashed" />

          <div className="flex small font-bold">
            <span>Total</span>
            <span>Rp {lastPaidOrder.total.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex small">
            <span>Bayar (cash)</span>
            <span>
              Rp{" "}
              {(lastPaidOrder.paidAmount || lastPaidOrder.total).toLocaleString(
                "id-ID"
              )}
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