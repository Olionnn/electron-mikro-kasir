import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';

const PembelianDetail = db.define('pembelian_detail', {
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
  pembelian_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pembelian',
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
  tableName: 'pembelian_detail',
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

  if(filter?.kategori_id) {
    whereClause.kategori_id = filter.kategori_id;
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


  const {rows: pembelianDetailList, count: totalRows } = await PembelianDetail.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    pembelianDetailList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const pembelianDetail = await PembelianDetail.findOne({
    where: { id },
  });

  return pembelianDetail;
}

async function CreateData(trx, data) {
  try {
    const pembelianDetail = await PembelianDetail.create(data, { transaction: trx });
    await trx.commit();
    return pembelianDetail;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const pembelianDetail = await PembelianDetail.findByPk(id);
    if (!pembelianDetail) {
      throw new Error('PembelianDetail not found');
    }
    await pembelianDetail.update(data, { transaction: trx });
    await trx.commit();
    return pembelianDetail;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const pembelianDetail = await PembelianDetail.findByPk(id);
    if (!pembelianDetail) {
      throw new Error('PembelianDetail not found');
    }
    await pembelianDetail.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'PembelianDetail deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


export default PembelianDetail;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
