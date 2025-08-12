import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { MdPrint, MdCheck } from "react-icons/md";
import { useNavbar } from "../../hooks/useNavbar";
import logo from "../../assets/images/logo/logo.png";

const PAPER_MM = 58;   // lebar kertas
const PAD_X_MM = 2;    // padding kiri/kanan
const PAD_Y_MM = 3;    // padding atas/bawah
const OFFSET_MM = 3;   // geser seluruh struk ke kanan

const Struk = () => {
  const navigate = useNavigate();
  const [lastPaidOrder, setLastPaidOrder] = useState(null);

  const previewRef = useRef(null); // iframe preview

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

  // =============== HTML & CSS YANG SAMA UNTUK PREVIEW & PRINT ===============

  const buildCSS = useCallback(() => {
    return `
      @page { size: ${PAPER_MM}mm auto; margin: 0; }
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

      .receipt {
        width: ${PAPER_MM}mm;
        padding: ${PAD_Y_MM}mm ${PAD_X_MM}mm;
        transform: translateX(${OFFSET_MM}mm); /* geser kanan */
        font-size: 13.5px;
        line-height: 1.35;
        font-weight: 800;
      }
      .receipt * { font-weight: 800; }

      .center { text-align:center; }
      .bold { font-weight: 900; }
      .small { font-size: 12px; }
      .sep { border-top: 1px dashed #000; margin: 1.2mm 0; }
      .row {
        display:flex;
        gap: 5mm;
        align-items: baseline;
      }
      .muted { opacity:.85; }
      .mt2 { margin-top: 2px; }
      .mt4 { margin-top: 4px; }
      .wrap { word-break: break-word; }
      .row span:last-child { white-space: nowrap; }
      .item { break-inside: avoid; page-break-inside: avoid; }

      .logo {
        display:block;
        width: 15mm;
        height: auto;
        margin: 0 auto 1.2mm;
        border-radius: 9999px;
        overflow: hidden;
        border: 0.6mm solid #000;  /* circular border */
      }
    `;
  }, []);

  const buildReceiptHTML = useCallback(() => {
    if (!lastPaidOrder) return "";

    const itemsHtml = (lastPaidOrder.items || [])
      .map(
        (item) => `
          <div class="item" style="margin-bottom:3px;">
            <div class="row">
              <span class="wrap">${item.nama}</span>
              <span>Rp ${(item.quantity * item.hargaJual).toLocaleString("id-ID")}</span>
            </div>
            <div class="row muted">
              <span>${item.quantity} x Rp ${item.hargaJual.toLocaleString("id-ID")}</span>
              <span></span>
            </div>
          </div>
        `
      )
      .join("");

    return `
      <div class="receipt">
        <img src="${logo}" alt="Logo" class="logo" />
        <div class="center bold" style="font-size:14px;">TOKO SEMBAKO</div>
        <div class="sep"></div>

        <div class="small">
          <div class="row">
            <span>${new Date(lastPaidOrder.paidAt).toLocaleDateString("id-ID")} ${new Date(lastPaidOrder.paidAt).toLocaleTimeString("id-ID")}</span>
            <span class="muted">${lastPaidOrder.customer || ""}</span>
          </div>
        </div>

        <div class="sep"></div>

        <div class="small">
          ${itemsHtml}
        </div>

        <div class="sep"></div>

        <div class="small">
          <div class="row bold">
            <span>Total</span>
            <span>Rp ${lastPaidOrder.total.toLocaleString("id-ID")}</span>
          </div>
          <div class="row mt2">
            <span>Bayar (cash)</span>
            <span>Rp ${(lastPaidOrder.paidAmount || lastPaidOrder.total).toLocaleString("id-ID")}</span>
          </div>
          <div class="row mt2">
            <span>Kembali</span>
            <span>Rp ${kembalian.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div class="center small mt4 muted">Terima kasih 🙏</div>
      </div>
    `;
  }, [lastPaidOrder, kembalian]);

  const buildDocument = useCallback(
    (bodyInner) => `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>${buildCSS()}</style>
        </head>
        <body>${bodyInner}</body>
      </html>
    `,
    [buildCSS]
  );

  // ====== PREVIEW: tulis HTML yang sama ke iframe ======
  const renderPreview = useCallback(() => {
    if (!previewRef.current || !lastPaidOrder) return;
    const doc =
      previewRef.current.contentDocument ||
      previewRef.current.contentWindow?.document;
    if (!doc) return;

    const html = buildDocument(buildReceiptHTML());
    doc.open();
    doc.write(html);
    doc.close();
  }, [buildDocument, buildReceiptHTML, lastPaidOrder]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  // ====== PRINT: pakai dokumen yang sama (1:1) ======
  const handlePrint = useCallback(() => {
    if (!lastPaidOrder) return;
    const win = window.open("", "", "width=420,height=700");
    const html = buildDocument(`
      ${buildReceiptHTML()}
      <script>
        window.addEventListener('load', function(){
          var imgs = Array.prototype.slice.call(document.images);
          Promise.all(imgs.map(function(img){
            return img.complete ? Promise.resolve() : new Promise(function(res){ img.onload = img.onerror = res; });
          })).then(function(){
            setTimeout(function(){ window.print(); }, 50);
          });
        });
      </script>
    `);
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
  }, [buildDocument, buildReceiptHTML, lastPaidOrder]);

  // ====== Selesai ======
  const handleDone = useCallback(() => {
    navigate("/pos");
  }, [navigate]);

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

  useNavbar({ variant: "page", title: "Struk", backTo: "/pos", actions }, [actions]);

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

      {/* Kanan — PREVIEW 1:1 (pakai iframe berisi HTML yang sama persis dengan print) */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <iframe
          ref={previewRef}
          title="Preview Struk"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "transparent",
          }}
        />
      </div>
    </div>
  );
};

export default Struk;