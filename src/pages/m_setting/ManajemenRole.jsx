import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdShield,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdInfoOutline,
} from "react-icons/md";
import { useNavbar } from "../../hooks/useNavbar";

/* -------------------------------------------
   LOCAL STORAGE KEYS
-------------------------------------------- */
const LS_KEYS = {
  ROLES: "kp_roles",
  SIDEbars: "kp_sidebars",
  AKSES: "kp_sidebar_akses",
};

/* -------------------------------------------
   SEED DATA (jika belum ada)
-------------------------------------------- */
const seedIfEmpty = () => {
  // sidebars default (biarkan sama seperti punyamu)
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

  // roles default
  if (!localStorage.getItem(LS_KEYS.ROLES)) {
    const now = new Date().toISOString();
    const roles = [
      { id: 1, nama: "owner", deskripsi: "Akses penuh", status: true, created_at: now, updated_at: now },
      { id: 2, nama: "admin", deskripsi: "Admin sistem", status: true, created_at: now, updated_at: now },
      { id: 3, nama: "kasir", deskripsi: "Operasional kasir", status: true, created_at: now, updated_at: now },
      { id: 4, nama: "staf", deskripsi: "Staf umum", status: true, created_at: now, updated_at: now },
    ];
    localStorage.setItem(LS_KEYS.ROLES, JSON.stringify(roles));
  }

  // akses default
  if (!localStorage.getItem(LS_KEYS.AKSES)) {
    const now = new Date().toISOString();
    const sidebars = JSON.parse(localStorage.getItem(LS_KEYS.SIDEbars) || "[]");
    const roles = JSON.parse(localStorage.getItem(LS_KEYS.ROLES) || "[]");
    const akses = [];

    roles.forEach((r) => {
      sidebars.forEach((s) => {
        // default:
        // - owner: full
        // - admin: read + create + update, no delete
        // - kasir: POS (id 2) create/update/read, Produk (id 3) read, lainnya read
        // - staf: read only
        let can_read = true,
          can_create = false,
          can_update = false,
          can_delete = false;

        if (r.nama === "owner") {
          can_create = can_update = can_delete = true;
        } else if (r.nama === "admin") {
          can_create = can_update = true;
          can_delete = false;
        } else if (r.nama === "kasir") {
          if (s.id === 2) {
            can_create = can_update = true;
          }
          if (s.id === 3) {
            // produk read only
          }
        } // staf default read only

        akses.push({
          id: akses.length + 1,
          sidebar_id: s.id,
          role: r.nama,
          can_read,
          can_create,
          can_update,
          can_delete,
          created_at: now,
          updated_at: now,
        });
      });
    });

    localStorage.setItem(LS_KEYS.AKSES, JSON.stringify(akses));
  }
};

/* -------------------------------------------
   STORE
-------------------------------------------- */
const store = {
  getRoles: () => JSON.parse(localStorage.getItem(LS_KEYS.ROLES) || "[]"),
  setRoles: (rows) => localStorage.setItem(LS_KEYS.ROLES, JSON.stringify(rows)),
  getSidebars: () => JSON.parse(localStorage.getItem(LS_KEYS.SIDEbars) || "[]"),
  getAkses: () => JSON.parse(localStorage.getItem(LS_KEYS.AKSES) || "[]"),
  setAkses: (rows) => localStorage.setItem(LS_KEYS.AKSES, JSON.stringify(rows)),
  nextId: (rows) => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1),
};

