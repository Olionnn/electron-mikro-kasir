import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
          <meta charset="utf-8" />
          <style>
            @page { size: 58mm auto; margin: 0; }
            * { box-sizing: border-box; }
            html, body { margin:0; padding:0; }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace;
              color:#111;
            }
            .receipt {
              width: 40mm;               /* lebar efektif konten */
              margin: 0 auto;
              padding: 2mm 1.5mm;        /* padding tipis biar rapi */
              font-size: 10.5px;         /* sedikit lebih besar */
              line-height: 1.25;
            }
            .center { text-align:center; }
            .bold { font-weight: 700; }
            .small { font-size: 10px; }
            .sep { border-top: 1px dashed #000; margin: 6px 0; }
            .row {
              display:flex;
              justify-content: space-between;
              gap: 4px;
            }
            .muted { color:#555; }
            .mt2 { margin-top: 2px; }
            .mt4 { margin-top: 4px; }
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

  useNavbar({ variant: "page", title: "Struk", backTo: "/pos", actions }, [
    actions,
  ]);

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
                  Cetak Struk Dapur{" "}
                  <span className="text-xs">*Tanpa Harga</span>
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
          className="receipt bg-white shadow border rounded"
          style={{ width: "40mm" }} // preview sama seperti print
        >
          {/* Header toko */}
          <div className="center bold" style={{ fontSize: 12 }}>
            TOKO SEMBAKO
          </div>

          <div className="sep" />

          {/* Info tanggal & pelanggan */}
          <div className="small">
            <div className="row">
              <span>
                {new Date(lastPaidOrder.paidAt).toLocaleDateString("id-ID")}{" "}
                {new Date(lastPaidOrder.paidAt).toLocaleTimeString("id-ID")}
              </span>
              <span className="muted">{lastPaidOrder.customer}</span>
            </div>
            <div className="mt2 muted">Meja 3/1</div>
          </div>

          <div className="sep" />

          {/* Items */}
          <div className="small">
            {lastPaidOrder.items.map((item, idx) => (
              <div key={idx} style={{ marginBottom: 4 }}>
                <div className="row">
                  <span className="bold">{item.nama}</span>
                  <span>
                    Rp{" "}
                    {(item.quantity * item.hargaJual).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="row muted">
                  <span>
                    {item.quantity} x Rp{" "}
                    {item.hargaJual.toLocaleString("id-ID")}
                  </span>
                  <span />
                </div>
              </div>
            ))}
          </div>

          <div className="sep" />

          {/* Total & pembayaran */}
          <div className="small">
            <div className="row bold">
              <span>Total</span>
              <span>Rp {lastPaidOrder.total.toLocaleString("id-ID")}</span>
            </div>
            <div className="row mt2">
              <span>Bayar (cash)</span>
              <span>
                Rp{" "}
                {(
                  lastPaidOrder.paidAmount || lastPaidOrder.total
                ).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="row mt2">
              <span>Kembali</span>
              <span>Rp {kembalian.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="center small mt4 muted">Tidak Ada Keterangan</div>
        </div>
      </div>
    </div>
  );
};

export default Struk;
