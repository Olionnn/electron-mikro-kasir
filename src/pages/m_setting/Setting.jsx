  import React, { useState, useCallback } from "react";
  import { useNavigate } from "react-router-dom";
  import { useNavbar } from "../../hooks/useNavbar";

  // React Icons
  import { GoChevronRight, GoChevronDown } from "react-icons/go";
  import { IoPerson, IoSync } from "react-icons/io5";
  import { FaStore } from "react-icons/fa";
  import {
    MdOutlinePointOfSale,
    MdMenu,
    MdPrint,
    MdGroup,
    MdCreditCard,
    MdDevicesOther,
    MdSettings,
    MdStarRate,
    MdMoreVert,
    MdSubdirectoryArrowRight,
    MdSettingsApplications,
  } from "react-icons/md";

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
import ManagementRole from "./ManajemenRole";

  /** Semua icon sudah berupa element React */
  const menuItems = [
    { icon: <IoPerson />, label: "Profil", id: "profil", description: "Kelola informasi profil akun Anda", status: "Aktif", component: "Profil" },
    { icon: <FaStore />, label: "Informasi Toko", id: "toko", description: "Atur detail dan informasi toko", status: "Perlu Dilengkapi", component: "InformasiToko" },
    {
      icon: <IoSync />, label: "Sinkronisasi", id: "sync", description: "Backup dan sinkronisasi data", status: "Tersinkron",
      hasSubmenu: true,
      submenu: [
        { label: "Upload Data", component: "SingkronasiUp", id: "sync-up" },
        { label: "Download Data", component: "SingkronasiDon", id: "sync-down" }
      ]
    },
    // {
    //   icon: <MdPrint />, label: "Printer dan Struk", id: "printer", description: "Konfigurasi printer dan format struk", status: "Belum Terhubung",
    //   hasSubmenu: true,
    //   submenu: [
    //     { label: "Pengaturan Printer", component: "CountPrint", id: "print-setup" },
    //     { label: "Pengaturan Struk", component: "CountStruk", id: "receipt-setup" }
    //   ]
    // },
    {
      icon: <MdPrint />,
      label: "Printer dan Struk",
      id: "printer",
      description: "Konfigurasi printer dan format struk",
      status: "Belum Terhubung",
      hasSubmenu: true,            // HAPUS kalau mau langsung link
      submenu: [
        { label: "Pengaturan Printer",  route: "/pengaturan/printsetting"  }, 
        { label: "Pengaturan Struk", route: "/pengaturan/struksetting" }
      ],              // HAPUS submenu
     // ⬅️ tambahkan route
    },
    {
      icon: <MdGroup />,
      label: "Manajemen Staff",
      id: "staff",
      description: "Kelola akses dan hak staff",
      status: "Kosong",
      component: "ManajemenStaf",
      route: "/users/staff"            // ⬅️ tambahkan route
    },
    {
      icon: <MdGroup />,
      label: "Manajemen Role",
      id: "Role",
      description: "Kelola akses dan hak Role",
      status: "Kosong",
      component: "ManajemenRole",
      route: "/pengaturan/roles"            // ⬅️ tambahkan route
    },
    // { icon: <MdGroup />, label: "Manajemen Staff", id: "staff", description: "Kelola akses dan hak staff", status: "Kosong", component: "ManajemenStaf" },
    { icon: <MdCreditCard />, label: "Metode Pembayaran", id: "payment", description: "Atur metode pembayaran yang diterima", status: "9 Aktif", component: "MetPem" },
    { icon: <MdDevicesOther />, label: "Perangkat EDC", id: "edc", description: "Hubungkan perangkat EDC/ECR", status: "Belum Terhubung", component: "EDC" },
    // { icon: <MdSettingsApplications />, label: "Pengaturan Transaksi", id: "transaksi", description: "Konfigurasi pengaturan transaksi", status: "Default", component: "EditToko" },
    // { icon: <MdStarRate />, label: "Rating Apps", id: "rating", description: "Berikan rating untuk aplikasi", status: "Belum Rating", component: "Bantuan" },
    // { icon: <MdMoreVert />, label: "Lainnya", id: "lainnya", description: "Pengaturan tambahan dan bantuan", status: "3 Item", component: "Lainnya" },
  ];

  export default function SettingsPage() {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [expandedMenu, setExpandedMenu] = useState(null);
  
    const navigate = useNavigate();
    const onBack = useCallback(() => navigate(-1), [navigate]);
  
    useNavbar(
      {
        variant: "page",
        title: "Pengaturan",
        backTo: null,
        actions: [
          {
            type: "span",
            title: "Versi Aplikasi",
            className: "px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200",
            label: "v2.7.0",
          },
          {
            type: "span",
            title: "Versi Database",
            className: "px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200",
            label: "DB 12",
          },
        ],
      },
      
    );
  
    const getStatusColor = (status) => {
      if (status.includes("Aktif") || status.includes("Tersinkron")) return "text-green-700 bg-green-100 border border-green-200";
      if (status.includes("Perlu") || status.includes("Belum")) return "text-orange-700 bg-orange-100 border border-orange-200";
      if (status.includes("Kosong")) return "text-red-700 bg-red-100 border border-red-200";
      return "text-blue-700 bg-blue-100 border border-blue-200";
    };
  
    const renderComponent = () => {
      if (!selectedMenu) {
        return (
          <div className="flex flex-col items-center justify-center h-full p-10">
            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center max-w-lg">
              <MdSettings className="text-6xl mx-auto mb-3 text-gray-300" />
              <h3 className="text-xl font-semibold mb-1">Selamat Datang di Pengaturan</h3>
              <p className="text-gray-500">Pilih menu di sebelah kiri untuk mulai mengatur sistem Anda.</p>
            </div>
          </div>
        );
      }
  
      const map = {
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
        Lainnya: <Lainnya />,
        ManagementRole: <ManagementRole />,
      };
  
      return map[selectedMenu] || (
        <div className="flex items-center justify-center h-full text-gray-500">
          Komponen tidak ditemukan
        </div>
      );
    };
  
    const handleMenuClick = (item) => {
      if (item.route) return navigate(item.route);
      if (item.hasSubmenu) return setExpandedMenu(expandedMenu === item.id ? null : item.id);
      if (item.component) {
        setSelectedMenu(item.component);
        setExpandedMenu(null);
      }
    };
  
    const handleSubmenuClick = (sub) => {
      if (sub.route) return navigate(sub.route);
      if (sub.component) setSelectedMenu(sub.component);
    };
  
    const isActive = (item) => selectedMenu === item.component || expandedMenu === item.id;
  
    return (
      <div className="h-full bg-gray-100 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full lg:w-2/5 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6">
            {/* Info Akun */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
              <div className="bg-white/20 p-3 rounded-xl">
                <MdOutlinePointOfSale size={22} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">beastbeeme2@gmail.com</p>
                <p className="text-xs text-green-100">version 2.7.0 • db version 12</p>
              </div>
            </div>
          </div>
  
          {/* Menu scrollable */}
          <nav className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={[
                    "group w-full text-left p-4 rounded-2xl border transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-green-500/40",
                    isActive(item) ? "bg-green-50 border-green-200 shadow-sm" : "bg-white hover:bg-gray-50 border-gray-200",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={["text-[22px] shrink-0", isActive(item) ? "text-green-600" : "text-gray-500"].join(" ")}>
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.label}</span>
                          {isActive(item) && <span className="h-1 w-3 rounded-full bg-green-500 inline-block" />}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={["text-lg transition-transform", item.hasSubmenu && expandedMenu === item.id ? "rotate-180" : "", isActive(item) ? "text-green-600" : "text-gray-400"].join(" ")}>
                        {item.hasSubmenu ? <GoChevronDown /> : <GoChevronRight />}
                      </span>
                      <span className={`text-[10px] px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>{item.status}</span>
                    </div>
                  </div>
                </button>
  
                {item.hasSubmenu && expandedMenu === item.id && (
                  <div className="ml-4 mt-2 pl-4 border-l border-gray-200 space-y-1">
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.id || sub.label}
                        onClick={() => handleSubmenuClick(sub)}
                        className={[
                          "w-full text-left p-3 rounded-xl transition-colors",
                          "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/30",
                          selectedMenu === sub.component ? "bg-green-100 text-green-700" : "text-gray-700",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-2">
                          <MdSubdirectoryArrowRight className="text-gray-400" size={16} />
                          <span className="text-sm font-medium">{sub.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
  
        {/* Content */}
        <section className="flex-1 overflow-y-auto">{renderComponent()}</section>
      </div>
    );
  }