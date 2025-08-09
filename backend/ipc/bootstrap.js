// src/main/database/init.js
import { readdirSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';
import db from '../../../config/database';
import ArusKeuangan from '../models/aruskeuangan';
import ArusKeuanganDetail from '../models/aruskeuangandetail';
import Banner from '../models/banner';
import Barang from '../models/barang';  
import BarangLog from '../models/baranglog';
import BarangStok from '../models/barangstok';
import BarangConfig from '../models/barangconfig';
import Biaya from '../models/biaya';
import Diskon from '../models/diskon';
import Hutang from '../models/hutang';
import HutangDetail from '../models/hutangdetail';
import HutangHistoryBayar from '../models/hutanghistorybayar';
import Info from '../models/info';
import Kategori from '../models/kategori';
import Pajak from '../models/pajak';
import PajakDefault from '../models/pajakdefault';
import Pelanggan from '../models/pelanggan';
import PembelianDetail from '../models/pembeliandetail';
import PengaturanStruk from '../models/pengaturanstruk';
import Piutang from '../models/piutang';
import PiutangDetail from '../models/piutangdetail';
import PiutangHistoryBayar from '../models/piutanghistorybayar';
import Sidebar from '../models/sidebar';
import SidebarAkses from '../models/sidebarakses';
import StokOpname from '../models/stokopname';
import StokOpnameDetail from '../models/stokopnamedetail';
import Supplier from '../models/supplier';
import Toko from '../models/toko';
import Transaksi from '../models/transaksi';
import TransaksiDetail from '../models/transaksidetail';
import TransaksiPesanan from '../models/transaksipesanan';
import TransaksiPesananDetail from '../models/transaksipesanandetail';
import Users from '../models/users';


async function initDatabase() {
  try {
    const modelsPath = join(app.getAppPath(), 'src', 'backend', 'models');
    console.log('📂 Loading models from:', modelsPath);

    readdirSync(modelsPath).forEach(file => {
      if (file.endsWith('.js') && file !== 'index.js' && file !== 'contoh.js') {
        console.log('📌 Registering model:', file);
        require(join(modelsPath, file));
      }
    });

    await db.authenticate();

    await ArusKeuangan.sync();
    await ArusKeuanganDetail.sync();
    await Banner.sync();
    await Barang.sync();
    await BarangLog.sync();
    await BarangStok.sync();
    await BarangConfig.sync();
    await Biaya.sync();
    await Diskon.sync();
    await Hutang.sync();
    await HutangDetail.sync();
    await HutangHistoryBayar.sync();
    await Info.sync();
    await Kategori.sync();
    await Pajak.sync();
    await PajakDefault.sync();
    await Pelanggan.sync();
    await PembelianDetail.sync();
    await PengaturanStruk.sync();
    await Piutang.sync();
    await PiutangDetail.sync();
    await PiutangHistoryBayar.sync();
    await Sidebar.sync();
    await SidebarAkses.sync();
    await StokOpname.sync();
    await StokOpnameDetail.sync();
    await Supplier.sync();
    await Toko.sync();
    await Transaksi.sync();
    await TransaksiDetail.sync();
    await TransaksiPesanan.sync();
    await TransaksiPesananDetail.sync();
    await Users.sync();
    
    await db.sync();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database init error:', error);
  }
}

export default initDatabase;
