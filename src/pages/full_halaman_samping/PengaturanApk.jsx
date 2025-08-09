import React from "react";

const menuItems = [
  { icon: "person", label: "Profil" },
  { icon: "store", label: "Informasi Toko" },
  { icon: "sync", label: "Sinkronisasi" },
  { icon: "print", label: "Printer dan Struk" },
  { icon: "group", label: "Manajemen Staff" },
  { icon: "credit_card", label: "Metode Pembayaran" },
  { icon: "devices_other", label: "Perangkat EDC" },
  { icon: "settings", label: "Pengaturan Transaksi" },
  { icon: "star_rate", label: "Rating Apps" },
  { icon: "more_vert", label: "Lainnya" },
];

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center px-6 py-4 bg-white shadow-md">
        <span className="material-icons mr-3 cursor-pointer">menu</span>
        <h1 className="text-2xl font-bold">PENGATURAN</h1>
      </header>

      {/* Container */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-1/2 bg-white p-6 space-y-4">
          {/* Info Akun */}
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 text-white p-3 rounded-md">
              <span className="material-icons">point_of_sale</span>
            </div>
            <div>
              <p className="font-semibold">beastbeeme2@gmail.com</p>
              <p className="text-sm text-gray-600">version 2.7.0 db version 12</p>
            </div>
          </div>

          {/* Menu */}
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-md hover:bg-green-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-icons text-green-500">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className="material-icons">chevron_right</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:flex flex-1 items-center justify-center text-gray-500 text-center text-lg">
          PILIH MENU DI SEBELAH KIRI UNTUK MULAI MELAKUKAN PENGATURAN
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
