const PembeliSuplier = () => {
    return ( 
    <>

  <div className="flex h-full">

    <div className="w-[60%] border-r-2 border-gray-200 flex flex-col p-6">

      <div className="flex items-center gap-4 mb-6">
        <button className="border-2 text-lg px-4 py-2 rounded-full">Semua</button>
        <button class="border-2 text-lg px-4 py-2 rounded-full">aenfa</button>
        <div class="flex-1 relative">
          <input type="text" placeholder="Cari barang..." className="w-full border-2 border-green-500 rounded-full pl-12 pr-4 py-3 text-lg focus:outline-none" />
          <svg class="w-6 h-6 absolute left-4 top-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </div>
        <button class="text-green-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto space-y-4 pr-2">
        <button class="flex items-center gap-4 w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg border border-gray-200">
          <div class="bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">Be</div>
          <div>
            <p class="text-lg font-semibold">Beras 5KG</p>
            <p class="text-base text-gray-600">Sisa 5 • Rp 70.000</p>
          </div>
        </button>
        <button class="flex items-center gap-4 w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg border border-gray-200">
          <div class="bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">Be</div>
          <div>
            <p class="text-lg font-semibold">Beras</p>
            <p class="text-base text-gray-600">Sisa 9 • Rp 11.000</p>
          </div>
        </button>
        <button class="flex items-center gap-4 w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg border border-gray-200">
          <div class="bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">Ke</div>
          <div>
            <p class="text-lg font-semibold">Kecap</p>
            <p class="text-base text-gray-600">Sisa 10 • Rp 4.000</p>
          </div>
        </button>
      </div>

      <div class="mt-6">
        <button class="flex items-center gap-3 text-green-700 hover:text-green-900 text-lg">
          <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold">+</div>
          <span class="font-semibold">Tambah Barang Baru</span>
        </button>
      </div>
    </div>

    <div class="w-[40%] flex flex-col p-6">

      <div class="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
        <span className="bg-yellow-400 text-white text-lg px-4 py-1 rounded-full">Draft</span>
        <button className="text-lg text-red-600 border-2 border-red-400 px-4 py-1 rounded-full hover:bg-red-100">Batalkan</button>
        <button class="text-lg border-2 border-gray-400 px-4 py-2 rounded-full hover:bg-gray-100">⇅ Nama</button>
        
        </div>  
        <span class="text-lg text-green-600 font-semibold">+ Biaya (Ctrl+B)</span>
      </div>

      <div class="flex-1 bg-white border-2 border-dashed border-gray-400 rounded-xl p-6 text-center text-gray-500 text-lg">
        Belum ada barang yang dipilih
      </div>

      <div class="mt-6">
        <div class="flex justify-between items-center bg-green-600 text-white px-6 py-4 rounded-t-xl">
          <span class="text-2xl font-bold">Rp 0</span>
          <button class="text-2xl font-bold hover:underline">Bayar (F12)</button>
        </div>
        <button class="w-full border-2 border-green-600 text-green-700 py-3 rounded-b-xl hover:bg-green-50 text-lg font-semibold">
          SIMPAN
        </button>
      </div>

    </div>
  </div>
    
    </> 
);
}
 
export default PembeliSuplier;