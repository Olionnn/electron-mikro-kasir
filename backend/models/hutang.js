import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const Hutang = db.define('hutang', {
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
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'supplier',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  total_hutang: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_dibayar: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  jenis_hutang: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status_hutang: {
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
  tableName: 'hutang',
  timestamps: false,
});
Hutang.beforeUpdate((inst) => {
  inst.setDataValue('updated_at', toJakarta(inst.getDataValue('updated_at')));
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

  if(filter?.supplier_id) {
    whereClause.supplier_id = filter.supplier_id;
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


  const {rows: hutangList, count: totalRows } = await Hutang.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    hutangList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}

async function GetDataById(id) {
  const hutang = await Hutang.findOne({
    where: { id },
  });

  return hutang;
}

async function CreateData(trx, data) {
  try {
    const hutang = await Hutang.create(data, { transaction: trx });
    return hutang;
  } catch (error) {
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const hutang = await Hutang.findByPk(id);
    if (!hutang) {
      throw new Error('Hutang not found');
    }
    await hutang.update(data, { transaction: trx });
    return hutang;
  } catch (error) {
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const hutang = await Hutang.findByPk(id);
    if (!hutang) {
      throw new Error('Hutang not found');
    }
    await hutang.destroy({ transaction: trx });
    return { message: 'Hutang deleted successfully' };
  } catch (error) {
    throw error;
  }
}


export default Hutang;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
