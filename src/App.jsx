import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import PosLayout from "./layouts/pos/poslayout";
import ShellLayout from "./layouts/ShellLayout";
import Pos from "./pages/pos/Pos";
import BuatPesanan from "./pages/pesanan/AddPesanan";
import Pesanan from "./pages/pesanan/Pesanan";
import Review from "./pages/pesanan/Review";
import Transaksi from "./pages/pos/Trx";
import Struk from "./pages/preview/StruckPesanan";
import Management from "./pages/m_management/Management";
import AdminLayout from "./layouts/admin/adminlayout";
import PembeliSuplier from "./pages/m_pembelisupplier/PembeliSupplier";
import BarangAtwJasa from "./pages/m_barang/BarangAtwJasa";
import AddEditBarang from "./pages/m_barang/AddEditBarang";
import PelangganPage from "./pages/m_pelanggan/Pelanggan";
import SupplierPage from "./pages/m_supplier/Supplier";
import PajakPage from "./pages/m_pajak/Pajak";
import DiskonPage from "./pages/m_diskon/Diskon";
import BiayaPage from "./pages/m_Biaya/Biaya";
// import Pembelian from './pages/m_keuangan/Pembelian'
import Bantuan from "./pages/m_setting/Bantuan";
import InformasiToko from "./pages/m_setting/InformasiToko";
import CountStruk from "./pages/m_setting/CountStruk";
import CountPrint from "./pages/m_setting/CountPrint";
import SingkronasiDon from "./pages/m_setting/SingkronasiDon";
import SingkronasiUp from "./pages/m_setting/SingkronasiUp";
import EDC from "./pages/m_setting/EDC";
import EditParentProfile from "./pages/m_setting/EditProfil";
import EditToko from "./pages/m_setting/EditToko";
import MetPem from "./pages/m_setting/MetPem";
import TokoOnline from "./pages/m_setting/TokoOnline";
import Profil from "./pages/m_setting/Profil";
import Lainnya from "./pages/m_setting/Lainnya";
import SettingsPage from "./pages/m_setting/Setting";
import ManajemenStaf from "./pages/m_setting/ManajemenStaf";
import KategoriBarangPage from "./pages/m_kategori/KategoriBarang";
import Keuangan from "./pages/m_keuangan/Keuangan";
import StokOpnamePage from "./pages/m_stok/StokOpname";
import LaporanPage from "./pages/m_laporan/laporan";
import AbsensiPage from "./pages/m_absensi/Absen";
import ShiftPage from "./pages/m_shift/Shift";
import OlsopinPage from "./pages/m_setting/TokoOnline";
import BarangStokPage from "./pages/m_stok/Stok";
import LaporanPembelian from "./pages/m_laporan/LaporanPembelian";
import LaporanPenjualan from "./pages/m_laporan/LaporanPenjualan";
import LaporanKeuangan from "./pages/m_laporan/LaporanKeuangan";
import LaporanKeuanganPage from "./pages/m_laporan/DetailKeuangan";
import ContactList from "./pages/m_bantuan/HubungiKami";
import FeedbackForm from "./pages/m_bantuan/feedbackapk";
import DashboardKasir from "./pages/m_dasbord/Dasbord";
import LaporanNeraca from "./pages/m_laporan/laporanneraca";
import Laporanshift from "./pages/m_laporan/Laporanshift";
import Riwayattransaksi from "./pages/m_laporan/Riwayattransaksi";
import TrxSetting from "./pages/m_setting/TrxSetting";
import DraftPembelianPage from "./pages/m_pembelisupplier/Draft";
<<<<<<< Updated upstream
import ManagementRole from "./pages/m_setting/ManajemenRole";
=======
import PromosiPage from "./pages/m_promosi/Promosi";
>>>>>>> Stashed changes

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <main className="h-screen w-screen">
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route element={<ShellLayout />}>
              <Route path="/pos" element={<Pos />} />

              {/* Barang  */}
              <Route path="/barang-jasa" element={<BarangAtwJasa />} />
              <Route path="/barang/tambah" element={<AddEditBarang />} />
              <Route path="/barang/edit/:id" element={<AddEditBarang />} />

              {/* Kategori Barang */}
              <Route path="/kategori-barang" element={<KategoriBarangPage />} />

              {/* Pengaturan */}
              <Route path="/pengaturan" element={<SettingsPage />} />
              <Route path="/pengaturan/bantuan" element={<Bantuan />} />
              <Route
                path="/pengaturan/informasitoko"
                element={<InformasiToko />}
              />
              <Route path="/pengaturan/counstruk" element={<CountStruk />} />
              <Route path="/pengaturan/countprint" element={<CountPrint />} />
              <Route
                path="/pengaturan/singkronasidon"
                element={<SingkronasiDon />}
              />
              <Route
                path="/pengaturan/singkronasiup"
                element={<SingkronasiUp />}
              />
              <Route path="/pengaturan/edc" element={<EDC />} />
              <Route path="/pengaturan/editprofil" element={<EditParentProfile />} />
              <Route path="/pengaturan/edittoko" element={<EditToko />} />
              <Route path="/pengaturan/metpem" element={<MetPem />} />
              <Route path="/pengaturan/tokoonline" element={<TokoOnline />} />
              <Route path="/pengaturan/profil" element={<Profil />} />
              <Route path="/pengaturan/lainnnya" element={<Lainnya />} />
              <Route
                path="/pengaturan/manajemenstaf"
                element={<ManajemenStaf />}
              />
              <Route path="/pengaturan/pos" element={<TrxSetting/>} />
              <Route path="/pengaturan/printsetting" element={<CountPrint />} />
              <Route path="/pengaturan/struksetting" element={<CountStruk />} />
              <Route path="/pengaturan/roles" element={<ManagementRole />} />


              {/* Keuangan */}
              <Route path="/keuangan" element={<Keuangan />} />


              {/* Laporan */}
              <Route path="/laporan" element={<LaporanPage/>} />
              <Route path="/laporan/laporan-pembelian" element={<LaporanPembelian />} />
              <Route path="/laporan/laporan-penjualan" element={<LaporanPenjualan />} />
              <Route path="/laporan/laporan-keuangan" element={<LaporanKeuangan />} />
              <Route path="/laporan/laporan-keuangan/detail" element={<LaporanKeuanganPage />} />
              <Route path="/laporan/laporan-neraca" element={<LaporanNeraca/>} />
              <Route path="/laporan/laporan-shift" element={<Laporanshift/>} />
              <Route path="/laporan/riwayat-transaksi" element={<Riwayattransaksi/>} />

            

              {/* Absensi */}
              <Route path="/absensi" element={<AbsensiPage/>} />


              {/* Shift */}
              <Route path="/shift" element={<ShiftPage/>} />


              {/* Pembelian Supplier */}
              <Route path="/pembelian-supplier" element={<PembeliSuplier />} />
              <Route path="/pembelian-supplier/draft" element={<DraftPembelianPage/>} />


              {/* Management */}
              <Route path="/management" element={<Management />} />
              <Route path="/pelanggan" element={<PelangganPage />} />
              <Route path="/supplier" element={<SupplierPage />} />
              <Route path="/pajak" element={<PajakPage />} />
              <Route path="/diskon" element={<DiskonPage />} />
              <Route path="/biaya" element={<BiayaPage />} />
              <Route path="/barang-jasa" element={<BarangAtwJasa />} />
              <Route path="/barang/tambah" element={<AddEditBarang />} />
              <Route path="/barang/edit/:id" element={<AddEditBarang />} />
              <Route path="/promosi" element={<PromosiPage/>}/>


              {/* Toko Online */}
              <Route path="/toko-online" element={<OlsopinPage/>} />


              {/* Pusat Bantuan */}
              <Route path="/pusat-bantuan" element={<Bantuan />} />
              <Route path="/hubungi-kami" element={<ContactList />} />
              <Route path="/medsos" element={<div>Sosials</div>} />
              <Route path="/feedback" element={<FeedbackForm />} />


              {/* Kirim Masukan */}
              <Route path="/kirim-masukan" element={<FeedbackForm />} />


              {/* Stok */}
              <Route path="/stok" element={<BarangStokPage/>} />
              <Route path="/stok/:id" element={<div>Detail Stok Page</div>} />
              <Route path="/stok/tambah" element={<div>Tambah Stok Page</div>} />
              <Route path="/stok/edit/:id" element={<div>Edit Stok Page</div>} />
              <Route path="/stokopname" element={<StokOpnamePage/>} />


              {/* Cart And Preview */}
              <Route path="/pesanan/tambah" element={<BuatPesanan />} />
              <Route path="/pesanan/edit/:id" element={<BuatPesanan />} />
              <Route path="/pesanan" element={<Pesanan />} />
              <Route path="/review" element={<Review />} />
              <Route path="/trx" element={<Transaksi />} />
              <Route path="/struk" element={<Struk />} />


              {/* Users */}
              <Route path="/users/staff" element={<ManajemenStaf/>} />

              {/* Dasboard */}
              <Route path="/dashboard" element={<DashboardKasir/>} />








          




            </Route>
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
