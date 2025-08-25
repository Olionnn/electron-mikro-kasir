import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const StokOpnameDetail = db.define('stok_opname_detail', {
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
  stok_opname_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'stok_opname',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  stokOpnameDetail_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'stokOpnameDetail',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  stok_sistem: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stok_fisik: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stok_sesuai: {
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
  tableName: 'stok_opname_detail',
  timestamps: false,
});
StokOpnameDetail.beforeUpdate((inst) => {
    inst.setDataValue('updated_at',toJakarta(inst.getDataValue('updated_at')));
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

  if(filter?.stok_opname_id) {
    whereClause.stok_opname_id = filter.stok_opname_id;
  }
  
  if(filter?.stokOpnameDetail_id) {
    whereClause.stokOpnameDetail_id = filter.stokOpnameDetail_id;
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


  const {rows: stokOpnameDetailList, count: totalRows } = await StokOpnameDetail.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    stokOpnameDetailList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const stokOpnameDetail = await StokOpnameDetail.findOne({
    where: { id },
  });

  return stokOpnameDetail;
}

async function CreateData(trx, data) {
  try {
    const stokOpnameDetail = await StokOpnameDetail.create(data, { transaction: trx });
    return stokOpnameDetail;
  } catch (error) {
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const stokOpnameDetail = await StokOpnameDetail.findByPk(id);
    if (!stokOpnameDetail) {
      throw new Error('StokOpnameDetail not found');
    }
    await stokOpnameDetail.update(data, { transaction: trx });
    return stokOpnameDetail;
  } catch (error) {
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const stokOpnameDetail = await StokOpnameDetail.findByPk(id);
    if (!stokOpnameDetail) {
      throw new Error('StokOpnameDetail not found');
    }
    await stokOpnameDetail.destroy({ transaction: trx });
    return { message: 'StokOpnameDetail deleted successfully' };
  } catch (error) {
    throw error;
  }
}




export default StokOpnameDetail;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
