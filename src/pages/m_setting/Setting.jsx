import React, { useState } from "react";
import Bantuan from "./Bantuan";
import InformasiToko from "./InformasiToko";
import CountStruk from "./CountStruk";
import CountPrint from "./CountPrint";
import SingkronasiDon from "./SingkronasiDon";
import SingkronasiUp from "./SingkronasiUp";
import EDC from "./EDC";
import EditProfil from "./EditProfil";
import EditToko from "./EditToko";
import MetPem from "./MetPem";
import Profil from "./Profil";
import Lainnya from "./Lainnya";
import ManajemenStaf from "./ManajemenStaf";

const menuItems = [
  { 
    icon: "person", 
    label: "Profil", 
    id: "profil",
    description: "Kelola informasi profil akun Anda",
    status: "Aktif",
    component: "Profil"
  },
  { 
    icon: "store", 
    label: "Informasi Toko", 
    id: "toko",
    description: "Atur detail dan informasi toko",
    status: "Perlu Dilengkapi",
    component: "InformasiToko"
  },
  { 
    icon: "sync", 
    label: "Sinkronisasi", 
    id: "sync",
    description: "Backup dan sinkronisasi data",
    status: "Tersinkron",
    hasSubmenu: true,
    submenu: [
      { label: "Upload Data", component: "SingkronasiUp", id: "sync-up" },
      { label: "Download Data", component: "SingkronasiDon", id: "sync-down" }
    ]
  },
  { 
    icon: "print", 
    label: "Printer dan Struk", 
    id: "printer",
    description: "Konfigurasi printer dan format struk",
    status: "Belum Terhubung",
    hasSubmenu: true,
    submenu: [
      { label: "Pengaturan Printer", component: "CountPrint", id: "print-setup" },
      { label: "Pengaturan Struk", component: "CountStruk", id: "receipt-setup" }
    ]
  },
  { 
    icon: "group", 
    label: "Manajemen Staff", 
    id: "staff",
    description: "Kelola akses dan hak staff",
    status: "Kosong",
    component: "ManajemenStaf"
  },
  { 
    icon: "credit_card", 
    label: "Metode Pembayaran", 
    id: "payment",
    description: "Atur metode pembayaran yang diterima",
    status: "9 Aktif",
    component: "MetPem"
  },
  { 
    icon: "devices_other", 
    label: "Perangkat EDC", 
    id: "edc",
    description: "Hubungkan perangkat EDC/ECR",
    status: "Belum Terhubung",
    component: "EDC"
  },
  { 
    icon: "settings", 
    label: "Pengaturan Transaksi", 
    id: "transaksi",
    description: "Konfigurasi pengaturan transaksi",
    status: "Default",
    component: "EditToko"
  },
  { 
    icon: "star_rate", 
    label: "Rating Apps", 
    id: "rating",
    description: "Berikan rating untuk aplikasi",
    status: "Belum Rating",
    component: "Bantuan"
  },
  { 
    icon: "more_vert", 
    label: "Lainnya", 
    id: "lainnya",
    description: "Pengaturan tambahan dan bantuan",
    status: "3 Item",
    component: "Lainnya"
  },
];

export default function SettingsPage() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const getStatusColor = (status) => {
    if (status.includes("Aktif") || status.includes("Tersinkron")) return "text-green-600 bg-green-100";
    if (status.includes("Perlu") || status.includes("Belum")) return "text-orange-600 bg-orange-100";
    if (status.includes("Kosong")) return "text-red-600 bg-red-100";
    return "text-blue-600 bg-blue-100";
  };

  const renderComponent = () => {
    if (!selectedMenu) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
          <span className="material-icons text-8xl mb-4 text-gray-300">settings</span>
          <h3 className="text-2xl font-semibold mb-2">Selamat Datang di Pengaturan</h3>
          <p className="text-center max-w-md text-lg">
            Pilih menu di sebelah kiri untuk mulai mengatur dan mengelola sistem Anda
          </p>
        </div>
      );
    }

    const componentMap = {
      Profil: <Profil />,
      InformasiToko: <InformasiToko />,
      SingkronasiUp: <SingkronasiUp />,
      SingkronasiDon: <SingkronasiDon />,
      CountPrint: <CountPrint />,
      CountStruk: <CountStruk />,
      ManajemenStaf: <ManajemenStaf />,
      MetPem: <MetPem />,
      EDC: <EDC />,
      EditToko: <EditToko />,
      Bantuan: <Bantuan />,
      Lainnya: <Lainnya />
    };

    return componentMap[selectedMenu] || (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-xl">Komponen tidak ditemukan</p>
      </div>
    );
  };

  const handleMenuClick = (item) => {
    if (item.hasSubmenu) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else if (item.component) {
      setSelectedMenu(item.component);
      setExpandedMenu(null);
    }
  };

  const handleSubmenuClick = (component) => {
    setSelectedMenu(component);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center px-6 py-4 bg-white shadow-md">
        <span className="material-icons mr-3 cursor-pointer">menu</span>
        <h1 className="text-2xl font-bold">PENGATURAN</h1>
      </header>

      {/* Container */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-72px)]">
        {/* Sidebar */}
        <div className="w-full lg:w-2/5 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Info Akun */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
              <div className="bg-white bg-opacity-20 p-3 rounded-md">
                <span className="material-icons">point_of_sale</span>
              </div>
              <div>
                <p className="font-semibold">beastbeeme2@gmail.com</p>
                <p className="text-sm text-green-100">version 2.7.0 • db version 12</p>
              </div>
            </div>

            {/* Menu */}
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <div
                    onClick={() => handleMenuClick(item)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedMenu === item.component || expandedMenu === item.id
                        ? "bg-green-50 border-green-200 shadow-sm"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`material-icons text-xl ${
                          selectedMenu === item.component || expandedMenu === item.id 
                            ? "text-green-600" : "text-gray-500"
                        }`}>
                          {item.icon}
                        </span>
                        <div>
                          <span className="font-medium">{item.label}</span>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`material-icons text-lg ${
                          selectedMenu === item.component || expandedMenu === item.id 
                            ? "text-green-600" : "text-gray-400"
                        }`}>
                          {item.hasSubmenu ? (expandedMenu === item.id ? "expand_less" : "expand_more") : "chevron_right"}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submenu */}
                  {item.hasSubmenu && expandedMenu === item.id && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <div
                          key={subIndex}
                          onClick={() => handleSubmenuClick(subItem.component)}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedMenu === subItem.component
                              ? "bg-green-100 text-green-700"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-sm text-gray-400">subdirectory_arrow_right</span>
                            <span className="text-sm font-medium">{subItem.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

