// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('electronAPI', {
    // Barang
    getBarangList: (params) => ipcRenderer.invoke('barang:getList', params),
    getBarangById: (id) => ipcRenderer.invoke('barang:getById', id),
    createBarang: (data) => ipcRenderer.invoke('barang:create', data),
    updateBarang: (id, data) => ipcRenderer.invoke('barang:update', { id, data }),
    deleteBarang: (id) => ipcRenderer.invoke('barang:delete', id),
  
    // aruskeuangandetail
    getArusKeuanganDetailList: (params) => ipcRenderer.invoke('aruskeuangandetailIpc:getList', params),
    getArusKeuanganDetailById: (id) => ipcRenderer.invoke('aruskeuangandetailIpc:getById', id),
    createArusKeuanganDetail: (data) => ipcRenderer.invoke('aruskeuangandetailIpc:create', data),
    updateArusKeuanganDetail: (id, data) => ipcRenderer.invoke('aruskeuangandetailIpc:update', { id, data }),
    deleteArusKeuanganDetail: (id) => ipcRenderer.invoke('aruskeuangandetailIpc:delete', id),

     // aruskeuangan
    getArusKeuanganList: (params) => ipcRenderer.invoke('aruskeuanganIpc:getList', params),
    getArusKeuanganById: (id) => ipcRenderer.invoke('aruskeuanganIpc:getById', id),
    createArusKeuangan: (data) => ipcRenderer.invoke('aruskeuanganIpc:create', data),
    updateArusKeuangan: (id, data) => ipcRenderer.invoke('aruskeuanganIpc:update', { id, data }),
    deleteArusKeuangan: (id) => ipcRenderer.invoke('aruskeuanganIpc:delete', id),

     // barangconfig
    getBarangConfigList: (params) => ipcRenderer.invoke('barangconfigIpc:getList', params),
    getBarangConfigById: (id) => ipcRenderer.invoke('barangconfigIpc:getById', id),
    createBarangConfig: (data) => ipcRenderer.invoke('barangconfigIpc:create', data),
    updateBarangConfig: (id, data) => ipcRenderer.invoke('barangconfigIpc:update', { id, data }),
    deleteBarangConfig: (id) => ipcRenderer.invoke('barangconfigIpc:delete', id),

// baranglog
    getBarangLogList: (params) => ipcRenderer.invoke('baranglogIpc:getList', params),
    getBarangLogById: (id) => ipcRenderer.invoke('baranglogIpc:getById', id),
    createBarangLog: (data) => ipcRenderer.invoke('baranglogIpc:create', data),
    updateBarangLog: (id, data) => ipcRenderer.invoke('baranglogIpc:update', { id, data }),
    deleteBarangLog: (id) => ipcRenderer.invoke('baranglogIpc:delete', id),

//barangstok
    getBarangStokList: (params) => ipcRenderer.invoke('barangstokIpc:getList', params),
    getBarangStokById: (id) => ipcRenderer.invoke('barangstokIpc:getById', id),
    createBarangStok: (data) => ipcRenderer.invoke('barangstokIpc:create', data),
    updateBarangStok: (id, data) => ipcRenderer.invoke('barangstokIpc:update', { id, data }),
    deleteBarangStok: (id) => ipcRenderer.invoke('barangstokIpc:delete', id),

//benner
    getBennerList: (params) => ipcRenderer.invoke('bennerIpc:getList', params),
    getBennerById: (id) => ipcRenderer.invoke('bennerIpc:getById', id),
    createBenner: (data) => ipcRenderer.invoke('bennerIpc:create', data),
    updateBenner: (id, data) => ipcRenderer.invoke('bennerIpc:update', { id, data }),
    deleteBenner: (id) => ipcRenderer.invoke('bennerIpc:delete', id),
