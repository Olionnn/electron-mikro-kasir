import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdInfoOutline,
  MdPersonAddAlt,
  MdSearch,
  MdShield,
  MdMail,
  MdPhone,
  MdMoreVert,
  MdDelete,
  MdEdit,
  MdClose,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";

/* -------------------------------------------
   SIMPLE LOCAL STORAGE STORE
-------------------------------------------- */
const LS_KEYS = {
  USERS: "kp_users",
  SIDEbars: "kp_sidebars",
  AKSES: "kp_sidebar_akses",
};

// seed data sekali (jika kosong)
const seedIfEmpty = () => {
  if (!localStorage.getItem(LS_KEYS.USERS)) {
    const now = new Date().toISOString();
    const users = [
      {
        id: 1,
        toko_id: 1,
        nama: "Owner",
        username: "owner",
        password: "hashed_pw",
        is_valid: 1,
        kode: "OWN-001",
        email: "owner@toko.id",
        no_telp: "08123456789",
        alamat: "Jl. Mawar No.1",
        role: "owner",
        image: "",
        sync_at: null,
        status: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        toko_id: 1,
        nama: "Kasir 1",
        username: "kasir1",
        password: "hashed_pw",
        is_valid: 1,
        kode: "KSR-001",
        email: "kasir1@toko.id",
        no_telp: "0812000111",
        alamat: "—",
        role: "kasir",
        image: "",
        sync_at: null,
        status: true,
        created_at: now,
        updated_at: now,
      },
    ];
    localStorage.setItem(LS_KEYS.USERS, JSON.stringify(users));
  }
  if (!localStorage.getItem(LS_KEYS.SIDEbars)) {
    const now = new Date().toISOString();
    const sidebars = [
      { id: 1, parent_id: 0, nama: "Dashboard", route: "/dashboard", kode: "DASH", icon: "MdSpaceDashboard", indexing: 1, keterangan: null, sync_at: null, status: true, created_at: now, updated_at: now },
      { id: 2, parent_id: 0, nama: "POS", route: "/pos", kode: "POS", icon: "MdPointOfSale", indexing: 2, keterangan: null, sync_at: null, status: true, created_at: now, updated_at: now },
      { id: 3, parent_id: 0, nama: "Produk", route: "/produk", kode: "PROD", icon: "MdInventory", indexing: 3, keterangan: null, sync_at: null, status: true, created_at: now, updated_at: now },
      { id: 4, parent_id: 0, nama: "Laporan", route: "/laporan", kode: "RPT", icon: "MdAssessment", indexing: 4, keterangan: null, sync_at: null, status: true, created_at: now, updated_at: now },
      { id: 5, parent_id: 0, nama: "Pengaturan", route: "/pengaturan", kode: "SET", icon: "MdSettings", indexing: 5, keterangan: null, sync_at: null, status: true, created_at: now, updated_at: now },
    ];
    localStorage.setItem(LS_KEYS.SIDEbars, JSON.stringify(sidebars));
  }
  if (!localStorage.getItem(LS_KEYS.AKSES)) {
    // default role: owner full, kasir read POS & Produk
    const now = new Date().toISOString();
    const sidebars = JSON.parse(localStorage.getItem(LS_KEYS.SIDEbars) || "[]");
    const akses = [];
    // owner
    sidebars.forEach((s) => {
      akses.push({
        id: akses.length + 1,
        toko_id: 1,
        sidebar_id: s.id,
        role: "owner",
        can_read: true,
        can_create: true,
        can_update: true,
        can_delete: true,
        created_at: now,
        updated_at: now,
      });
    });
    // kasir (read POS, Produk)
    sidebars.forEach((s) => {
      const canRead = [2, 3].includes(s.id);
      akses.push({
        id: akses.length + 1,
        toko_id: 1,
        sidebar_id: s.id,
        role: "kasir",
        can_read: canRead,
        can_create: s.id === 2, // POS create
        can_update: s.id === 2,
        can_delete: false,
        created_at: now,
        updated_at: now,
      });
    });

    localStorage.setItem(LS_KEYS.AKSES, JSON.stringify(akses));
  }
};

const store = {
  getUsers: () => JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]"),
  setUsers: (rows) => localStorage.setItem(LS_KEYS.USERS, JSON.stringify(rows)),
  getSidebars: () => JSON.parse(localStorage.getItem(LS_KEYS.SIDEbars) || "[]"),
  getAkses: () => JSON.parse(localStorage.getItem(LS_KEYS.AKSES) || "[]"),
  setAkses: (rows) => localStorage.setItem(LS_KEYS.AKSES, JSON.stringify(rows)),
  nextId: (rows) => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1),
};

