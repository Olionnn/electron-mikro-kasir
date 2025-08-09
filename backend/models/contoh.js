import { DataTypes } from 'sequelize';
import db from '../configs/database.js';
import { Op } from 'sequelize';

// CREATE TABLE hutang_history_bayar (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     toko_id INTEGER,
//     hutang_detail_id INTEGER,
//     nominal_cicilan INTEGER DEFAULT 0,
//     nominal_belum_bayar INTEGER DEFAULT 0,
//     tanggal_bayar DATETIME,
//     metode_bayar TEXT,
//     keterangan TEXT,
//     created_at DATETIME,
//     updated_at DATETIME,
//     created_by INTEGER,
//     updated_by INTEGER,
//     sync_at DATETIME,
//     status BOOLEAN DEFAULT 1,
//     FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE CASCADE,
//     FOREIGN KEY (hutang_detail_id) REFERENCES hutang_detail(id) ON DELETE CASCADE,
//     FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
//     FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
// );


// const HutangHistoryBayar = db.define('hutang_history_bayar', {}, {
//     timestamps: true,
// });


// prompt: buatkan saya model dari sqlite ini menjadi Sequelize orm js DENGAN SAMA PERSIS TANPA KESALAHAN