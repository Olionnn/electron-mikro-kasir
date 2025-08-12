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

  // Print (stabil untuk dipakai di Navbar actions)
  const handlePrint = useCallback(() => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=320,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            @page { size: 57mm 18mm; margin: 0; }
            * { box-sizing: border-box; }
            html, body { margin:0; padding:0; }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Helvetica Neue", sans-serif;
              color:#000;
              -webkit-font-smoothing: antialiased;
              text-rendering: geometricPrecision;
            }

            /* Kertas tetap 57x18mm; konten di-scale supaya tidak terpotong */
            .paper {
              width: 57mm;
              height: 18mm;
              padding: 2mm;                /* padding sesuai permintaan */
              overflow: hidden;            /* biar tidak spill */
            }
            .content {
              transform-origin: top left;   /* penting untuk scale */
            }

            /* Semua teks bold & agak besar */
            .all-bold, .all-bold * { 
              font-weight: 800 !important;
            }
            .receipt {
              font-size: 12px;              /* sedikit lebih besar */
              line-height: 1.25;
            }

            .center { text-align:center; }
            .bold { font-weight: 900; }
            .small { font-size: 11px; }
            .sep { border-top: 1px dashed #000; margin: 1mm 0; }
            .row {
              display:flex;
              justify-content: space-between;
              gap: 4px;
            }
            .muted { opacity: .8; }
            .mt2 { margin-top: 2px; }
            .mt4 { margin-top: 4px; }

            /* Harga/angka kanan tidak kepecah */
            .row span:last-child { white-space: nowrap; }
            .wrap { word-break: break-word; }

            /* Logo kecil di tengah */
            .logo {
              display:block;
              width: 8mm;
              height: auto;
              margin: 0 auto 1mm;
            }
          </style>
        </head>
        <body>
          <div class="paper">
            <div class="content">
              ${printContents}
            </div>
          </div>

          <script>
            (function() {
              function whenImagesReady() {
                var imgs = Array.prototype.slice.call(document.images);
                if (imgs.length === 0) return Promise.resolve();
                return Promise.all(imgs.map(function(img){
                  return img.complete ? Promise.resolve() : new Promise(function(res){ img.onload = img.onerror = res; });
                }));
              }

              function fitToPaper() {
                var paper = document.querySelector('.paper');
                var content = document.querySelector('.content');
                if (!paper || !content) return;

                // reset scale dulu
                content.style.transform = 'none';

                var availH = paper.clientHeight;
                var availW = paper.clientWidth;
                var contentH = content.scrollHeight;
                var contentW = content.scrollWidth;

                var scaleH = availH / contentH;
                var scaleW = availW / contentW;
                var scale = Math.min(1, scaleH, scaleW); // jangan lebih besar dari 1

                content.style.transform = 'scale(' + scale + ')';
              }

              window.addEventListener('load', function(){
                whenImagesReady().then(function(){
                  fitToPaper();
                  setTimeout(function(){ window.print(); }, 100);
                });
              });

              window.addEventListener('resize', fitToPaper);
            })();
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

      {/* Kanan - Preview Struk (samakan ukuran kertas) */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <div
          ref={printRef}
          className="all-bold receipt bg-white shadow border rounded"
          style={{
            width: "57mm",
            height: "18mm",
            padding: "2mm",
            overflow: "hidden", // preview juga tidak spill
          }}
        >
          {/* Logo di tengah */}
          <img src={logo} alt="Logo" className="logo" />

          {/* Header toko */}
          <div className="center bold" style={{ fontSize: 13 }}>
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
            {/* contoh meja; hapus jika tak perlu */}
            <div className="mt2 muted">Meja 3/1</div>
          </div>

          <div className="sep" />

          {/* Items */}
          <div className="small">
            {lastPaidOrder.items.map((item, idx) => (
              <div key={idx} style={{ marginBottom: 3 }}>
                <div className="row">
                  <span className="wrap">{item.nama}</span>
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

          <div className="center small mt4 muted">Terima kasih 🙏</div>
        </div>
      </div>
    </div>
  );
};

export default Struk;