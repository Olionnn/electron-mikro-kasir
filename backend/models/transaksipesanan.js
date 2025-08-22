import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const TransaksiPesanan = db.define('transaksi_pesanan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  toko_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'toko',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  pelanggan_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pelanggan',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  tipe: {
    type: DataTypes.TEXT,
    defaultValue: 'dine_in',
  },
  nama: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  nomor_meja: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  jumlah_orang: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  jatuh_tempo: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  diskon: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  diskon_type: {
    type: DataTypes.TEXT,
    defaultValue: 'persen',
  },
  pajak_persen: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  nama_biaya: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  nominal_biaya: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_arsip: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  sync_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'transaksi_pesanan',
  timestamps: false,
});
TransaksiPesanan.beforeUpdate((inst) => {
  inst.setDataValue('updated_at', toJakarta(inst.getDataValue('updated_at')));
});



async function GetDataList(pagination, filter) {

  const limit = parseInt(pagination.limit) || 10;
  const page = parseInt(pagination.page) || 1;
  const offset = (page - 1) * limit;

  const whereClause = {};

  if(filter?.search) {
    whereClause[Op.or] = [
      {nama: {[Op.like]: `%${filter.search}%`}},
      {nomor_meja: {[Op.like]: `%${filter.search}%`}},
      {tipe: {[Op.like]: `%${filter.search}%`}},
      {nomor_meja: {[Op.like]: `%${filter.search}%`}},
    ]
  }

  if(filter?.pelanggan_id) {
    whereClause.pelanggan_id = filter.pelanggan_id;
  }

  if(filter?.toko_id) {
    whereClause.toko_id = filter.toko_id;
  }

  let order = [['created_at', 'DESC']];
  if(pagination?.sort) {
    const [field, direction] = pagination.sort.split(':');
    if(field && direction) {
      order = [[field, direction.toUpperCase()]];
    }
  }


  const {rows: transaksiPesananList, count: totalRows } = await TransaksiPesanan.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    transaksiPesananList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const transaksiPesanan = await TransaksiPesanan.findOne({
    where: { id },
  });

  return transaksiPesanan;
}

async function CreateData(trx, data) {
  try {
    const transaksiPesanan = await TransaksiPesanan.create(data, { transaction: trx });
    return transaksiPesanan;
  } catch (error) {
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const transaksiPesanan = await TransaksiPesanan.findByPk(id);
    if (!transaksiPesanan) {
      throw new Error('Transaksi Pesanan not found');
    }
    await transaksiPesanan.update(data, { transaction: trx });
    return transaksiPesanan;
  } catch (error) {
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const transaksiPesanan = await TransaksiPesanan.findByPk(id);
    if (!transaksiPesanan) {
      throw new Error('Transaksi Pesanan not found');
    }
    await transaksiPesanan.destroy({ transaction: trx });
    return { message: 'Transaksi Pesanan deleted successfully' };
  } catch (error) {
    throw error;
  }
}



export default TransaksiPesanan;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
