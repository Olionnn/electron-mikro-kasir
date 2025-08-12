import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaStore,
  FaSync,
  FaChartBar,
  FaFileInvoice,
  FaClock,
  FaCog,
  FaQuestionCircle,
  FaShoppingCart,
  FaTruck,
  FaMoneyBillWave,
  FaPaperPlane,
  FaUserCheck,
} from "react-icons/fa";

const menuItems = [
  { icon: <FaMoneyBillWave className="text-green-600" />, text: "Manajemen", link: "/management" },
  { icon: <FaShoppingCart className="text-green-600" />, text: "Transaksi Penjualan", link: "/pos" },
  { icon: <FaTruck className="text-green-600" />, text: "Pembelian Ke Supplier", link: "/pembelian-supplier" },
  { icon: <FaFileInvoice className="text-green-600" />, text: "Keuangan", link: "/keuangan" },
  { icon: <FaChartBar className="text-green-600" />, text: "Laporan", link: "/laporan" },
  { icon: <FaUserCheck className="text-green-600" />, text: "Absensi", link: "/absensi" },
  { icon: <FaClock className="text-green-600" />, text: "Shift", link: "/shift" },
  { icon: <FaCog className="text-green-600" />, text: "Pengaturan", link: "/pengaturan" },
];

const bottomMenuItems = [
  // { icon: <FaStore className="text-green-600" />, text: "Toko Online Saya", link: "/toko-online" },
  { icon: <FaQuestionCircle className="text-green-600" />, text: "Pusat Bantuan", link: "/pusat-bantuan" },
  { icon: <FaPaperPlane className="text-green-600" />, text: "Kirim Masukan", link: "/kirim-masukan" },
];

const SidebarItem = ({ icon, text, link, isActive }) => (
  <li>
    <Link
      to={link}
      className={`flex items-center p-2 cursor-pointer rounded-md transition ${
        isActive ? "bg-green-100 text-green-600 font-bold" : "hover:bg-gray-100"
      }`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </Link>
  </li>
);

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white text-black flex flex-col shadow transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex flex-col items-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2">
          <FaStore className="text-green-600 text-3xl" />
        </div>
        <h2 className="font-bold text-lg">RinoFahri</h2>
        <p className="text-xs">Owner</p>
      </div>

      {/* Update Section */}
      <div className="flex items-center justify-between px-4 py-2 text-xs border-b">
        <div>
          <p className="text-gray-500">Pembaruan Terakhir</p>
          <p className="text-gray-400 text-[11px]">JustNow</p>
        </div>
        <FaSync className="text-green-600 cursor-pointer text-lg" />
      </div>

      {/* Menu Utama */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        <p className="text-gray-400 text-xs mb-2">Menu Utama</p>
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              text={item.text}
              link={item.link}
              isActive={location.pathname === item.link}
            />
          ))}
        </ul>
        <hr className="my-3" />
        <ul className="space-y-1">
          {bottomMenuItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              text={item.text}
              link={item.link}
              isActive={location.pathname === item.link}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
