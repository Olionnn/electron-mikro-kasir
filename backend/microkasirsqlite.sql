CREATE TABLE arus_keuangan_detail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    arus_keuangan_id INTEGER,
    supplier_id INTEGER,
    pelanggan_id INTEGER,
    jenis TEXT NOT NULL,
    tipe TEXT NOT NULL,
    tanggal DATETIME,
    nominal INTEGER DEFAULT 0,
    catatan TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,

    -- Foreign Key Constraints
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (arus_keuangan_id) REFERENCES arus_keuangan(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES supplier(id) ON DELETE CASCADE,
    FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE arus_keuangan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    tanggal DATE,
    total_pemasukan INTEGER DEFAULT 0,
    total_pengeluaran INTEGER DEFAULT 0,
    total_pemasukan_lain INTEGER DEFAULT 0,
    total_pengeluaran_lain INTEGER DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,

    -- Foreign Key Constraints
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE banner (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    nama TEXT,
    image TEXT,
    keterangan TEXT,
    is_banner_utama INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,

    -- Foreign Key Constraints
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE barang_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    notif_jumlah INTEGER,
    is_harga_tampil BOOLEAN DEFAULT 1,
    is_stok_tampil BOOLEAN DEFAULT 1,
    is_kode_tampil BOOLEAN DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE barang_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    barang_id INTEGER,
    stok_masuk INTEGER DEFAULT 0,
    stok_keluar INTEGER DEFAULT 0,
    stok_master INTEGER DEFAULT 0,
    keterangan TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (barang_id) REFERENCES barang(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE barang_stok (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    barang_id INTEGER,
    harga_dasar INTEGER,
    tanggal_masuk DATETIME,
    jumlah_stok INTEGER DEFAULT 0,
    keterangan TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (barang_id) REFERENCES barang(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE barang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    kategori_id INTEGER,
    nama TEXT,
    stok INTEGER,
    kode TEXT,
    harga_dasar INTEGER,
    harga_jual INTEGER,
    image TEXT,
    show_transaksi BOOLEAN,
    use_stok BOOLEAN,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE biaya (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    nama TEXT,
    nominal INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE diskon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    nama TEXT,
    jumlah INTEGER,
    jenis_diskon INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE hutang_detail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    hutang_id INTEGER,
    nominal_hutang INTEGER DEFAULT 0,
    nominal_bayar INTEGER DEFAULT 0,
    jatuh_tempo DATE,
    tanggal_bayar DATETIME,
    status_hutang TEXT NOT NULL,
    pembelian_id INTEGER,
    metode_bayar TEXT,
    keterangan TEXT,
    no_struk TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (hutang_id) REFERENCES hutang(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE hutang_history_bayar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    hutang_detail_id INTEGER,
    nominal_cicilan INTEGER DEFAULT 0,
    nominal_belum_bayar INTEGER DEFAULT 0,
    tanggal_bayar DATETIME,
    metode_bayar TEXT,
    keterangan TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (hutang_detail_id) REFERENCES hutang_detail(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE hutang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    supplier_id INTEGER,
    total_hutang INTEGER DEFAULT 0,
    total_dibayar INTEGER DEFAULT 0,
    jenis_hutang TEXT NOT NULL,
    status_hutang TEXT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES supplier(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    nama TEXT,
    image TEXT,
    isi TEXT,
    author TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE kategori (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    nama TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE pajak_default (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    nominal_persen INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE pajak (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    nama TEXT,
    pajak_persen INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE pelanggan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    nama TEXT,
    poin INTEGER DEFAULT 0,
    kode TEXT,
    email TEXT,
    no_telp TEXT,
    alamat TEXT,
    image TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE pembelian_detail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    pembelian_id INTEGER,
    barang_id INTEGER,
    jumlah INTEGER,
    harga INTEGER,
    diskon_item INTEGER DEFAULT 0,
    total_harga INTEGER,
    keterangan TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (pembelian_id) REFERENCES pembelian(id) ON DELETE CASCADE,
    FOREIGN KEY (barang_id) REFERENCES barang(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE pengaturan_struk (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    is_tampilkan_logo BOOLEAN DEFAULT 0,
    mode_cetak_gambar INTEGER DEFAULT 0,
    is_tampilkan_kode_struk BOOLEAN DEFAULT 0,
    is_tampilkan_no_urut BOOLEAN DEFAULT 0,
    is_tampilkan_satuan_sebelah_qty BOOLEAN DEFAULT 0,
    is_tampilkan_alamat_pelanggan BOOLEAN DEFAULT 0,
    is_tampilkan_no_struk BOOLEAN DEFAULT 0,
    is_tampilkan_total_kuantitas BOOLEAN DEFAULT 0,
    is_tampilkan_kolom_ttd_hutang_piutang BOOLEAN DEFAULT 0,
    is_tampilkan_tipe_harga BOOLEAN DEFAULT 0,
    keterangan_header TEXT,
    keterangan_footer TEXT,
    panjang_logo INTEGER DEFAULT 0,
    image TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE piutang_detail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    piutang_id INTEGER,
    nominal_piutang INTEGER DEFAULT 0,
    nominal_bayar INTEGER DEFAULT 0,
    jatuh_tempo DATE,
    tanggal_bayar DATETIME,
    status_piutang TEXT NOT NULL,
    transaksi_id INTEGER,
    metode_bayar TEXT,
    keterangan TEXT,
    no_struk TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (piutang_id) REFERENCES piutang(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE piutang_history_bayar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    piutang_detail_id INTEGER,
    nominal_cicilan INTEGER DEFAULT 0,
    nominal_belum_bayar INTEGER DEFAULT 0,
    tanggal_bayar DATETIME,
    metode_bayar TEXT,
    keterangan TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (piutang_detail_id) REFERENCES piutang_detail(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE piutang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    pelanggan_id INTEGER,
    total_piutang INTEGER DEFAULT 0,
    total_dibayar INTEGER DEFAULT 0,
    jenis_piutang TEXT NOT NULL,
    status_piutang TEXT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE sidebar_akses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    sidebar_id INTEGER,
    role TEXT,
    can_read BOOLEAN DEFAULT 0,
    can_create BOOLEAN DEFAULT 0,
    can_update BOOLEAN DEFAULT 0,
    can_delete BOOLEAN DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (sidebar_id) REFERENCES sidebar(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE sidebar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER DEFAULT 0,
    nama TEXT,
    route TEXT,
    kode TEXT,
    icon TEXT,
    indexing INTEGER NOT NULL,
    keterangan TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1
);


CREATE TABLE stok_opname_detail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    stok_opname_id INTEGER,
    barang_id INTEGER,
    stok_sistem INTEGER DEFAULT 0,
    stok_fisik INTEGER DEFAULT 0,
    stok_sesuai BOOLEAN DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (stok_opname_id) REFERENCES stok_opname(id) ON DELETE CASCADE,
    FOREIGN KEY (barang_id) REFERENCES barang(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE stok_opname (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    keterangan TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE supplier (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER,
    nama TEXT,
    email TEXT,
    no_telp TEXT,
    alamat TEXT,
    image TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE toko (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_toko TEXT,
    nama_pemilik TEXT,
    tampilan_id INTEGER DEFAULT 0,
    jenis_toko_id INTEGER DEFAULT 0,
    alamat_toko TEXT,
    no_telp TEXT,
    image TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    sync_at DATETIME,
    status BOOLEAN DEFAULT 1
);

CREATE TABLE transaksi_detail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER NOT NULL, -- Assuming toko_id is always present
    transaksi_id INTEGER,
    barang_id INTEGER,
    jumlah INTEGER,
    harga INTEGER,
    diskon_item INTEGER DEFAULT 0,
    total_harga INTEGER,
    keterangan TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (transaksi_id) REFERENCES transaksi(id) ON DELETE CASCADE,
    FOREIGN KEY (barang_id) REFERENCES barang(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE transaksi_pesanan_detail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER NOT NULL, -- Assuming toko_id is always present
    transaksi_pesanan_id INTEGER,
    barang_id INTEGER,
    jumlah INTEGER,
    harga INTEGER,
    diskon_item INTEGER DEFAULT 0,
    total_harga INTEGER,
    keterangan TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (transaksi_pesanan_id) REFERENCES transaksiPesanan(id) ON DELETE CASCADE,
    FOREIGN KEY (barang_id) REFERENCES barang(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE transaksi_pesanan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER NOT NULL, -- Assuming toko_id is always present
    pelanggan_id INTEGER,
    tipe TEXT DEFAULT 'dine_in',
    nama TEXT,
    nomor_meja TEXT,
    jumlah_orang INTEGER DEFAULT 0,
    jatuh_tempo DATETIME,
    keterangan TEXT,
    diskon INTEGER DEFAULT 0,
    diskon_type TEXT DEFAULT 'persen',
    pajak_persen INTEGER DEFAULT 0,
    nama_biaya TEXT,
    nominal_biaya INTEGER DEFAULT 0,
    is_arsip BOOLEAN DEFAULT FALSE,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE transaksi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pelanggan_id INTEGER,
    toko_id INTEGER NOT NULL, -- Assuming toko_id is always present
    tanggal_waktu DATETIME,
    total_harga INTEGER,
    total_diskon INTEGER DEFAULT 0,
    total_pajak INTEGER DEFAULT 0,
    total_biaya INTEGER DEFAULT 0,
    nominal_bayar INTEGER,
    nominal_dibayar INTEGER,
    nominal_kembalian INTEGER DEFAULT 0,
    keterangan TEXT,
    no_struk TEXT,
    nama_biaya TEXT,
    metode_bayar TEXT,
    is_use_stok BOOLEAN DEFAULT FALSE,
    is_use_piutang BOOLEAN DEFAULT FALSE,
    nomor_meja TEXT,
    jumlah_orang INTEGER DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME,
    created_by INTEGER,
    updated_by INTEGER,
    sync_at DATETIME,
    status BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE CASCADE,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    toko_id INTEGER NOT NULL, -- Assuming toko_id is always present
    nama TEXT,
    username TEXT,
    password TEXT,
    is_valid INTEGER DEFAULT 0,
    kode TEXT,
    email TEXT,
    no_telp TEXT,
    alamat TEXT,
    role TEXT,
    image TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    sync_at DATETIME,
    status BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE
);


const pembelianTable = SqfEntityTable(
  tableName: "pembelian",
  primaryKeyName: 'id',
  primaryKeyType: PrimaryKeyType.integer_auto_incremental,
  fields: [
    SqfEntityFieldRelationship(
      parentTable: tokoTable,
      fieldName: 'toko_id',
      deleteRule: DeleteRule.CASCADE,
      isPrimaryKeyField: false,
    ),
    SqfEntityFieldRelationship(
      parentTable: supplierTable,
      fieldName: 'supplier_id',
      deleteRule: DeleteRule.CASCADE,
      isPrimaryKeyField: false,
      isNotNull: false,
    ),
    SqfEntityField('tanggal_waktu', DbType.datetime),
    SqfEntityField('total_harga', DbType.integer),
    SqfEntityField('total_diskon', DbType.integer, defaultValue: 0),
    SqfEntityField('total_pajak', DbType.integer, defaultValue: 0),
    SqfEntityField('nominal_bayar', DbType.integer),
    SqfEntityField('nominal_dibayar', DbType.integer),
    SqfEntityField('nominal_biaya', DbType.integer),
    SqfEntityField('nominal_kembalian', DbType.integer, defaultValue: 0),
    SqfEntityField('keterangan', DbType.text),
    SqfEntityField('no_struk', DbType.text),
    SqfEntityField('nama_biaya', DbType.text),
    SqfEntityField('is_use_hutang', DbType.bool, defaultValue: false),
    SqfEntityField('created_at', DbType.datetime, isNotNull: false),
    SqfEntityField('updated_at', DbType.datetime, isNotNull: false),
    SqfEntityFieldRelationship(
      parentTable: usersTable,
      fieldName: 'created_by',
      deleteRule: DeleteRule.CASCADE,
      isPrimaryKeyField: false,
      isNotNull: false,
    ),
    SqfEntityFieldRelationship(
      parentTable: usersTable,
      fieldName: 'updated_by',
      deleteRule: DeleteRule.CASCADE,
      isPrimaryKeyField: false,
      isNotNull: false,
    ),
    SqfEntityField('sync_at', DbType.datetime, isNotNull: false),
    SqfEntityField('status', DbType.bool, defaultValue: true),
  ],
);