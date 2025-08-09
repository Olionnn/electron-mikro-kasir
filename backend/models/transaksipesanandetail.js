import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';

const TransaksiPesananDetail = db.define('transaksi_pesanan_detail', {
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
  transaksi_pesanan_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'transaksiPesanan',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  barang_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'barang',
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
  tableName: 'transaksi_pesanan_detail',
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

  if(filter?.toko_id) {
    whereClause.toko_id = filter.toko_id;
  }
  
  if(filter?.transaksi_pesanan_id) {
    whereClause.transaksi_pesanan_id = filter.transaksi_pesanan_id;
  }

  if(filter?.barang_id) {
    whereClause.barang_id = filter.barang_id;
  }

  let order = [['created_at', 'DESC']];
  if(pagination?.sort) {
    const [field, direction] = pagination.sort.split(':');
    if(field && direction) {
      order = [[field, direction.toUpperCase()]];
    }
  }


  const {rows: transaksiPesananDetailList, count: totalRows } = await TransaksiPesananDetail.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    transaksiPesananDetailList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const transaksiPesananDetail = await TransaksiPesananDetail.findOne({
    where: { id },
  });

  return transaksiPesananDetail;
}

async function CreateData(trx, data) {
  try {
    const transaksiPesananDetail = await TransaksiPesananDetail.create(data, { transaction: trx });
    await trx.commit();
    return transaksiPesananDetail;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const transaksiPesananDetail = await TransaksiPesananDetail.findByPk(id);
    if (!transaksiPesananDetail) {
      throw new Error('Transaksi Pesanan Detail not found');
    }
    await transaksiPesananDetail.update(data, { transaction: trx });
    await trx.commit();
    return transaksiPesananDetail;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const transaksiPesananDetail = await TransaksiPesananDetail.findByPk(id);
    if (!transaksiPesananDetail) {
      throw new Error('Transaksi Pesanan Detail not found');
    }
    await transaksiPesananDetail.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'Transaksi Pesanan Detail deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


export default TransaksiPesananDetail;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
