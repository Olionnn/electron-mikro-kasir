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
import logo from "../../assets/images/logo/logo.png";

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

  // Print: lebar fix 58mm, tinggi otomatis, margin 0, mulai dari atas
  const handlePrint = useCallback(() => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=380,height=640");

    printWindow.document.write(`
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            @page { size: auto; margin: 0; } /* jangan ada margin, tinggi auto */
            * { box-sizing: border-box; }
            html, body { margin:0mm; padding:15mm; }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Helvetica Neue", sans-serif;
              color:#000;
              -webkit-font-smoothing: antialiased;
              text-rendering: geometricPrecision;
            }

            /* Konten struk */
            .receipt {
              width: 30mm;                /* pas lebar kertas */
              padding: 0mm 0mm;           /* ada padding rapi */
              font-size: 13.5px;          /* lebih besar */
              line-height: 1.35;          /* biar tidak patah */
              font-weight: 800;           /* semua lebih tebal */
            }
            .receipt * { font-weight: 800; } /* bold semua sesuai permintaan */

            .center { text-align:center; }
            .bold { font-weight: 900; }
            .small { font-size: 12px; }
            .sep { border-top: 1px dashed #000; margin: 1.2mm 0; }
            .row {
              display:flex;
              gap: 1mm;
              align-items: baseline;
            }
            .muted { opacity:.85; }
            .mt2 { margin-top: 2px; }
            .mt4 { margin-top: 4px; }
            .wrap { word-break: break-word; }
            .row span:last-child { white-space: nowrap; } /* angka kanan jangan pecah */

            /* Hindari putus di tengah item saat print */
            .item { break-inside: avoid; page-break-inside: avoid; }

            /* Logo kecil di tengah */
            .logo {
              display:block;
              width: 15mm;
              height: auto;
              margin: 0 auto 1.2mm;

              /* tambahkan ini: border bulat */
              border-radius: 9999px;              /* bikin rounded/circular */
              box-shadow: 0 0 0 0.6mm #000;       /* “border” melingkar tanpa ubah ukuran */
              /* alternatif kalau mau border asli:
                border: 1px solid #000;
                overflow: hidden;                // supaya gambar ikut membulat
              */
            }

            /* Pastikan mulai cetak dari paling atas tanpa ruang kosong */
            @media print {
              html, body { margin:0; padding:0; }
            }
          </style>
        </head>
        <body>
          ${printContents}
          <script>
            window.addEventListener('load', function(){
              // Pastikan semua gambar siap (logo) lalu langsung print
              var imgs = Array.prototype.slice.call(document.images);
              Promise.all(imgs.map(function(img){
                return img.complete ? Promise.resolve() : new Promise(function(res){ img.onload = img.onerror = res; });
              })).then(function(){
                setTimeout(function(){ window.print(); }, 50);
              });
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
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

      {/* Kanan - Preview Struk: samakan aturan print (tanpa tinggi paksa) */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <div
          ref={printRef}
          className="receipt bg-white shadow border rounded"
          style={{
            width: "58mm",
            padding: "3mm 2mm",
          }}
        >
          {/* Logo di tengah */}
          <img src={logo} alt="Logo" className="logo " />

          {/* Header toko */}
          <div className="center bold" style={{ fontSize: 14 }}>
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
          </div>

          <div className="sep" />

          {/* Items */}
          <div className="small">
            {lastPaidOrder.items.map((item, idx) => (
              <div className="item" key={idx} style={{ marginBottom: 3 }}>
                <div className="row">
                  <span className="wrap">{item.nama}</span>
                  <span>
                    Rp {(item.quantity * item.hargaJual).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="row muted">
                  <span>
                    {item.quantity} x Rp {item.hargaJual.toLocaleString("id-ID")}
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
                Rp {(lastPaidOrder.paidAmount || lastPaidOrder.total).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="row mt2">
              <span>Kembali</span>
              <span>Rp {kembalian.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="center small mt4 muted">Terima kasih 🙏</div>
        </div>
      </div>
    </div>
  );
};

export default Struk;