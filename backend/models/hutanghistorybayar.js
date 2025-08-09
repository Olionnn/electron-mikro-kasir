import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';

const HutangHistoryBayar = db.define('hutang_history_bayar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  hutang_detail_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'hutang_detail',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  nominal_cicilan: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  nominal_belum_bayar: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tanggal_bayar: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  metode_bayar: {
    type: DataTypes.TEXT,
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
  }
}, {
  tableName: 'hutang_history_bayar',
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

  if(filter?.hutang_detail_id) {
    whereClause.hutang_detail_id = filter.hutang_detail_id;
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


  const {rows: hutangHistoryBayarList, count: totalRows } = await HutangHistoryBayar.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    hutangHistoryBayarList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}
async function GetDataById(id) {
  const HutangHistoryBayar = await HutangHistoryBayar.findOne({
    where: { id },
  });

  return HutangHistoryBayar;
}

async function CreateData(trx, data) {
  try {
    const HutangHistoryBayar = await HutangHistoryBayar.create(data, { transaction: trx });
    await trx.commit();
    return HutangHistoryBayar;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const HutangHistoryBayar = await HutangHistoryBayar.findByPk(id);
    if (!HutangHistoryBayar) {
      throw new Error('HutangHistoryBayar not found');
    }
    await HutangHistoryBayar.update(data, { transaction: trx });
    await trx.commit();
    return HutangHistoryBayar;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const HutangHistoryBayar = await HutangHistoryBayar.findByPk(id);
    if (!HutangHistoryBayar) {
      throw new Error('HutangHistoryBayar not found');
    }
    await HutangHistoryBayar.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'HutangHistoryBayar deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


export default HutangHistoryBayar;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
