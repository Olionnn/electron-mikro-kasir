import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Register from './pages/register/register'
import PosLayout from './layouts/pos/poslayout'
import Pos from './pages/pos/pos'
import BuatPesanan from './pages/pesanan/AddPesanan'
import Pesanan from './pages/pesanan/Pesanan'
import Review from './pages/pesanan/Review'
import Transaksi from './pages/pos/Trx'
import Struk from './pages/preview/StruckPesanan'
import Management from './pages/m_management/Management'
import AdminLayout from './layouts/admin/adminlayout'
import PembeliSuplier from './pages/m_pembelisupplier/PembeliSupplier'
import BarangAtwJasa from './pages/m_barang/BarangAtwJasa'
import AddEditBarang from './pages/m_barang/AddEditBarang'
import Kategori from './pages/m_kategori/Kategori'
import PelangganPage from './pages/m_pelanggan/Pelanggan'
import SupplierPage from './pages/m_supplier/Supplier'
import PajakPage from './pages/m_pajak/Pajak'
import DiskonPage from './pages/m_diskon/Diskon'
import BiayaPage from './pages/m_Biaya/Biaya'
// import Pembelian from './pages/m_keuangan/Pembelian'
import Bantuan from './pages/m_setting/Bantuan'
import InformasiToko from './pages/m_setting/InformasiToko'
import CountStruk from './pages/m_setting/CountStruk' 
import CountPrint from './pages/m_setting/CountPrint'
import SingkronasiDon from './pages/m_setting/SingkronasiDon'
import SingkronasiUp from './pages/m_setting/SingkronasiUp'
import EDC from './pages/m_setting/EDC'
import PengaturanApk from './pages/m_setting/PengaturanApk'
import EditProfil from './pages/m_setting/EditProfil'
import EditToko from './pages/m_setting/EditToko'
import MetPem from './pages/m_setting/MetPem'
import TokoOnline from './pages/m_setting/TokoOnline'
import Profil from './pages/m_setting/Profil'
import Lainnya from './pages/m_setting/Lainnya'
import Setting from './pages/m_setting/Setting'
import ManajemenStaf from './pages/m_setting/ManajemenStaf'







function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div >
      <main className="h-screen w-screen">
        <Routes>
          <Route path="/" element={<Login/>} />

          <Route path="/register" element={<Register />} />
          <Route element={<PosLayout />}>
            <Route path="/pos" element={<Pos />} />
          </Route>

          <Route path='/pesanan/tambah' element={<BuatPesanan />} />
          <Route path='/pesanan/edit/:id' element={<BuatPesanan />} />
          <Route path='/pesanan' element={<Pesanan />} />
          <Route path='/review' element={<Review />} />
          <Route path='/trx' element={<Transaksi />} />
          <Route path='/struk' element={<Struk/>} />

          <Route element={<AdminLayout/>}>
            <Route path='/management' element={ <Management />   } />
            <Route path='/pembelian-supplier' element={<PembeliSuplier/>} />
            <Route path='/pelanggan' element={<PelangganPage/>} />
            <Route path='/supplier' element={<SupplierPage/>} />
            <Route path='/pajak' element={<PajakPage/>} />
            <Route path='/diskon' element={<DiskonPage/>} />
            <Route path='/biaya' element={<BiayaPage/>} />
          </Route>



          <Route path='/barang-jasa' element={<BarangAtwJasa />} />
          <Route path='/barang/tambah' element={<AddEditBarang />} />
          <Route path='/barang/edit/:id' element={<AddEditBarang />} />
          <Route path='/kategori-barang' element={<Kategori />} />
          <Route path='/marketing' element={<div>Marketing</div>} /> 


         



          <Route path='/pengaturan/bantuan' element={< Bantuan/>} />
          <Route path='/pengaturan/informasitoko' element={<InformasiToko/>} />
          <Route path='/pengaturan/counstruk' element={<CountStruk/>} />
          <Route path='/pengaturan/countprint' element={<CountPrint/>} />
          <Route path='/pengaturan/singkronasidon' element={<SingkronasiDon/>} />
          <Route path='/pengaturan/singkronasiup' element={<SingkronasiUp/>} />
          <Route path='/pengaturan/edc' element={<EDC/>} />
          <Route path='/pengaturan/pengaturanapk' element={<PengaturanApk/>} />
          <Route path='/pengaturan/editprofil' element={<EditProfil/>} />
          <Route path='/pengaturan/edittoko' element={<EditToko/>} />
          <Route path='/pengaturan/metpem' element={<MetPem/>} />
          <Route path='/pengaturan/tokoonline' element={<TokoOnline/>} />
          <Route path='/pengaturan/profil' element={<Profil/>} />
          <Route path='/pengaturan/lainnnya' element={<Lainnya/>} />
          <Route path='/pengaturan/setting' element={<Setting/>} /> 
          <Route path='/pengaturan/manajemenstaf' element={<ManajemenStaf/>} />







        </Routes>
      </main>
    </div>
    </>
  )
}

export default App
