// src/pages/m_setting/Bantuan.jsx
import React, { useState, useMemo } from "react";
import { useNavbar } from "../../hooks/useNavbar";
import { FiChevronRight } from "react-icons/fi";
import ContactList from "../m_bantuan/HubungiKami";
import FeedbackForm from "../m_bantuan/feedbackapk";

const menus = [
  {
    key: "hubungi",
    title: "Hubungi Kami",
    desc: "Kontak kami berdasar kebutuhan Anda",
    accentClass: "text-violet-700",
    render: () => <ContactList />,
  },
  {
    key: "medsos",
    title: "Media Sosial & Komunitas",
    desc: "Ikuti perkembangan terbaru kami",
    accentClass: "text-orange-600",
    render: () => (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">Sosials</h2>
        <p className="text-sm text-gray-600">Ikuti kami di media sosial.</p>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Instagram: @brandkamu</li>
          <li>Facebook: Brand Kamu</li>
          <li>TikTok: @brandkamu</li>
        </ul>
      </div>
    ),
  },
  {
    key: "feedback",
    title: "Feedback Aplikasi",
    desc: "Kritik & saran Anda membantu kami",
    accentClass: "text-yellow-700",
    render: () => <FeedbackForm />,
  },
  {
    key: "panduan",
    title: "Buku Panduan & FAQ",
    desc: "Baca panduan dan pertanyaan terkait",
    accentClass: "text-yellow-700",
    render: () => (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">Buku Panduan & FAQ</h2>
        <p className="text-sm text-gray-600">
          Dokumentasi singkat & pertanyaan umum akan tampil di sini.
        </p>
      </div>
    ),
  },
  {
    key: "tutorial",
    title: "Tutorial Aplikasi",
    desc: "Ikuti panduan penggunaan aplikasi",
    accentClass: "text-yellow-600",
    render: () => (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">Tutorial Aplikasi</h2>
        <p className="text-sm text-gray-600">
          Video & langkah-langkah tutorial akan tampil di sini.
        </p>
      </div>
    ),
  },
];

export default function Bantuan() {
  const [activeKey, setActiveKey] = useState(menus[0].key);

  useNavbar(
    {
      variant: "page",
      title: "Bantuan",
      backTo: null,
      actions: [],
    },
    []
  );

  const activeContent = useMemo(() => {
    const found = menus.find((m) => m.key === activeKey);
    return found?.render() ?? null;
  }, [activeKey]);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Kiri: menu (tetap di halaman yang sama, tanpa Link/Route) */}
      <aside className="w-full md:w-[35%] border-r bg-white overflow-y-auto">
        <ul className="p-4 space-y-4">
          {menus.map((m) => {
            const isActive = m.key === activeKey;
            return (
              <li key={m.key}>
                <button
                  onClick={() => setActiveKey(m.key)}
                  className={[
                    "w-full p-4 rounded-xl shadow-sm flex items-start justify-between transition text-left",
                    "hover:shadow",
                    isActive
                      ? "bg-violet-50 border border-violet-200"
                      : "bg-white border",
                  ].join(" ")}
                >
                  <div>
                    <div
                      className={[
                        "text-base font-semibold mb-0.5",
                        m.accentClass || "text-gray-800",
                      ].join(" ")}
                    >
                      {m.title}
                    </div>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                  <FiChevronRight
                    className={[
                      "text-2xl transition",
                      isActive ? "text-violet-600" : "text-gray-400",
                    ].join(" ")}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Kanan: halaman konten (tanpa route change) */}
      <section className="flex-1 min-w-0">
        {activeContent ?? (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-lg">
            Silakan pilih menu di sebelah kiri
          </div>
        )}
      </section>
    </div>
  );
}