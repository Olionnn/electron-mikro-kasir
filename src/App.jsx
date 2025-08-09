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
            {/* <Route path='/pembelian-supplier' element={<PembeliSuplier/>} /> */}
          </Route>


{/* 
          <Route path='/barang-jasa' element={<BarangJasa/>} />
          <Route path='/barang/tambah' element={<TambahEditBarang />} />
          <Route path='/barang/edit/:id' element={<TambahEditBarang />} />
          
          <Route path='/kategori-barang' element={<KategoriPage />} />


          <Route path='/management/pelanggan' element={<div>Pelanggan</div>} />
          <Route path='/management/supplier' element={<div>Supplier</div>} />
          <Route path='/management/diskon' element={<div>Diskon</div>} />
          <Route path='/management/pajak' element={<div>Pajak</div>} />
          <Route path='/management/biaya' element={<div>Biaya</div>} />
          <Route path='/management/marketing' element={<div>Marketing</div>} /> */}







        </Routes>
      </main>
    </div>
    </>
  )
}

export default App