//biaya
    getBiayaList: (params) => ipcRenderer.invoke('biayaIpc:getList', params),
    getBiayaById: (id) => ipcRenderer.invoke('biayaIpc:getById', id),
    createBiaya: (data) => ipcRenderer.invoke('biayaIpc:create', data),
    updateBiaya: (id, data) => ipcRenderer.invoke('biayaIpc:update', { id, data }),
    deleteBiaya: (id) => ipcRenderer.invoke('biayaIpc:delete', id),

    //diskon
    getDiskonList: (params) => ipcRenderer.invoke('diskonIpc:getList', params),
    getDiskonById: (id) => ipcRenderer.invoke('diskonIpc:getById', id),
    createDiskon: (data) => ipcRenderer.invoke('diskonIpc:create', data),
    updateDiskon: (id, data) => ipcRenderer.invoke('diskonIpc:update', { id, data }),
    deleteDiskon: (id) => ipcRenderer.invoke('diskonIpc:delete', id),

    //hutangdetail
    getHutangDetailList: (params) => ipcRenderer.invoke('hutangdetailIpc:getList', params),
    getHutangDetailById: (id) => ipcRenderer.invoke('hutangdetailIpc:getById', id),
    createHutangDetail: (data) => ipcRenderer.invoke('hutangdetailIpc:create', data),
    updateHutangDetail: (id, data) => ipcRenderer.invoke('hutangdetailIpc:update', { id, data }),
    deleteHutangDetail: (id) => ipcRenderer.invoke('hutangdetailIpc:delete', id),

    //hutanghistorybayar
    getHutangHistoryBayarList: (params) => ipcRenderer.invoke('hutanghistorybayarIpc:getList', params),
    getHutangHistoryBayarById: (id) => ipcRenderer.invoke('hutanghistorybayarIpc:getById', id),
    createHutangHistoryBayar: (data) => ipcRenderer.invoke('hutanghistorybayarIpc:create', data),
    updateHutangHistoryBayar: (id, data) => ipcRenderer.invoke('hutanghistorybayarIpc:update', { id, data }),
    deleteHutangHistoryBayar: (id) => ipcRenderer.invoke('hutanghistorybayarIpc:delete', id),

 //hutang
    getHutangList: (params) => ipcRenderer.invoke('hutangIpc:getList', params),
    getHutangById: (id) => ipcRenderer.invoke('hutangIpc:getById', id),
    createHutang: (data) => ipcRenderer.invoke('hutangIpc:create', data),
    updateHutang: (id, data) => ipcRenderer.invoke('hutangIpc:update', { id, data }),
    deleteHutang: (id) => ipcRenderer.invoke('hutangIpc:delete', id),

     //info
    getInfoList: (params) => ipcRenderer.invoke('infoIpc:getList', params),
    getInfoById: (id) => ipcRenderer.invoke('infoIpc:getById', id),
    createInfo: (data) => ipcRenderer.invoke('infoIpc:create', data),
    updateInfo: (id, data) => ipcRenderer.invoke('infoIpc:update', { id, data }),
    deleteInfo: (id) => ipcRenderer.invoke('infoIpc:delete', id),

    //kategori
    getKategoriList: (params) => ipcRenderer.invoke('kategoriIpc:getList', params),
    getKategoriById: (id) => ipcRenderer.invoke('kategoriIpc:getById', id),
    createKategori: (data) => ipcRenderer.invoke('kategoriIpc:create', data),
    updateKategori: (id, data) => ipcRenderer.invoke('kategoriIpc:update', { id, data }),
    deleteKategori: (id) => ipcRenderer.invoke('kategoriIpc:delete', id),

     //pajakdefault
    getPajakDefaultList: (params) => ipcRenderer.invoke('pajakdefaultIpc:getList', params),
    getPajakDefaultById: (id) => ipcRenderer.invoke('pajakdefaultIpc:getById', id),
    createPajakDefault: (data) => ipcRenderer.invoke('pajakdefaultIpc:create', data),
    updatePajakDefault: (id, data) => ipcRenderer.invoke('pajakdefaultIpc:update', { id, data }),
    deletePajakDefault: (id) => ipcRenderer.invoke('pajakdefaultIpc:delete', id),

        //pajak
    getPajakList: (params) => ipcRenderer.invoke('pajakIpc:getList', params),
    getPajakById: (id) => ipcRenderer.invoke('pajakIpc:getById', id),
    createPajak: (data) => ipcRenderer.invoke('pajakIpc:create', data),
    updatePajak: (id, data) => ipcRenderer.invoke('pajakIpc:update', { id, data }),
    deletePajak: (id) => ipcRenderer.invoke('pajakIpc:delete', id),

     //pelanggan
    getPelangganList: (params) => ipcRenderer.invoke('pelangganIpc:getList', params),
    getPelangganById: (id) => ipcRenderer.invoke('pelangganIpc:getById', id),
    createPelanggan: (data) => ipcRenderer.invoke('pelangganIpc:create', data),
    updatePelanggan: (id, data) => ipcRenderer.invoke('pelangganIpc:update', { id, data }),
    deletePelanggan: (id) => ipcRenderer.invoke('pelangganIpc:delete', id),

     //pembeliandetail
    getPembelianDetailList: (params) => ipcRenderer.invoke('pembeliandetailIpc:getList', params),
    getPembelianDetailById: (id) => ipcRenderer.invoke('pembeliandetailIpc:getById', id),
    createPembelianDetail: (data) => ipcRenderer.invoke('pembeliandetailIpc:create', data),
    updatePembelianDetail: (id, data) => ipcRenderer.invoke('pembeliandetailIpc:update', { id, data }),
    deletePembelianDetail: (id) => ipcRenderer.invoke('pembeliandetailIpc:delete', id),

     //pengaturanstruk
    getPengaturanStrukList: (params) => ipcRenderer.invoke('pengaturanstrukIpc:getList', params),
    getPengaturanStrukById: (id) => ipcRenderer.invoke('pengaturanstrukIpc:getById', id),
    createPengaturanStruk: (data) => ipcRenderer.invoke('pengaturanstrukIpc:create', data),
    updatePengaturanStruk: (id, data) => ipcRenderer.invoke('pengaturanstrukIpc:update', { id, data }),
    deletePengaturanStruk: (id) => ipcRenderer.invoke('pengaturanstrukIpc:delete', id),

     //piutangdetail
    getPiutangDetailList: (params) => ipcRenderer.invoke('piutangdetailIpc:getList', params),
    getPiutangDetailById: (id) => ipcRenderer.invoke('piutangdetailIpc:getById', id),
    createPiutangDetail: (data) => ipcRenderer.invoke('piutangdetailIpc:create', data),
    updatePiutangDetail: (id, data) => ipcRenderer.invoke('piutangdetailIpc:update', { id, data }),
    deletePiutangDetail: (id) => ipcRenderer.invoke('piutangdetailIpc:delete', id),

     //piutanghistorybayar
    getPiutangHistoryBayarList: (params) => ipcRenderer.invoke('piutanghistorybayarIpc:getList', params),
    getPiutangHistoryBayarById: (id) => ipcRenderer.invoke('piutanghistorybayarIpc:getById', id),
    createPiutangHistoryBayar: (data) => ipcRenderer.invoke('piutanghistorybayarIpc:create', data),
    updatePiutangHistoryBayar: (id, data) => ipcRenderer.invoke('piutanghistorybayarIpc:update', { id, data }),
    deletePiutangHistoryBayar: (id) => ipcRenderer.invoke('piutanghistorybayarIpc:delete', id),

    //piutang
    getPiutangList: (params) => ipcRenderer.invoke('piutangIpc:getList', params),
    getPiutangById: (id) => ipcRenderer.invoke('piutangIpc:getById', id),
    createPiutang: (data) => ipcRenderer.invoke('piutangIpc:create', data),
    updatePiutang: (id, data) => ipcRenderer.invoke('piutangIpc:update', { id, data }),
    deletePiutang: (id) => ipcRenderer.invoke('piutangIpc:delete', id),

    //sidebarakses
    getSidebarAksesList: (params) => ipcRenderer.invoke('sidebaraksesIpc:getList', params),
    getSidebarAksesById: (id) => ipcRenderer.invoke('sidebaraksesIpc:getById', id),
    createSidebarAkses: (data) => ipcRenderer.invoke('sidebaraksesIpc:create', data),
    updateSidebarAkses: (id, data) => ipcRenderer.invoke('sidebaraksesIpc:update', { id, data }),
    deleteSidebarAkses: (id) => ipcRenderer.invoke('sidebaraksesIpc:delete', id),

     //sidebar
    getSidebarList: (params) => ipcRenderer.invoke('sidebarIpc:getList', params),
    getSidebarById: (id) => ipcRenderer.invoke('sidebarIpc:getById', id),
    createSidebar: (data) => ipcRenderer.invoke('sidebarIpc:create', data),
    updateSidebar: (id, data) => ipcRenderer.invoke('sidebarIpc:update', { id, data }),
    deleteSidebar: (id) => ipcRenderer.invoke('sidebarIpc:delete', id),

      //stokopnamedetail
    getStokOpnameDetailList: (params) => ipcRenderer.invoke('stokopnamedetailIpc:getList', params),
    getStokOpnameDetailById: (id) => ipcRenderer.invoke('stokopnamedetailIpc:getById', id),
    createStokOpnameDetail: (data) => ipcRenderer.invoke('stokopnamedetailIpc:create', data),
    updateStokOpnameDetail: (id, data) => ipcRenderer.invoke('stokopnamedetailIpc:update', { id, data }),
    deleteStokOpnameDetail: (id) => ipcRenderer.invoke('stokopnamedetailIpc:delete', id),

    //stokopname
    getStokOpnameList: (params) => ipcRenderer.invoke('stokopnameIpc:getList', params),
    getStokOpnameById: (id) => ipcRenderer.invoke('stokopnameIpc:getById', id),
    createStokOpname: (data) => ipcRenderer.invoke('stokopnameIpc:create', data),
    updateStokOpname: (id, data) => ipcRenderer.invoke('stokopnameIpc:update', { id, data }),
    deleteStokOpname: (id) => ipcRenderer.invoke('stokopnameIpc:delete', id),

    //supplier
    getSupplierList: (params) => ipcRenderer.invoke('supplierIpc:getList', params),
    getSupplierById: (id) => ipcRenderer.invoke('supplierIpc:getById', id),
    createSupplier: (data) => ipcRenderer.invoke('supplierIpc:create', data),
    updateSupplier: (id, data) => ipcRenderer.invoke('supplierIpc:update', { id, data }),
    deleteSupplier: (id) => ipcRenderer.invoke('supplierIpc:delete', id),

     //toko
    getTokoList: (params) => ipcRenderer.invoke('tokoIpc:getList', params),
    getTokoById: (id) => ipcRenderer.invoke('tokoIpc:getById', id),
    createToko: (data) => ipcRenderer.invoke('tokoIpc:create', data),
    updateToko: (id, data) => ipcRenderer.invoke('tokoIpc:update', { id, data }),
    deleteToko: (id) => ipcRenderer.invoke('tokoIpc:delete', id),

      //transaksidetail
    getTransaksiDetailList: (params) => ipcRenderer.invoke('transaksidetailIpc:getList', params),
    getTransaksiDetailById: (id) => ipcRenderer.invoke('transaksidetailIpc:getById', id),
    createTransaksiDetail: (data) => ipcRenderer.invoke('transaksidetailIpc:create', data),
    updateTransaksiDetail: (id, data) => ipcRenderer.invoke('transaksidetailIpc:update', { id, data }),
    deleteTransaksiDetail: (id) => ipcRenderer.invoke('transaksidetailIpc:delete', id),

     //transaksi
    getTransaksiList: (params) => ipcRenderer.invoke('transaksiIpc:getList', params),
    getTransaksiById: (id) => ipcRenderer.invoke('transaksiIpc:getById', id),
    createTransaksi: (data) => ipcRenderer.invoke('transaksiIpc:create', data),
    updateTransaksi: (id, data) => ipcRenderer.invoke('transaksiIpc:update', { id, data }),
    deleteTransaksi: (id) => ipcRenderer.invoke('transaksiIpc:delete', id),

    //transaksipesanandetail
    getTransaksiPesananDetailList: (params) => ipcRenderer.invoke('transaksipesanandetailIpc:getList', params),
    getTransaksiPesananDetailById: (id) => ipcRenderer.invoke('transaksipesanandetailIpc:getById', id),
    createTransaksiPesananDetail: (data) => ipcRenderer.invoke('transaksipesanandetailIpc:create', data),
    updateTransaksiPesananDetail: (id, data) => ipcRenderer.invoke('transaksipesanandetailIpc:update', { id, data }),
    deleteTransaksiPesananDetail: (id) => ipcRenderer.invoke('transaksipesanandetailIpc:delete', id),

    //transaksipesanan
    getTransaksiPesananList: (params) => ipcRenderer.invoke('transaksipesananIpc:getList', params),
    getTransaksiPesananById: (id) => ipcRenderer.invoke('transaksipesananIpc:getById', id),
    createTransaksiPesanan: (data) => ipcRenderer.invoke('transaksipesananIpc:create', data),
    updateTransaksiPesanan: (id, data) => ipcRenderer.invoke('transaksipesananIpc:update', { id, data }),
    deleteTransaksiPesanan: (id) => ipcRenderer.invoke('transaksipesananIpc:delete', id),


});