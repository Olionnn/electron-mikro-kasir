// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");
const withAuth = (data, token) => ({ ...(data || {}), token });

contextBridge.exposeInMainWorld("electronAPI", {
  // Barang
  getBarangList: (params, token) =>
    ipcRenderer.invoke("barang:getList", withAuth(params, token)),
  getBarangById: (id, token) =>
    ipcRenderer.invoke("barang:getById", withAuth({ id }, token)),
  createBarang: (data, token) =>
    ipcRenderer.invoke("barang:create", withAuth({ data }, token)),
  updateBarang: (id, data, token) =>
    ipcRenderer.invoke("barang:update", withAuth({ id, data }, token)),
  deleteBarang: (id, token) =>
    ipcRenderer.invoke("barang:delete", withAuth({ id }, token)),

  // aruskeuangandetail
  getArusKeuanganDetailList: (params, token) =>
    ipcRenderer.invoke(
      "aruskeuangandetailIpc:getList",
      withAuth(params, token)
    ),
  getArusKeuanganDetailById: (id, token) =>
    ipcRenderer.invoke(
      "aruskeuangandetailIpc:getById",
      withAuth({ id }, token)
    ),
  createArusKeuanganDetail: (data, token) =>
    ipcRenderer.invoke(
      "aruskeuangandetailIpc:create",
      withAuth({ data }, token)
    ),
  updateArusKeuanganDetail: (id, data, token) =>
    ipcRenderer.invoke(
      "aruskeuangandetailIpc:update",
      withAuth({ id, data }, token)
    ),
  deleteArusKeuanganDetail: (id, token) =>
    ipcRenderer.invoke("aruskeuangandetailIpc:delete", withAuth({ id }, token)),

  // aruskeuangan
  getArusKeuanganList: (params, token) =>
    ipcRenderer.invoke("aruskeuanganIpc:getList", withAuth(params, token)),
  getArusKeuanganById: (id, token) =>
    ipcRenderer.invoke("aruskeuanganIpc:getById", withAuth({ id }, token)),
  createArusKeuangan: (data, token) =>
    ipcRenderer.invoke("aruskeuanganIpc:create", withAuth({ data }, token)),
  updateArusKeuangan: (id, data, token) =>
    ipcRenderer.invoke("aruskeuanganIpc:update", withAuth({ id, data }, token)),
  deleteArusKeuangan: (id, token) =>
    ipcRenderer.invoke("aruskeuanganIpc:delete", withAuth({ id }, token)),

  // barangconfig
  getBarangConfigList: (params, token) =>
    ipcRenderer.invoke("barangconfigIpc:getList", withAuth(params, token)),
  getBarangConfigById: (id, token) =>
    ipcRenderer.invoke("barangconfigIpc:getById", withAuth({ id }, token)),
  createBarangConfig: (data, token) =>
    ipcRenderer.invoke("barangconfigIpc:create", withAuth({ data }, token)),
  updateBarangConfig: (id, data, token) =>
    ipcRenderer.invoke("barangconfigIpc:update", withAuth({ id, data }, token)),
  deleteBarangConfig: (id, token) =>
    ipcRenderer.invoke("barangconfigIpc:delete", withAuth({ id }, token)),

  // baranglog
  getBarangLogList: (params, token) =>
    ipcRenderer.invoke("baranglogIpc:getList", withAuth(params, token)),
  getBarangLogById: (id, token) =>
    ipcRenderer.invoke("baranglogIpc:getById", withAuth({ id }, token)),
  createBarangLog: (data, token) =>
    ipcRenderer.invoke("baranglogIpc:create", withAuth({ data }, token)),
  updateBarangLog: (id, data, token) =>
    ipcRenderer.invoke("baranglogIpc:update", withAuth({ id, data }, token)),
  deleteBarangLog: (id, token) =>
    ipcRenderer.invoke("baranglogIpc:delete", withAuth({ id }, token)),

  //barangstok
  getBarangStokList: (params, token) =>
    ipcRenderer.invoke("barangstokIpc:getList", withAuth(params, token)),
  getBarangStokById: (id, token) =>
    ipcRenderer.invoke("barangstokIpc:getById", withAuth({ id }, token)),
  createBarangStok: (data, token) =>
    ipcRenderer.invoke("barangstokIpc:create", withAuth({ data }, token)),
  updateBarangStok: (id, data, token) =>
    ipcRenderer.invoke("barangstokIpc:update", withAuth({ id, data }, token)),
  deleteBarangStok: (id, token) =>
    ipcRenderer.invoke("barangstokIpc:delete", withAuth({ id }, token)),

  //benner
  getBennerList: (params, token) =>
    ipcRenderer.invoke("bennerIpc:getList", withAuth(params, token)),
  getBennerById: (id, token) =>
    ipcRenderer.invoke("bennerIpc:getById", withAuth({ id }, token)),
  createBenner: (data, token) =>
    ipcRenderer.invoke("bennerIpc:create", withAuth({ data }, token)),
  updateBenner: (id, data, token) =>
    ipcRenderer.invoke("bennerIpc:update", withAuth({ id, data }, token)),
  deleteBenner: (id, token) =>
    ipcRenderer.invoke("bennerIpc:delete", withAuth({ id }, token)),
  //biaya
  getBiayaList: (params, token) =>
    ipcRenderer.invoke("biayaIpc:getList", withAuth(params, token)),
  getBiayaById: (id, token) =>
    ipcRenderer.invoke("biayaIpc:getById", withAuth({ id }, token)),
  createBiaya: (data, token) =>
    ipcRenderer.invoke("biayaIpc:create", withAuth({ data }, token)),
  updateBiaya: (id, data, token) =>
    ipcRenderer.invoke("biayaIpc:update", withAuth({ id, data }, token)),
  deleteBiaya: (id, token) =>
    ipcRenderer.invoke("biayaIpc:delete", withAuth({ id }, token)),

  //diskon
  getDiskonList: (params, token) =>
    ipcRenderer.invoke("diskonIpc:getList", withAuth(params, token)),
  getDiskonById: (id, token) =>
    ipcRenderer.invoke("diskonIpc:getById", withAuth({ id }, token)),
  createDiskon: (data, token) =>
    ipcRenderer.invoke("diskonIpc:create", withAuth({ data }, token)),
  updateDiskon: (id, data, token) =>
    ipcRenderer.invoke("diskonIpc:update", withAuth({ id, data }, token)),
  deleteDiskon: (id, token) =>
    ipcRenderer.invoke("diskonIpc:delete", withAuth({ id }, token)),

  //hutangdetail
  getHutangDetailList: (params, token) =>
    ipcRenderer.invoke("hutangdetailIpc:getList", withAuth(params, token)),
  getHutangDetailById: (id, token) =>
    ipcRenderer.invoke("hutangdetailIpc:getById", withAuth({ id }, token)),
  createHutangDetail: (data, token) =>
    ipcRenderer.invoke("hutangdetailIpc:create", withAuth({ data }, token)),
  updateHutangDetail: (id, data, token) =>
    ipcRenderer.invoke("hutangdetailIpc:update", withAuth({ id, data }, token)),
  deleteHutangDetail: (id, token) =>
    ipcRenderer.invoke("hutangdetailIpc:delete", withAuth({ id }, token)),

  //hutanghistorybayar
  getHutangHistoryBayarList: (params, token) =>
    ipcRenderer.invoke(
      "hutanghistorybayarIpc:getList",
      withAuth(params, token)
    ),
  getHutangHistoryBayarById: (id, token) =>
    ipcRenderer.invoke(
      "hutanghistorybayarIpc:getById",
      withAuth({ id }, token)
    ),
  createHutangHistoryBayar: (data, token) =>
    ipcRenderer.invoke(
      "hutanghistorybayarIpc:create",
      withAuth({ data }, token)
    ),
  updateHutangHistoryBayar: (id, data, token) =>
    ipcRenderer.invoke(
      "hutanghistorybayarIpc:update",
      withAuth({ id, data }, token)
    ),
  deleteHutangHistoryBayar: (id, token) =>
    ipcRenderer.invoke("hutanghistorybayarIpc:delete", withAuth({ id }, token)),

  //hutang
  getHutangList: (params, token) =>
    ipcRenderer.invoke("hutangIpc:getList", withAuth(params, token)),
  getHutangById: (id, token) =>
    ipcRenderer.invoke("hutangIpc:getById", withAuth({ id }, token)),
  createHutang: (data, token) =>
    ipcRenderer.invoke("hutangIpc:create", withAuth({ data }, token)),
  updateHutang: (id, data, token) =>
    ipcRenderer.invoke("hutangIpc:update", withAuth({ id, data }, token)),
  deleteHutang: (id, token) =>
    ipcRenderer.invoke("hutangIpc:delete", withAuth({ id }, token)),

  //info
  getInfoList: (params, token) =>
    ipcRenderer.invoke("infoIpc:getList", withAuth(params, token)),
  getInfoById: (id, token) =>
    ipcRenderer.invoke("infoIpc:getById", withAuth({ id }, token)),
  createInfo: (data, token) =>
    ipcRenderer.invoke("infoIpc:create", withAuth({ data }, token)),
  updateInfo: (id, data, token) =>
    ipcRenderer.invoke("infoIpc:update", withAuth({ id, data }, token)),
  deleteInfo: (id, token) =>
    ipcRenderer.invoke("infoIpc:delete", withAuth({ id }, token)),

  // kategori
  getKategoriList: (params, token) =>
    ipcRenderer.invoke("kategoriIpc:getList", withAuth(params || {}, token)),
  getKategoriById: (id, token) =>
    ipcRenderer.invoke("kategoriIpc:getById", withAuth({ id }, token)),
  createKategori: (data, token) =>
    ipcRenderer.invoke("kategoriIpc:create", withAuth({ data }, token)),
  updateKategori: (id, data, token) =>
    ipcRenderer.invoke("kategoriIpc:update", withAuth({ id, data }, token)),
  deleteKategori: (id, token) =>
    ipcRenderer.invoke("kategoriIpc:delete", withAuth({ id }, token)),

  //pajakdefault
  getPajakDefaultList: (params, token) =>
    ipcRenderer.invoke("pajakdefaultIpc:getList", withAuth(params, token)),
  getPajakDefaultById: (id, token) =>
    ipcRenderer.invoke("pajakdefaultIpc:getById", withAuth({ id }, token)),
  createPajakDefault: (data, token) =>
    ipcRenderer.invoke("pajakdefaultIpc:create", withAuth({ data }, token)),
  updatePajakDefault: (id, data, token) =>
    ipcRenderer.invoke("pajakdefaultIpc:update", withAuth({ id, data }, token)),
  deletePajakDefault: (id, token) =>
    ipcRenderer.invoke("pajakdefaultIpc:delete", withAuth({ id }, token)),

  //pajak
  getPajakList: (params, token) =>
    ipcRenderer.invoke("pajakIpc:getList", withAuth(params, token)),
  getPajakById: (id, token) =>
    ipcRenderer.invoke("pajakIpc:getById", withAuth({ id }, token)),
  createPajak: (data, token) =>
    ipcRenderer.invoke("pajakIpc:create", withAuth({ data }, token)),
  updatePajak: (id, data, token) =>
    ipcRenderer.invoke("pajakIpc:update", withAuth({ id, data }, token)),
  deletePajak: (id, token) =>
    ipcRenderer.invoke("pajakIpc:delete", withAuth({ id }, token)),

  //pelanggan
  getPelangganList: (params, token) =>
    ipcRenderer.invoke("pelangganIpc:getList", withAuth(params, token)),
  getPelangganById: (id, token) =>
    ipcRenderer.invoke("pelangganIpc:getById", withAuth({ id }, token)),
  createPelanggan: (data, token) =>
    ipcRenderer.invoke("pelangganIpc:create", withAuth({ data }, token)),
  updatePelanggan: (id, data, token) =>
    ipcRenderer.invoke("pelangganIpc:update", withAuth({ id, data }, token)),
  deletePelanggan: (id, token) =>
    ipcRenderer.invoke("pelangganIpc:delete", withAuth({ id }, token)),

  //pembeliandetail
  getPembelianDetailList: (params, token) =>
    ipcRenderer.invoke("pembeliandetailIpc:getList", withAuth(params, token)),
  getPembelianDetailById: (id, token) =>
    ipcRenderer.invoke("pembeliandetailIpc:getById", withAuth({ id }, token)),
  createPembelianDetail: (data, token) =>
    ipcRenderer.invoke("pembeliandetailIpc:create", withAuth({ data }, token)),
  updatePembelianDetail: (id, data, token) =>
    ipcRenderer.invoke(
      "pembeliandetailIpc:update",
      withAuth({ id, data }, token)
    ),
  deletePembelianDetail: (id, token) =>
    ipcRenderer.invoke("pembeliandetailIpc:delete", withAuth({ id }, token)),

  //pengaturanstruk
  getPengaturanStrukList: (params, token) =>
    ipcRenderer.invoke("pengaturanstrukIpc:getList", withAuth(params, token)),
  getPengaturanStrukById: (id, token) =>
    ipcRenderer.invoke("pengaturanstrukIpc:getById", withAuth({ id }, token)),
  createPengaturanStruk: (data, token) =>
    ipcRenderer.invoke("pengaturanstrukIpc:create", withAuth({ data }, token)),
  updatePengaturanStruk: (id, data, token) =>
    ipcRenderer.invoke(
      "pengaturanstrukIpc:update",
      withAuth({ id, data }, token)
    ),
  deletePengaturanStruk: (id, token) =>
    ipcRenderer.invoke("pengaturanstrukIpc:delete", withAuth({ id }, token)),

  //piutangdetail
  getPiutangDetailList: (params, token) =>
    ipcRenderer.invoke("piutangdetailIpc:getList", withAuth(params, token)),
  getPiutangDetailById: (id, token) =>
    ipcRenderer.invoke("piutangdetailIpc:getById", withAuth({ id }, token)),
  createPiutangDetail: (data, token) =>
    ipcRenderer.invoke("piutangdetailIpc:create", withAuth({ data }, token)),
  updatePiutangDetail: (id, data, token) =>
    ipcRenderer.invoke(
      "piutangdetailIpc:update",
      withAuth({ id, data }, token)
    ),
  deletePiutangDetail: (id, token) =>
    ipcRenderer.invoke("piutangdetailIpc:delete", withAuth({ id }, token)),

  //piutanghistorybayar
  getPiutangHistoryBayarList: (params, token) =>
    ipcRenderer.invoke(
      "piutanghistorybayarIpc:getList",
      withAuth(params, token)
    ),
  getPiutangHistoryBayarById: (id, token) =>
    ipcRenderer.invoke(
      "piutanghistorybayarIpc:getById",
      withAuth({ id }, token)
    ),
  createPiutangHistoryBayar: (data, token) =>
    ipcRenderer.invoke(
      "piutanghistorybayarIpc:create",
      withAuth({ data }, token)
    ),
  updatePiutangHistoryBayar: (id, data, token) =>
    ipcRenderer.invoke(
      "piutanghistorybayarIpc:update",
      withAuth({ id, data }, token)
    ),
  deletePiutangHistoryBayar: (id, token) =>
    ipcRenderer.invoke(
      "piutanghistorybayarIpc:delete",
      withAuth({ id }, token)
    ),

  //piutang
  getPiutangList: (params, token) =>
    ipcRenderer.invoke("piutangIpc:getList", withAuth(params, token)),
  getPiutangById: (id, token) =>
    ipcRenderer.invoke("piutangIpc:getById", withAuth({ id }, token)),
  createPiutang: (data, token) =>
    ipcRenderer.invoke("piutangIpc:create", withAuth({ data }, token)),
  updatePiutang: (id, data, token) =>
    ipcRenderer.invoke("piutangIpc:update", withAuth({ id, data }, token)),
  deletePiutang: (id, token) =>
    ipcRenderer.invoke("piutangIpc:delete", withAuth({ id }, token)),

  //sidebarakses
  getSidebarAksesList: (params, token) =>
    ipcRenderer.invoke("sidebaraksesIpc:getList", withAuth(params, token)),
  getSidebarAksesById: (id, token) =>
    ipcRenderer.invoke("sidebaraksesIpc:getById", withAuth({ id }, token)),
  createSidebarAkses: (data, token) =>
    ipcRenderer.invoke("sidebaraksesIpc:create", withAuth({ data }, token)),
  updateSidebarAkses: (id, data, token) =>
    ipcRenderer.invoke("sidebaraksesIpc:update", withAuth({ id, data }, token)),
  deleteSidebarAkses: (id, token) =>
    ipcRenderer.invoke("sidebaraksesIpc:delete", withAuth({ id }, token)),

  //sidebar
  getSidebarList: (params, token) =>
    ipcRenderer.invoke("sidebarIpc:getList", withAuth(params, token)),
  getSidebarById: (id, token) =>
    ipcRenderer.invoke("sidebarIpc:getById", withAuth({ id }, token)),
  createSidebar: (data, token) =>
    ipcRenderer.invoke("sidebarIpc:create", withAuth({ data }, token)),
  updateSidebar: (id, data, token) =>
    ipcRenderer.invoke("sidebarIpc:update", withAuth({ id, data }, token)),
  deleteSidebar: (id, token) =>
    ipcRenderer.invoke("sidebarIpc:delete", withAuth({ id }, token)),

  //stokopnamedetail
  getStokOpnameDetailList: (params, token) =>
    ipcRenderer.invoke("stokopnamedetailIpc:getList", withAuth(params, token)),
  getStokOpnameDetailById: (id, token) =>
    ipcRenderer.invoke("stokopnamedetailIpc:getById", withAuth({ id }, token)),
  createStokOpnameDetail: (data, token) =>
    ipcRenderer.invoke("stokopnamedetailIpc:create", withAuth({ data }, token)),
  updateStokOpnameDetail: (id, data, token) =>
    ipcRenderer.invoke(
      "stokopnamedetailIpc:update",
      withAuth({ id, data }, token)
    ),
  deleteStokOpnameDetail: (id, token) =>
    ipcRenderer.invoke("stokopnamedetailIpc:delete", withAuth({ id }, token)),

  //stokopname
  getStokOpnameList: (params, token) =>
    ipcRenderer.invoke("stokopnameIpc:getList", withAuth(params, token)),
  getStokOpnameById: (id, token) =>
    ipcRenderer.invoke("stokopnameIpc:getById", withAuth({ id }, token)),
  createStokOpname: (data, token) =>
    ipcRenderer.invoke("stokopnameIpc:create", withAuth({ data }, token)),
  updateStokOpname: (id, data, token) =>
    ipcRenderer.invoke("stokopnameIpc:update", withAuth({ id, data }, token)),
  deleteStokOpname: (id, token) =>
    ipcRenderer.invoke("stokopnameIpc:delete", withAuth({ id }, token)),

  //supplier
  getSupplierList: (params, token) =>
    ipcRenderer.invoke("supplierIpc:getList", withAuth(params, token)),
  getSupplierById: (id, token) =>
    ipcRenderer.invoke("supplierIpc:getById", withAuth({ id }, token)),
  createSupplier: (data, token) =>
    ipcRenderer.invoke("supplierIpc:create", withAuth({ data }, token)),
  updateSupplier: (id, data, token) =>
    ipcRenderer.invoke("supplierIpc:update", withAuth({ id, data }, token)),
  deleteSupplier: (id, token) =>
    ipcRenderer.invoke("supplierIpc:delete", withAuth({ id }, token)),

  //toko
  getTokoList: (params, token) =>
    ipcRenderer.invoke("tokoIpc:getList", withAuth(params || {}, token)),
  getTokoById: (id, token) =>
    ipcRenderer.invoke("tokoIpc:getById", withAuth({ id }, token)),
  createToko: (data, token) =>
    ipcRenderer.invoke("tokoIpc:create", withAuth({ data }, token)),
  updateToko: (id, data, token) =>
    ipcRenderer.invoke("tokoIpc:update", withAuth({ id, data }, token)),
  deleteToko: (id, token) =>
    ipcRenderer.invoke("tokoIpc:delete", withAuth({ id }, token)),

  //transaksidetail
  getTransaksiDetailList: (params, token) =>
    ipcRenderer.invoke("transaksidetailIpc:getList", withAuth(params, token)),
  getTransaksiDetailById: (id, token) =>
    ipcRenderer.invoke("transaksidetailIpc:getById", withAuth({ id }, token)),
  createTransaksiDetail: (data, token) =>
    ipcRenderer.invoke("transaksidetailIpc:create", withAuth({ data }, token)),
  updateTransaksiDetail: (id, data, token) =>
    ipcRenderer.invoke(
      "transaksidetailIpc:update",
      withAuth({ id, data }, token)
    ),
  deleteTransaksiDetail: (id, token) =>
    ipcRenderer.invoke("transaksidetailIpc:delete", withAuth({ id }, token)),

  //transaksi
  getTransaksiList: (params, token) =>
    ipcRenderer.invoke("transaksiIpc:getList", withAuth(params, token)),
  getTransaksiById: (id, token) =>
    ipcRenderer.invoke("transaksiIpc:getById", withAuth({ id }, token)),
  createTransaksi: (data, token) =>
    ipcRenderer.invoke("transaksiIpc:create", withAuth({ data }, token)),
  updateTransaksi: (id, data, token) =>
    ipcRenderer.invoke("transaksiIpc:update", withAuth({ id, data }, token)),
  deleteTransaksi: (id, token) =>
    ipcRenderer.invoke("transaksiIpc:delete", withAuth({ id }, token)),

  //transaksipesanandetail
  getTransaksiPesananDetailList: (params, token) =>
    ipcRenderer.invoke(
      "transaksipesanandetailIpc:getList",
      withAuth(params, token)
    ),
  getTransaksiPesananDetailById: (id, token) =>
    ipcRenderer.invoke(
      "transaksipesanandetailIpc:getById",
      withAuth({ id }, token)
    ),
  createTransaksiPesananDetail: (data, token) =>
    ipcRenderer.invoke(
      "transaksipesanandetailIpc:create",
      withAuth({ data }, token)
    ),
  updateTransaksiPesananDetail: (id, data, token) =>
    ipcRenderer.invoke(
      "transaksipesanandetailIpc:update",
      withAuth({ id, data }, token)
    ),
  deleteTransaksiPesananDetail: (id, token) =>
    ipcRenderer.invoke(
      "transaksipesanandetailIpc:delete",
      withAuth({ id }, token)
    ),

  //transaksipesanan
  getTransaksiPesananList: (params, token) =>
    ipcRenderer.invoke("transaksipesananIpc:getList", withAuth(params, token)),
  getTransaksiPesananById: (id, token) =>
    ipcRenderer.invoke("transaksipesananIpc:getById", withAuth({ id }, token)),
  createTransaksiPesanan: (data, token) =>
    ipcRenderer.invoke("transaksipesananIpc:create", withAuth({ data }, token)),
  updateTransaksiPesanan: (id, data, token) =>
    ipcRenderer.invoke(
      "transaksipesananIpc:update",
      withAuth({ id, data }, token)
    ),
  deleteTransaksiPesanan: (id, token) =>
    ipcRenderer.invoke("transaksipesananIpc:delete", withAuth({ id }, token)),

  // auth
  login: (data) => ipcRenderer.invoke("usersIpc:login", data),
  register: (data) => ipcRenderer.invoke("usersIpc:register", data),
  logout: (data) => ipcRenderer.invoke("usersIpc:logout", data),
  
  getUserList: (params, token) =>
    ipcRenderer.invoke("usersIpc:getList", withAuth(params, token)),
  getUserById: (id, token) =>
    ipcRenderer.invoke("usersIpc:getById", withAuth({ id }, token)),
  createUser: (data, token) =>
    ipcRenderer.invoke("usersIpc:create", withAuth({ data }, token)),
  updateUser: (id, data, token) =>
    ipcRenderer.invoke("usersIpc:update", withAuth({ id, data }, token)),
  deleteUser: (id, token) =>
    ipcRenderer.invoke("usersIpc:delete", withAuth({ id }, token)),

  withAuth: (data, token) => withAuth(data, token),
});

console.log("Preload script loaded");
