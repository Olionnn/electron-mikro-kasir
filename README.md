# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





## todo 
- [X] Memnambah fitur dihalaman Pembelian Ke Supplier
- [X] Membenarkan Tampilan Tombol Sesusai Halaman yang dibutuhkan
- [X] Menebenarkan Layout Pos (Text Diskon dan pajak kecil tidak bold, code trx diberi border nama diganti No Transaksi, warna lebih petang, setiap icons diberi tooltip, hasil diskon tanpa keterangan sama diberi box menjadi satu biaya diskon dan pajak)
- [X] Setiap Table Ada Pagination dan Search di halaman laporan neraca
- [X] Ditambahkan code no transaksi dan dihalaman detail juga.
- [X] Mengatur Management Role (Membuat role : role -> akses level, role -> user )
- [X] Menambah Halaman Management Role yang berisi Role, Akses Level
- [X] Text CreditCard Diganti Cicilan.
- [X] Pengaturan Profil Dan Toko Edit Profil Edit Toko
- [X] Membuat Halaman Promosi
- [X] Membuat Modal Pelanggan

- [X] Percantik Halaman Setting dan componentnya
- [X] Logo Bisa Ditekan di Sidebar
- [ ] Simpan Dan Bayar Di Pembelian Ke Supplier
- [X] Halaman Piutang Hutang
- [ ] FIX Size Halaman (Responsive)
- [ ] Remove DevTool (Ctrl Shift I) (Cmd Option I)
- [ ] 



## arm
arch -arm64 npm install
npx electron-rebuild -f -w sqlite3


## not arm
arch -x86_64 npm install
npx electron-rebuild -f -w sqlite3