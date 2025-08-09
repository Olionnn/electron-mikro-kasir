import { DataTypes } from 'sequelize';
import db from '../../../config/database.js';
import { Op } from 'sequelize';

const Piutang = db.define('piutang', {
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
  pelanggan_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pelanggan',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  total_piutang: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_dibayar: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  jenis_piutang: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status_piutang: {
    type: DataTypes.TEXT,
    allowNull: false,
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
  tableName: 'piutang',
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


  const {rows: piutangList, count: totalRows } = await Piutang.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    piutangList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const piutang = await Piutang.findOne({
    where: { id },
  });

  return piutang;
}

async function CreateData(trx, data) {
  try {
    const piutang = await Piutang.create(data, { transaction: trx });
    await trx.commit();
    return piutang;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const piutang = await Piutang.findByPk(id);
    if (!piutang) {
      throw new Error('Piutang not found');
    }
    await piutang.update(data, { transaction: trx });
    await trx.commit();
    return piutang;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const piutang = await Piutang.findByPk(id);
    if (!piutang) {
      throw new Error('Piutang not found');
    }
    await piutang.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'Piutang deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}



export default Piutang;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
