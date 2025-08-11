import React, { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdClose, MdSave } from "react-icons/md";
import { useNavbar } from "../../hooks/useNavbar";

const BuatPesanan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems = [], totalPrice = 0 } = location.state || {};

  const [tipeLayanan, setTipeLayanan] = useState("Dine in");
  const [namaTransaksi, setNamaTransaksi] = useState("");
  const [pelanggan, setPelanggan] = useState("");
  const [noMeja, setNoMeja] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [lihatReview, setLihatReview] = useState(false);

  const handleSimpan = useCallback(
    (event) => {
      event?.preventDefault?.();

      if (!namaTransaksi) {
        alert("Nama Transaksi wajib diisi");
        return;
      }

      const newOrder = {
        id: Date.now(),
        customer: namaTransaksi,
        date: new Date().toISOString(),
        items: cartItems,
        total: totalPrice,

        tipeLayanan,
        pelanggan,
        noMeja,
        jatuhTempo,
        keterangan,
        author: "user",
      };

      const savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];
      localStorage.setItem("savedOrders", JSON.stringify([...savedOrders, newOrder]));
      localStorage.setItem("lastSavedOrderId", newOrder.id);

      if (lihatReview) {
        navigate("/review");
      } else {
        navigate("/pos");
      }
    },
    [
      namaTransaksi,
      cartItems,
      totalPrice,
      tipeLayanan,
      pelanggan,
      noMeja,
      jatuhTempo,
      keterangan,
      lihatReview,
      navigate,
    ]
  );

  const onCancel = useCallback(() => navigate(-1), [navigate]);
  const onSave = useCallback(() => handleSimpan(), [handleSimpan]);

  useNavbar(
    {
      variant: "page",
      title: "Buat Pesanan",
      backTo: "/pos",
      actions: [
        {
          type: "button",
          title: "Batal",
          onClick: onCancel,
          className:
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100",
          icon: <MdClose size={18} />,
        },
        {
          type: "button",
          title: "Simpan",
          onClick: onSave,
          className:
            "inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700",
          icon: <MdSave size={18} />,
        },
      ],
    },
    [onCancel, onSave]
  );

  return (
    <div className="bg-white w-full h-full flex flex-col">

      <div className="px-6 py-4 flex flex-wrap gap-3 justify-start bg-white">
        {["Dine in", "Take away", "Delivery", "Drive Thru"].map((label) => (
          <button
            key={label}
            onClick={() => setTipeLayanan(label)}
            className={`${
              tipeLayanan === label
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-full text-base transition`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-6 flex-grow overflow-auto w-full">
        <form onSubmit={handleSimpan} className="space-y-6 text-lg w-full">
          <div className="w-full">
            <label className="text-gray-700 block mb-2 text-base font-medium">
              Nama Transaksi
            </label>
            <input
              type="text"
              placeholder="Nama Transaksi"
              className="w-full border-2 border-gray-200 rounded-md px-5 py-4 focus:outline-none focus:border-green-500"
              value={namaTransaksi}
              onChange={(e) => setNamaTransaksi(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="w-full">
              <label className="text-gray-700 block mb-2 text-base font-medium">
                Pelanggan
              </label>
              <input
                type="text"
                placeholder="Pelanggan"
                className="border-2 border-gray-200 rounded-md px-5 py-4 w-full focus:outline-none focus:border-green-500"
                value={pelanggan}
                onChange={(e) => setPelanggan(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="text-gray-700 block mb-2 text-base font-medium">
                No. Meja
              </label>
              <input
                type="text"
                placeholder="No. Meja"
                className="border-2 border-gray-200 rounded-md px-5 py-4 w-full focus:outline-none focus:border-green-500"
                value={noMeja}
                onChange={(e) => setNoMeja(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="text-gray-700 block mb-2 text-base font-medium">
                Jatuh Tempo
              </label>
              <div className="relative w-full">
                <input
                  type="date"
                  placeholder="Jatuh Tempo"
                  className="border-2 border-gray-200 rounded-md px-5 py-4 w-full pr-14 focus:outline-none focus:border-green-500"
                  value={jatuhTempo}
                  onChange={(e) => setJatuhTempo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="text-gray-700 block mb-2 text-base font-medium">
              Keterangan Struk
            </label>
            <input
              type="text"
              placeholder="Keterangan Struk"
              className="w-full border-2 border-gray-200 px-5 py-4 rounded-md text-base focus:outline-none focus:border-green-500"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />
          </div>

          <label className="flex items-center space-x-3 text-base">
            <input
              type="checkbox"
              className="form-checkbox text-green-600 w-5 h-5 accent-green-600"
              checked={lihatReview}
              onChange={(e) => setLihatReview(e.target.checked)}
            />
            <span className="font-medium text-gray-900">
              Lihat Review Setelah Simpan
            </span>
          </label>

          <p className="text-center text-gray-500 text-sm">
            Cetak Pesanan Dapat Dilakukan Di Halaman Review
          </p>
        </form>
      </div>

      <div className="flex justify-between items-center px-6 py-6 border-t border-gray-300 bg-white">
        <Link
          to="/pos"
          className="px-6 py-3 text-base text-gray-700 border border-gray-400 rounded-md hover:bg-gray-100"
        >
          Batal (Esc)
        </Link>
        <button
          onClick={handleSimpan}
          className="px-6 py-3 text-base bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        >
          Simpan
        </button>
      </div>
    </div>
  );
};

export default BuatPesanan;