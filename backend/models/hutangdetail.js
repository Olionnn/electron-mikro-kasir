import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';

const HutangDetail = db.define('hutang_detail', {
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
  hutang_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'hutang',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  nominal_hutang: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  nominal_bayar: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  jatuh_tempo: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  tanggal_bayar: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status_hutang: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pembelian_id: {
    type: DataTypes.INTEGER,
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
  no_struk: {
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
  tableName: 'hutang_detail',
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

  if(filter?.hutang_id) {
    whereClause.hutang_id = filter.hutang_id;
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


  const {rows: hutangDetailList, count: totalRows } = await HutangDetail.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    hutangDetailList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}

async function GetDataById(id) {
  const barang = await HutangDetail.findOne({
    where: { id },
  });

  return hutangDetail;
}

async function CreateData(trx, data) {
  try {
    const hutangDetail = await HutangDetail.create(data, { transaction: trx });
    await trx.commit();
    return hutangDetail;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const hutangDetail = await HutangDetail.findByPk(id);
    if (!hutangDetail) {
      throw new Error('HutangDetail not found');
    }
    await hutangDetail.update(data, { transaction: trx });
    await trx.commit();
    return hutangDetail;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const hutangDetail = await HutangDetail.findByPk(id);
    if (!hutangDetail) {
      throw new Error('HutangDetail not found');
    }
    await hutangDetail.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'HutangDetail deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}
export default HutangDetail;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
