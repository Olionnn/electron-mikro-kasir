import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdInfoOutline,
  MdPersonAddAlt,
  MdSearch,
  MdShield,
  MdMail,
  MdPhone,
  MdEdit,
  MdDelete,
  MdClose,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";

/* -------------------------------------------
   SIMPLE LOCAL STORAGE STORE (USERS ONLY)
-------------------------------------------- */
const LS_KEYS = {
  USERS: "kp_users",
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
};

const store = {
  getUsers: () => JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]"),
  setUsers: (rows) => localStorage.setItem(LS_KEYS.USERS, JSON.stringify(rows)),
  nextId: (rows) => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1),
};

/* -------------------------------------------
   FORM MODAL (Tambah / Edit Staff)
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
  const submit = () => onSubmit(form);

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

          {/* HANYA PILIH ROLE */}
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
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700">
            {initial ? "Simpan Perubahan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------
   MAIN PAGE (TANPA MATRIX AKSES)
-------------------------------------------- */
export default function ManajemenStaff() {
  const navigate = useNavigate();

  // state data
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  // modal
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // init seed
  useEffect(() => {
    seedIfEmpty();
    setUsers(store.getUsers());
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
            "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700",
          icon: <MdPersonAddAlt className="text-lg" />,
          label: "Tambah Staff",
        },
        {
          type: "button",
          title: "Bantuan",
          onClick: () => console.log("bantuan"),
          className:
            "w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-violet-600",
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

  // CRUD users
  const saveUser = (payload) => {
    const now = new Date().toISOString();
    if (editData) {
      const rows = users.map((u) =>
        u.id === editData.id ? { ...u, ...payload, id: u.id, updated_at: now } : u
      );
      setUsers(rows);
      store.setUsers(rows);
      if (selected?.id === editData.id) setSelected({ ...editData, ...payload });
    } else {
      const rows = [...users];
      const id = store.nextId(rows);
      rows.push({ ...payload, id, created_at: now, updated_at: now });
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

  // QUICK: ubah role dari panel kanan
  const updateRoleSelected = (newRole) => {
    if (!selected) return;
    const now = new Date().toISOString();
    const rows = users.map((u) =>
      u.id === selected.id ? { ...u, role: newRole, updated_at: now } : u
    );
    setUsers(rows);
    store.setUsers(rows);
    setSelected((s) => ({ ...s, role: newRole, updated_at: now }));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-1 min-h-0">
        {/* LEFT LIST */}
        <aside className="w-full md:w-2/5 border-r bg-white flex flex-col min-h-0">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-xl flex-1 focus-within:ring-2 focus-within:ring-violet-500">
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
                className="px-4 py-2 rounded-xl text-sm bg-violet-600 text-white hover:bg-violet-700"
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
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <MdShield className="text-4xl text-violet-600" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">Belum ada staff</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Tambahkan staff untuk mulai mengatur peran/role.
                  </p>
                  <button
                    onClick={onAddStaff}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700"
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
                      selected?.id === u.id ? "bg-violet-50" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        {u.nama}{" "}
                        <span className="text-xs text-gray-500">({u.role || "-"})</span>
                      </div>
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

        {/* RIGHT DETAIL — HANYA PILIH/GANTI ROLE */}
        <section className="w-full md:w-3/5 bg-white">
          {!selected ? (
            <div className="h-full flex items-center justify-center p-10">
              <div className="max-w-md text-center">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <MdShield className="text-5xl text-violet-600" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">Pilih staff</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Detail staff & pilihan role akan tampil di sini.
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
                    <div className="text-xs text-gray-500">
                      {selected.username} • {selected.role || "-"}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selected.status
                        ? "bg-violet-100 text-violet-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {selected.status ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                  <div><span className="text-gray-500">Email:</span> {selected.email || "-"}</div>
                  <div><span className="text-gray-500">Telp:</span> {selected.no_telp || "-"}</div>
                  <div className="col-span-2"><span className="text-gray-500">Alamat:</span> {selected.alamat || "-"}</div>
                </div>
              </div>

              {/* Ganti Role Saja */}
              <div className="border rounded-2xl p-4">
                <div className="font-semibold mb-3">Pengaturan Role</div>
                <div className="flex items-center gap-3">
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={selected.role || "staf"}
                    onChange={(e) => updateRoleSelected(e.target.value)}
                  >
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                    <option value="kasir">kasir</option>
                    <option value="staf">staf</option>
                  </select>
                  <span className="text-sm text-gray-500">
                    Perubahan disimpan otomatis.
                  </span>
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