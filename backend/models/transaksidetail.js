import { DataTypes } from 'sequelize';
import db from '../../../config/database.js';
import { Op } from 'sequelize';

const TransaksiDetail = db.define('transaksi_detail', {
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
  transaksi_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'transaksi',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  barang_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'transaksiDetail',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  harga: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  diskon_item: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_harga: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'transaksi_detail',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});




async function GetDataList(pagination, filter) {

  const limit = parseInt(pagination.limit) || 10;
  const page = parseInt(pagination.page) || 1;
  const offset = (page - 1) * limit;

  const whereClause = {};

  // if(filter?.search) {
  //   whereClause[Op.or] = [
  //     {nama: {[Op.like]: `%${filter.search}%`}},
  //     {kode: {[Op.like]: `%${filter.search}%`}},
  //   ]
  // }

  if(filter?.transaksi_id) {
    whereClause.transaksi_id = filter.transaksi_id;
  }

  if(filter?.barang_id) {
    whereClause.barang_id = filter.barang_id;
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

  const {rows: barangList, count: totalRows } = await TransaksiDetail.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    barangList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const transaksiDetail = await TransaksiDetail.findOne({
    where: { id },
  });

  return transaksiDetail;
}

async function CreateData(trx, data) {
  try {
    const transaksiDetail = await TransaksiDetail.create(data, { transaction: trx });
    await trx.commit();
    return transaksiDetail;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const transaksiDetail = await TransaksiDetail.findByPk(id);
    if (!transaksiDetail) {
      throw new Error('TransaksiDetail not found');
    }
    await transaksiDetail.update(data, { transaction: trx });
    await trx.commit();
    return transaksiDetail;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const transaksiDetail = await TransaksiDetail.findByPk(id);
    if (!transaksiDetail) {
      throw new Error('TransaksiDetail not found');
    }
    await transaksiDetail.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'TransaksiDetail deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


export default TransaksiDetail;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
