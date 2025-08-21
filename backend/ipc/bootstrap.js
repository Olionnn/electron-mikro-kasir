import { readdirSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';
import db from '../../config/database.js';
import ArusKeuangan from '../models/aruskeuangan.js';
import ArusKeuanganDetail from '../models/aruskeuangandetail.js';
import Banner from '../models/banner.js';
import Barang from '../models/barang.js';  
import BarangLog from '../models/baranglog.js';
import BarangStok from '../models/barangstok.js';
import BarangConfig from '../models/barangconfig.js';
import Biaya from '../models/biaya.js';
import Diskon from '../models/diskon.js';
import Hutang from '../models/hutang.js';
import HutangDetail from '../models/hutangdetail.js';
import HutangHistoryBayar from '../models/hutanghistorybayar.js';
import Info from '../models/info.js';
import Kategori from '../models/kategori.js';
import Pajak from '../models/pajak.js';
import PajakDefault from '../models/pajakdefault.js';
import Pelanggan from '../models/pelanggan.js';
import PembelianDetail from '../models/pembeliandetail.js';
import PengaturanStruk from '../models/pengaturanstruk.js';
import Piutang from '../models/piutang.js';
import PiutangDetail from '../models/piutangdetail.js';
import PiutangHistoryBayar from '../models/piutanghistorybayar.js';
import Sidebar from '../models/sidebar.js';
import SidebarAkses from '../models/sidebarakses.js';
import StokOpname from '../models/stokopname.js';
import StokOpnameDetail from '../models/stokopnamedetail.js';
import Supplier from '../models/supplier.js';
import Toko from '../models/toko.js';
import Transaksi from '../models/transaksi.js';
import TransaksiDetail from '../models/transaksidetail.js';
import TransaksiPesanan from '../models/transaksipesanan.js';
import TransaksiPesananDetail from '../models/transaksipesanandetail.js';
import Users from '../models/users.js';
import Pembelian from '../models/pembelian.js';


async function initDatabase() {
  try {
    const modelsPath = join(app.getAppPath(), 'src', 'backend', 'models');
    console.log('📂 Loading models from:', modelsPath);

    // readdirSync(modelsPath).forEach(file => {
    //   if (file.endsWith('.js') && file !== 'index.js' && file !== 'contoh.js') {
    //     console.log('📌 Registering model:', file);
    //     require(join(modelsPath, file));
    //   }
    // });

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
    await Pembelian.sync();
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
