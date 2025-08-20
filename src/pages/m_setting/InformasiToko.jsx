import React from "react";
import {
  MdEdit,
  MdStore,
  MdPerson,
  MdPhone,
  MdFlag,
  MdMap,
  MdLocationCity,
  MdLanguage,
  MdAttachMoney,
  MdTextFields,
  MdPercent,
  MdInfo
} from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar"; // Assuming you have a custom hook for navbar 

const InformasiToko = () => {
  const infoToko = [
    { label: "Jenis Usaha", value: "pilih jenis usaha ...", icon: <MdStore /> },
    { label: "Nama Toko", value: "Abror G4nteng", icon: <MdStore /> },
    { label: "Pajak Default", value: "0%", icon: <MdPercent /> },
    { label: "Nama Pemilik / Owner", value: "beastbeeme2", icon: <MdPerson /> },
    { label: "Nomor Telepon", value: "+62085707896575", icon: <MdPhone /> },
  ];

  const lokasi = [
    { label: "Negara", value: "Indonesia", icon: <MdFlag /> },
    { label: "Provinsi", value: "JAMBI", icon: <MdMap /> },
    { label: "Kota", value: "KABUPATEN KERINCI", icon: <MdLocationCity /> },
    { label: "Detail Lokasi", value: "-", icon: <MdInfo /> },
  ];

  const preferensi = [
    { label: "Bahasa", value: "Bahasa Indonesia", icon: <MdLanguage /> },
    { label: "Mata Uang", value: "Indonesian Rupiah", icon: <MdAttachMoney /> },
    { label: "Motto", value: "Melayani dengan sepenuh hati", icon: <MdTextFields /> },
    { label: "Metode Akuntansi", value: "Kas", icon: <MdInfo /> },
    { label: "Status Olshopin", value: "Aktif", icon: <MdInfo /> },
  ];

  const Section = ({ items }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden divide-y">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <span className="text-violet-600 text-2xl">{item.icon}</span>
          <div>
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="font-semibold text-gray-900">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );

    // Set navbar for this page
    useNavbar({
      variant: "page",
      title: "Informasi Toko",
      backTo: null, 
      actions: [
        {
          type: "link",
          title: "Edit Toko",
          to: "/pengaturan/edittoko",
          className: "bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2",
          icon: <MdEdit className="text-lg" />,
        },
      ],
    });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-violet-50 to-white">

      {/* Avatar / Logo */}
      <div className="flex flex-col items-center py-8 relative">
        <div className="relative group">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full ring-4 ring-violet-100 shadow-lg transform group-hover:scale-105 transition-transform"
            alt="Store Logo"
          />
          <span className="absolute bottom-0 right-0 bg-violet-500 text-white p-2 rounded-full shadow-md">
            <MdEdit />
          </span>
        </div>
        <p className="mt-4 text-lg font-bold text-gray-800">Abror G4nteng</p>
        <p className="text-sm text-gray-500">Toko UMKM</p>
      </div>

      {/* Info Sections */}
      <div className="flex flex-col gap-6 px-6 pb-8">
        <Section items={infoToko} />
        <Section items={lokasi} />
        <Section items={preferensi} />
      </div>
    </div>
  );
};

export default InformasiToko;
