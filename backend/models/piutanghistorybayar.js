import { DataTypes } from 'sequelize';
import db from '../../../config/database.js';
import { Op } from 'sequelize';

const PiutangHistoryBayar = db.define('piutang_history_bayar', {
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
  piutang_detail_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'piutang_detail',
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
  },
}, {
  tableName: 'piutang_history_bayar',
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

  if(filter?.piutang_detail_id) {
    whereClause.piutang_detail_id = filter.piutang_detail_id;
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


  const {rows: piutangHistoryBayarList, count: totalRows } = await PiutangHistoryBayar.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    piutangHistoryBayarList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const piutangHistoryBayar = await PiutangHistoryBayar.findOne({
    where: { id },
  });

  return piutangHistoryBayar;
}

async function CreateData(trx, data) {
  try {
    const piutangHistoryBayar = await PiutangHistoryBayar.create(data, { transaction: trx });
    await trx.commit();
    return piutangHistoryBayar;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const piutangHistoryBayar = await PiutangHistoryBayar.findByPk(id);
    if (!piutangHistoryBayar) {
      throw new Error('PiutangHistoryBayar not found');
    }
    await piutangHistoryBayar.update(data, { transaction: trx });
    await trx.commit();
    return piutangHistoryBayar;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const piutangHistoryBayar = await PiutangHistoryBayar.findByPk(id);
    if (!piutangHistoryBayar) {
      throw new Error('PiutangHistoryBayar not found');
    }
    await piutangHistoryBayar.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'PiutangHistoryBayar deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


export default PiutangHistoryBayar;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
