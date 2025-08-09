import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';

const Transaksi = db.define('transaksi', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  toko_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'toko',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  tanggal_waktu: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  total_harga: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  total_diskon: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_pajak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_biaya: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  nominal_bayar: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nominal_dibayar: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nominal_kembalian: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  no_struk: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  nama_biaya: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metode_bayar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_use_stok: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_use_piutang: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  nomor_meja: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  jumlah_orang: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  tableName: 'transaksi',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});


async function GetDataList(pagination, filter) {

  const limit = parseInt(pagination.limit) || 10;
  const page = parseInt(pagination.page) || 1;
  const offset = (page - 1) * limit;

  const whereClause = {};

  if(filter?.search) {
    whereClause[Op.or] = [
      {nama: {[Op.like]: `%${filter.search}%`}},
      {kode: {[Op.like]: `%${filter.search}%`}},
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


  const {rows: transaksiList, count: totalRows } = await Transaksi.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    transaksiList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const transaksi = await Transaksi.findOne({
    where: { id },
  });

  return transaksi;
}

async function CreateData(trx, data) {
  try {
    const transaksi = await Transaksi.create(data, { transaction: trx });
    await trx.commit();
    return transaksi;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const transaksi = await Transaksi.findByPk(id);
    if (!transaksi) {
      throw new Error('Transaksi not found');
    }
    await transaksi.update(data, { transaction: trx });
    await trx.commit();
    return transaksi;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const transaksi = await Transaksi.findByPk(id);
    if (!transaksi) {
      throw new Error('Transaksi not found');
    }
    await transaksi.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'Transaksi deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


export default Transaksi;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
