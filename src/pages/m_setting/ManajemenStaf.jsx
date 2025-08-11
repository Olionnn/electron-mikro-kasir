import React, { useCallback } from "react";
import {
  MdArrowBack,
  MdInfoOutline,
  MdPersonAddAlt,
  MdSearch,
  MdShield,
  MdMail,
  MdPhone,
  MdMoreVert,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";


export default function ManajemenStaff() {
  const navigate = useNavigate();

  // Handlers untuk navbar actions
  const onBack = useCallback(() => navigate(-1), [navigate]);
  const onAddStaff = useCallback(() => {
    // TODO: buka modal tambah staff / navigate ke form tambah
    console.log("Tambah Staff");
  }, []);

  // Inject config ke navbar global
  useNavbar(
    {
      variant: "page",
      title: "Manajemen Staff",
      // kalau mau tombol back di navbar:
      backTo: onBack, // atau null jika tak perlu link back
      actions: [
        {
          type: "button",
          title: "Tambah Staff",
          onClick: onAddStaff,
          className:
            "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700",
          icon: <MdPersonAddAlt className="text-lg" />,
          label: "Tambah Staff",
        },
        {
          type: "button",
          title: "Bantuan",
          onClick: () => console.log("bantuan"),
          className:
            "w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-green-600",
          icon: <MdInfoOutline className="text-2xl" />,
        },
      ],
    },
    [onAddStaff, onBack]
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-1 min-h-0">
        <aside className="w-full md:w-2/5 border-r bg-white flex flex-col min-h-0">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-xl flex-1 focus-within:ring-2 focus-within:ring-green-500">
                <MdSearch className="text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Cari nama staff…"
                  className="w-full outline-none text-sm"
                />
              </div>
              <button
                className="px-4 py-2 rounded-xl text-sm border hover:bg-gray-50"
                title="Filter"
              >
                Filter
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                  <MdShield className="text-4xl text-green-600" />
                </div>
                <h3 className="mt-4 text-base font-semibold">Belum ada staff</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tambahkan staff untuk mulai mengatur akses & peran.
                </p>
                <button
                  onClick={onAddStaff}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                  title="Tambah Staff"
                >
                  <MdPersonAddAlt className="text-lg" />
                  Tambah Staff
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t md:hidden">
            <button
              onClick={onAddStaff}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
            >
              Tambah Staff
            </button>
          </div>
        </aside>

        <section className="w-full md:w-3/5 bg-white">
          <div className="h-full flex items-center justify-center p-10">
            <div className="max-w-md text-center">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-green-50 border border-green-100 flex items-center justify-center">
                <MdShield className="text-5xl text-green-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold">Pilih staff</h3>
              <p className="text-sm text-gray-500 mt-1">
                Detail staff akan tampil di sini setelah Anda memilih dari
                daftar sebelah kiri.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}