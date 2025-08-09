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
import Bantuan from './pages/a/Bantuan'






function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div >
      <main className="h-screen w-screen">
        <Routes>
          <Route path="/" element={<Bantuan/>} />

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


         



          <Route path='/pengaturan' element={<div>Pengaturan APK</div>} />
          <Route path='/pengaturan/sinkronisasi' element={<div>Sinkronisasi</div>} />
          <Route path='/pengaturan/printer' element={<div>Printer</div>} />
          <Route path='/pengaturan/manajemen-staff' element={<div>Manajemen Staff</div>} />
          <Route path='/pengaturan/metode-pembayaran' element={<div>Metode Pembayaran</div>} />
          <Route path='/pengaturan/perangkat-edc' element={<div>Perangkat EDC</div>} />
          <Route path='/pengaturan/pengaturan-transaksi' element={<div>Pengaturan Transaksi</div>} />
          <Route path='/pengaturan/rating-apps' element={<div>Rating Apps</div>} />
          <Route path='/pengaturan/lainnya' element={<div>Lainnya</div>} />
          <Route path='/pengaturan/backup' element={<div>Backup</div>} />
          <Route path='/pengaturan/restore' element={<div>Restore</div>} />
          <Route path='/pengaturan/akun' element={<div>Akun</div>} />
          <Route path='/pengaturan/akun/edit' element={<div>Edit Akun</div>} />






        </Routes>
      </main>
    </div>
    </>
  )
}

export default App
