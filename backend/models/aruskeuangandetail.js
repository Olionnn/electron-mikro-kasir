import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';

const ArusKeuanganDetail = db.define('arus_keuangan_detail', {
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
  arus_keuangan_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'arus_keuangan',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'supplier',
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
  jenis: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tipe: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  nominal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  catatan: {
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
  tableName: 'arus_keuangan_detail',
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

  if(filter?.arus_keuangan_id) {
    whereClause.arus_keuangan_id = filter.arus_keuangan_id;
  }

  if(filter?.supplier_id) {
    whereClause.supplier_id = filter.supplier_id;
  }

  if(filter?.toko_id) {
    whereClause.toko_id = filter.toko_id;
  }

  if(filter?.pelanggan_id) {
    whereClause.pelanggan_id = filter.pelanggan_id;
  }


  let order = [['created_at', 'DESC']];
  if(pagination?.sort) {
    const [field, direction] = pagination.sort.split(':');
    if(field && direction) {
      order = [[field, direction.toUpperCase()]];
    }
  }


  const {rows: arusKeuanganDetailList, count: totalRows } = await ArusKeuanganDetail.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    arusKeuanganDetailList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}

async function GetDataById(id) {
  const ArusKeuanganDetail = await ArusKeuanganDetail.findOne({
    where: { id },
  });

  return ArusKeuanganDetail;
}

async function CreateData(trx, data) {
  try {
    const arusKeuanganDetail = await ArusKeuanganDetail.create(data, { transaction: trx });
    await trx.commit();
    return arusKeuanganDetail;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const arusKeuanganDetail = await ArusKeuanganDetail.findByPk(id);
    if (!arusKeuanganDetail) {
      throw new Error('ArusKeuanganDetail not found');
    }
    await arusKeuanganDetail.update(data, { transaction: trx });
    await trx.commit();
    return arusKeuanganDetail;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const arusKeuanganDetail = await ArusKeuanganDetail.findByPk(id);
    if (!arusKeuanganDetail) {
      throw new Error('ArusKeuanganDetail not found');
    }
    await arusKeuanganDetail.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'ArusKeuanganDetail deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}




export default ArusKeuanganDetail;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