/* -------------------------------------------
   FORM MODAL (Tambah / Edit)
-------------------------------------------- */
function StaffFormModal({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(
    initial || {
      toko_id: 1,
      nama: "",
      username: "",
      password: "",
      is_valid: 1,
      kode: "",
      email: "",
      no_telp: "",
      alamat: "",
      role: "kasir",
      image: "",
      sync_at: null,
      status: true,
    }
  );

  useEffect(() => {
    setForm(
      initial || {
        toko_id: 1,
        nama: "",
        username: "",
        password: "",
        is_valid: 1,
        kode: "",
        email: "",
        no_telp: "",
        alamat: "",
        role: "kasir",
        image: "",
        sync_at: null,
        status: true,
      }
    );
  }, [initial]);

  if (!open) return null;

  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="font-semibold">{initial ? "Edit Staff" : "Tambah Staff"}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <MdClose />
          </button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4 text-sm">
          <div className="col-span-2">
            <label className="block text-gray-600 mb-1">Nama</label>
            <input className="w-full border rounded-lg px-3 py-2" value={form.nama} onChange={(e) => handleChange("nama", e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <input className="w-full border rounded-lg px-3 py-2" value={form.username} onChange={(e) => handleChange("username", e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2" value={form.password} onChange={(e) => handleChange("password", e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">No. Telp</label>
            <input className="w-full border rounded-lg px-3 py-2" value={form.no_telp} onChange={(e) => handleChange("no_telp", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-600 mb-1">Alamat</label>
            <input className="w-full border rounded-lg px-3 py-2" value={form.alamat} onChange={(e) => handleChange("alamat", e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Role</label>
            <select className="w-full border rounded-lg px-3 py-2" value={form.role} onChange={(e) => handleChange("role", e.target.value)}>
              <option value="owner">owner</option>
              <option value="admin">admin</option>
              <option value="kasir">kasir</option>
              <option value="staf">staf</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input type="checkbox" checked={form.status} onChange={(e) => handleChange("status", e.target.checked)} />
            <span>Aktif</span>
          </div>
        </div>
        <div className="px-5 py-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Batal</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
            {initial ? "Simpan Perubahan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------
   MAIN PAGE
-------------------------------------------- */
export default function ManajemenStaff() {
  const navigate = useNavigate();

  // state data
  const [users, setUsers] = useState([]);
  const [sidebars, setSidebars] = useState([]);
  const [akses, setAkses] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  // modal
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // init seed
  useEffect(() => {
    seedIfEmpty();
    setUsers(store.getUsers());
    setSidebars(store.getSidebars());
    setAkses(store.getAkses());
  }, []);

  // Handlers navbar
  const onBack = useCallback(() => navigate(-1), [navigate]);
  const onAddStaff = useCallback(() => {
    setEditData(null);
    setOpenForm(true);
  }, []);

  // navbar config
  useNavbar(
    {
      variant: "page",
      title: "Manajemen Staff",
      backTo: onBack,
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

  // filter list
  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return users.filter(
      (u) =>
        !term ||
        u.nama.toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.username || "").toLowerCase().includes(term)
    );
  }, [users, q]);

  // akses by role + sidebar_id -> record
  const aksesMap = useMemo(() => {
    const m = new Map();
    akses.forEach((a) => m.set(`${a.role}_${a.sidebar_id}`, a));
    return m;
  }, [akses]);

  // CRUD users
  const saveUser = (payload) => {
    const now = new Date().toISOString();
    if (editData) {
      // update
      const rows = users.map((u) =>
        u.id === editData.id ? { ...u, ...payload, id: u.id, updated_at: now } : u
      );
      setUsers(rows);
      store.setUsers(rows);
    } else {
      // create
      const rows = [...users];
      const id = store.nextId(rows);
      rows.push({
        ...payload,
        id,
        created_at: now,
        updated_at: now,
      });
      setUsers(rows);
      store.setUsers(rows);
    }
    setOpenForm(false);
  };

  const deleteUser = (id) => {
    if (!window.confirm("Hapus staff ini?")) return;
    const rows = users.filter((u) => u.id !== id);
    setUsers(rows);
    store.setUsers(rows);
    if (selected?.id === id) setSelected(null);
  };

  // toggle akses
  const toggleAkses = (role, sidebar_id, key) => {
    const now = new Date().toISOString();
    const idx = akses.findIndex((a) => a.role === role && a.sidebar_id === sidebar_id);
    const rows = [...akses];
    if (idx >= 0) {
      rows[idx] = { ...rows[idx], [key]: !rows[idx][key], updated_at: now };
    } else {
      // jika belum ada record, buat baru
      rows.push({
        id: store.nextId(rows),
        toko_id: 1,
        sidebar_id,
        role,
        can_read: key === "can_read",
        can_create: key === "can_create",
        can_update: key === "can_update",
        can_delete: key === "can_delete",
        created_at: now,
        updated_at: now,
      });
    }
    setAkses(rows);
    store.setAkses(rows);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-1 min-h-0">
        {/* LEFT LIST */}
        <aside className="w-full md:w-2/5 border-r bg-white flex flex-col min-h-0">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-xl flex-1 focus-within:ring-2 focus-within:ring-green-500">
                <MdSearch className="text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Cari nama/username/email…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full outline-none text-sm"
                />
              </div>
              <button
                onClick={onAddStaff}
                className="px-4 py-2 rounded-xl text-sm bg-green-600 text-white hover:bg-green-700"
                title="Tambah Staff"
              >
                + Staff
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {filtered.length === 0 ? (
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
            ) : (
              <div className="divide-y">
                {filtered.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelected(u)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${
                      selected?.id === u.id ? "bg-green-50" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">{u.nama} <span className="text-xs text-gray-500">({u.role || "-"})</span></div>
                      <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                        {u.email && (
                          <span className="inline-flex items-center gap-1"><MdMail /> {u.email}</span>
                        )}
                        {u.no_telp && (
                          <span className="inline-flex items-center gap-1"><MdPhone /> {u.no_telp}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditData(u);
                          setOpenForm(true);
                        }}
                        className="p-2 rounded-full hover:bg-gray-100"
                        title="Edit"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteUser(u.id);
                        }}
                        className="p-2 rounded-full hover:bg-red-50 text-red-600"
                        title="Hapus"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT DETAIL + ACCESS */}
        <section className="w-full md:w-3/5 bg-white">
          {!selected ? (
            <div className="h-full flex items-center justify-center p-10">
              <div className="max-w-md text-center">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-green-50 border border-green-100 flex items-center justify-center">
                  <MdShield className="text-5xl text-green-600" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">Pilih staff</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Detail staff & akses akan tampil di sini setelah dipilih.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto p-6 space-y-6">
              {/* Info */}
              <div className="border rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{selected.nama}</div>
                    <div className="text-xs text-gray-500">{selected.username} • {selected.role || "-"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${selected.status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {selected.status ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                  <div><span className="text-gray-500">Email:</span> {selected.email || "-"}</div>
                  <div><span className="text-gray-500">Telp:</span> {selected.no_telp || "-"}</div>
                  <div className="col-span-2"><span className="text-gray-500">Alamat:</span> {selected.alamat || "-"}</div>
                </div>
              </div>

              {/* Akses Matrix */}
              <div className="border rounded-2xl">
                <div className="px-4 py-3 border-b font-semibold">Hak Akses ({selected.role || "-"})</div>
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-600">
                        <th className="px-4 py-2">Menu</th>
                        <th className="px-4 py-2">Baca</th>
                        <th className="px-4 py-2">Tambah</th>
                        <th className="px-4 py-2">Ubah</th>
                        <th className="px-4 py-2">Hapus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sidebars
                        .sort((a, b) => a.indexing - b.indexing)
                        .map((sb) => {
                          const key = `${selected.role}_${sb.id}`;
                          const row = aksesMap.get(key);
                          const can = (k) => row ? !!row[k] : false;
                          const toggle = (k) => toggleAkses(selected.role || "staf", sb.id, k);
                          return (
                            <tr key={sb.id} className="border-t">
                              <td className="px-4 py-2">{sb.nama}</td>
                              <td className="px-4 py-2">
                                <input type="checkbox" checked={can("can_read")} onChange={() => toggle("can_read")} />
                              </td>
                              <td className="px-4 py-2">
                                <input type="checkbox" checked={can("can_create")} onChange={() => toggle("can_create")} />
                              </td>
                              <td className="px-4 py-2">
                                <input type="checkbox" checked={can("can_update")} onChange={() => toggle("can_update")} />
                              </td>
                              <td className="px-4 py-2">
                                <input type="checkbox" checked={can("can_delete")} onChange={() => toggle("can_delete")} />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Modal */}
      <StaffFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={saveUser}
        initial={editData}
      />
    </div>
  );
}