/* -------------------------------------------
   MODAL FORM ROLE (Tambah/Edit)
-------------------------------------------- */
function RoleFormModal({ open, onClose, initial, onSubmit }) {
  const [form, setForm] = useState(
    initial || { nama: "", deskripsi: "", status: true }
  );

  useEffect(() => {
    setForm(initial || { nama: "", deskripsi: "", status: true });
  }, [initial]);

  if (!open) return null;

  const submit = () => {
    const nama = (form.nama || "").trim();
    if (!nama) return alert("Nama role wajib diisi");
    onSubmit({ ...form, nama });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm grid place-items-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="font-semibold">{initial ? "Edit Role" : "Tambah Role"}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <MdClose />
          </button>
        </div>
        <div className="p-5 grid gap-3 text-sm">
          <label className="grid gap-1">
            <span className="text-gray-600">Nama Role</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={form.nama}
              onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
              placeholder="mis. manager_gudang"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-gray-600">Deskripsi</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={form.deskripsi}
              onChange={(e) =>
                setForm((f) => ({ ...f, deskripsi: e.target.value }))
              }
              placeholder="Catatan singkat peran"
            />
          </label>
          <label className="inline-flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.checked }))
              }
            />
            <span>Aktif</span>
          </label>
        </div>
        <div className="px-5 py-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
            Batal
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
          >
            {initial ? "Simpan Perubahan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}


export default function ManagementRole() {
  const navigate = useNavigate();

  // init
  useEffect(() => {
    seedIfEmpty();
    setRoles(store.getRoles());
    setSidebars(store.getSidebars());
    setAkses(store.getAkses());
  }, []);

  // navbar
  const onBack = useCallback(() => navigate(-1), [navigate]);
  const onAddRole = useCallback(() => {
    setEditData(null);
    setOpenForm(true);
  }, []);

  useNavbar(
    {
      variant: "page",
      title: "Management Role",
      backTo: onBack,
      actions: [
        {
          type: "button",
          title: "Tambah Role",
          onClick: onAddRole,
          className:
            "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700",
          icon: <MdAdd className="text-lg" />,
          label: "Tambah Role",
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
    [onBack, onAddRole]
  );

  // state
  const [roles, setRoles] = useState([]);
  const [sidebars, setSidebars] = useState([]);
  const [akses, setAkses] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  // modal form role
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // filter roles
  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return roles.filter(
      (r) =>
        !term ||
        r.nama.toLowerCase().includes(term) ||
        (r.deskripsi || "").toLowerCase().includes(term)
    );
  }, [roles, q]);

  // map akses (role_sidebar) -> row
  const aksesMap = useMemo(() => {
    const m = new Map();
    akses.forEach((a) => m.set(`${a.role}_${a.sidebar_id}`, a));
    return m;
  }, [akses]);

  // toggle akses
  const toggleAkses = (roleName, sidebar_id, key) => {
    const now = new Date().toISOString();
    const idx = akses.findIndex(
      (a) => a.role === roleName && a.sidebar_id === sidebar_id
    );
    const rows = [...akses];
    if (idx >= 0) {
      rows[idx] = { ...rows[idx], [key]: !rows[idx][key], updated_at: now };
    } else {
      // jika belum ada record untuk role ini di sidebar tsb
      rows.push({
        id: store.nextId(rows),
        sidebar_id,
        role: roleName,
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

  // CRUD Role
  const saveRole = (payload) => {
    const now = new Date().toISOString();
    // validasi nama unik
    const nameClash = roles.some(
      (r) =>
        r.nama.toLowerCase() === payload.nama.toLowerCase() &&
        (!editData || r.id !== editData.id)
    );
    if (nameClash) return alert("Nama role sudah digunakan.");

    if (editData) {
      // update role
      const rows = roles.map((r) =>
        r.id === editData.id
          ? { ...r, ...payload, id: r.id, updated_at: now }
          : r
      );

      // Jika nama role berubah, update juga semua entri akses yang refer ke role lama
      if (editData.nama !== payload.nama) {
        const aksesRows = akses.map((a) =>
          a.role === editData.nama ? { ...a, role: payload.nama, updated_at: now } : a
        );
        setAkses(aksesRows);
        store.setAkses(aksesRows);
      }

      setRoles(rows);
      store.setRoles(rows);
    } else {
      // create role
      const rows = [...roles];
      const id = store.nextId(rows);
      rows.push({
        id,
        nama: payload.nama,
        deskripsi: payload.deskripsi || "",
        status: payload.status ?? true,
        created_at: now,
        updated_at: now,
      });
      setRoles(rows);
      store.setRoles(rows);

      // tambahkan baris akses default (read only) untuk semua sidebar
      const side = sidebars.length ? sidebars : store.getSidebars();
      const rowsAkses = [...akses];
      side.forEach((s) => {
        rowsAkses.push({
          id: store.nextId(rowsAkses),
          sidebar_id: s.id,
          role: payload.nama,
          can_read: true,
          can_create: false,
          can_update: false,
          can_delete: false,
          created_at: now,
          updated_at: now,
        });
      });
      setAkses(rowsAkses);
      store.setAkses(rowsAkses);
    }

    setOpenForm(false);
  };

  const deleteRole = (id) => {
    const row = roles.find((r) => r.id === id);
    if (!row) return;
    if (row.nama === "owner")
      return alert("Role 'owner' tidak boleh dihapus.");

    if (!window.confirm(`Hapus role "${row.nama}" beserta hak aksesnya?`))
      return;

    // hapus role
    const rows = roles.filter((r) => r.id !== id);
    setRoles(rows);
    store.setRoles(rows);

    // hapus akses yang terkait role
    const aksesRows = akses.filter((a) => a.role !== row.nama);
    setAkses(aksesRows);
    store.setAkses(aksesRows);

    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-1 min-h-0">
        {/* LEFT: ROLE LIST */}
        <aside className="w-full md:w-2/5 border-r bg-white flex flex-col min-h-0">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-xl flex-1 focus-within:ring-2 focus-within:ring-violet-500">
                <MdSearch className="text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Cari role…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full outline-none text-sm"
                />
              </div>
              <button
                onClick={onAddRole}
                className="px-4 py-2 rounded-xl text-sm bg-violet-600 text-white hover:bg-violet-700"
                title="Tambah Role"
              >
                + Role
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
                  <h3 className="mt-4 text-base font-semibold">Belum ada role</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Tambahkan role untuk mulai mengatur akses.
                  </p>
                  <button
                    onClick={onAddRole}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700"
                    title="Tambah Role"
                  >
                    <MdAdd className="text-lg" />
                    Tambah Role
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${
                      selected?.id === r.id ? "bg-violet-50" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        {r.nama}{" "}
                        <span className="text-xs text-gray-500">
                          {r.deskripsi ? `— ${r.deskripsi}` : ""}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Status:{" "}
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            r.status
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {r.status ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditData(r);
                          setOpenForm(true);
                        }}
                        className="p-2 rounded-full hover:bg-gray-100"
                        title="Edit Role"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRole(r.id);
                        }}
                        className="p-2 rounded-full hover:bg-red-50 text-red-600"
                        title="Hapus Role"
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

        {/* RIGHT: MATRIX AKSES */}
        <section className="w-full md:w-3/5 bg-white">
          {!selected ? (
            <div className="h-full flex items-center justify-center p-10">
              <div className="max-w-md text-center">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <MdShield className="text-5xl text-violet-600" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">Pilih role</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Matrix hak akses akan tampil di sini setelah kamu memilih role.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto p-6 space-y-6">
              {/* Info Role */}
              <div className="border rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{selected.nama}</div>
                    <div className="text-xs text-gray-500">
                      {selected.deskripsi || "—"}
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
              </div>

              {/* Matrix Akses */}
              <div className="border rounded-2xl">
                <div className="px-4 py-3 border-b font-semibold">
                  Hak Akses ({selected.nama})
                </div>
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
                          const key = `${selected.nama}_${sb.id}`;
                          const row = aksesMap.get(key);
                          const can = (k) => (row ? !!row[k] : false);
                          const toggle = (k) =>
                            toggleAkses(selected.nama, sb.id, k);

                          return (
                            <tr key={sb.id} className="border-t">
                              <td className="px-4 py-2">{sb.nama}</td>
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={can("can_read")}
                                  onChange={() => toggle("can_read")}
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={can("can_create")}
                                  onChange={() => toggle("can_create")}
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={can("can_update")}
                                  onChange={() => toggle("can_update")}
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={can("can_delete")}
                                  onChange={() => toggle("can_delete")}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Catatan */}
              <div className="text-xs text-gray-500">
                Perubahan disimpan otomatis ke <code>localStorage</code>.
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Modal Role */}
      <RoleFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        initial={editData}
        onSubmit={saveRole}
      />
    </div>
  );
}