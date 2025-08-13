import React from "react";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

const InformasiToko = () => {
  const infoToko = [
    { label: "Jenis Usaha", value: "pilih jenis usaha ..." },
    { label: "Nama Toko", value: "Abror G4nteng" },
    { label: "Pajak Default", value: "0%" },
    { label: "Nama Pemilik / Owner", value: "beastbeeme2" },
    { label: "Nomor Telepon", value: "+62085707896575" },
  ];

  const lokasi = [
    { label: "Negara", value: "Indonesia" },
    { label: "Provinsi", value: "JAMBI" },
    { label: "Kota", value: "KABUPATEN KERINCI" },
    { label: "Detail Lokasi", value: "-" },
  ];

  const preferensi = [
    { label: "Bahasa", value: "Bahasa Indonesia" },
    { label: "Mata Uang", value: "Indonesian Rupiah" },
    { label: "Motto", value: "Melayani dengan sepenuh hati" },
    { label: "Metode Akuntansi", value: "Kas" },
    { label: "Status Olshopin", value: "Aktif" },
  ];

  const Section = ({ title, items }) => (
    <section>
      <div className="px-6 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="mt-2">
        {items.map((row, i) => (
          <div key={i}>
            <div className="px-6 py-4">
              <div className="text-sm text-gray-500">{row.label}</div>
              <div className="text-base md:text-lg font-semibold text-gray-900">
                {row.value}
              </div>
            </div>
            {i < items.length - 1 && <div className="h-px bg-gray-200" />}
          </div>
        ))}
      </div>
      <div className="h-3 bg-gray-100" />
    </section>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-2xl font-bold tracking-tight">INFORMASI TOKO</h1>
        {/* <button
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
          title="Edit Toko"
        >
          <MdEdit className="text-lg" />
          Edit Toko
        </button> */}
        <Link to={"/pengaturan/edittoko"}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
          title="Edit Toko"
        >
          <MdEdit className="text-lg" />
          Edit Toko
        </Link>

      </div>

      {/* Avatar / Icon */}
      <div className="flex flex-col items-center py-8">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
          alt="Store Icon"
          className="w-24 h-24 rounded-full ring-2 ring-green-100"
        />
      </div>

      {/* Sections (tanpa card/container) */}
      <div className="flex-1">
        <Section title="Info Toko" items={infoToko} />
        <Section title="Lokasi" items={lokasi} />
        <Section title="Bahasa & Mata Uang" items={preferensi} />
      </div>
    </div>
  );
};

export default InformasiToko;