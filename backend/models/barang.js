import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';

const Barang = db.define('barang', {
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
  kategori_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'kategori',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  nama: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  stok: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  kode: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  harga_dasar: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  harga_jual: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  show_transaksi: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  use_stok: {
    type: DataTypes.BOOLEAN,
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
  tableName: 'barang',
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


  const {rows: barangList, count: totalRows } = await Barang.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    barangList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const barang = await Barang.findOne({
    where: { id },
  });

  return barang;
}

async function CreateData(trx, data) {
  try {
    const barang = await Barang.create(data, { transaction: trx });
    return barang;
  } catch (error) {
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const barang = await Barang.findByPk(id);
    if (!barang) {
      throw new Error('Barang not found');
    }
    await barang.update(data, { transaction: trx });
    return barang;
  } catch (error) {
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const barang = await Barang.findByPk(id);
    if (!barang) {
      throw new Error('Barang not found');
    }
    await barang.destroy({ transaction: trx });
    return { message: 'Barang deleted successfully' };
  } catch (error) {
    throw error;
  }
}



export default Barang;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
