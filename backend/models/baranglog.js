import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';

const BarangLog = db.define('barang_log', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  toko_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'toko',
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
  stok_masuk: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stok_keluar: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stok_master: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  tableName: 'barang_log',
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


  const {rows: barangLogList, count: totalRows } = await BarangLog.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    barangLogList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const barangLog = await BarangLog.findOne({
    where: { id },
  });

  return barangLog;
}

async function CreateData(trx, data) {
  try {
    const barangLog = await BarangLog .create(data, { transaction: trx });
    await trx.commit();
    return barangLog;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const barangLog = await BarangLog .findByPk(id);
    if (!barangLog) {
      throw new Error('BarangLog  not found');
    }
    await barangLog.update(data, { transaction: trx });
    await trx.commit();
    return barangLog;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const barangLog = await BarangLog .findByPk(id);
    if (!barangLog) {
      throw new Error('BarangLog  not found');
    }
    await barangLog.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'BarangLog  deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

export default BarangLog;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};

