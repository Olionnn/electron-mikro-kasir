import { DataTypes, Op, Sequelize } from 'sequelize';
import db from '../../config/database.js';
import { toJakarta } from '../helpers/timestamps.js';


const Kategori = db.define('kategori', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  toko_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'toko', key: 'id' },
    onDelete: 'CASCADE',
  },
  nama: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
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

  // Getter timezone-aware (display Asia/Jakarta, simpan tetap UTC)
  created_at: {
    type: DataTypes.DATE,
    get() {
      return toJakarta(this.getDataValue('created_at'));
    },
  },
  updated_at: {
    type: DataTypes.DATE,
    get() {
      return toJakarta(this.getDataValue('updated_at'));
    },
  },
}, {
  tableName: 'kategori',
  timestamps: false,

});

Kategori.beforeUpdate((inst) => {
  inst.setDataValue('updated_at',toJakarta(inst.getDataValue('updated_at')));
});

async function GetDataList(pagination = {}, filter = {}) {
  const limit = Number.parseInt(pagination.limit) || 10;
  const page = Number.parseInt(pagination.page) || 1;
  const offset = (page - 1) * limit;

  const whereClause = {};

  if (filter?.search) {
    whereClause[Op.or] = [
      { nama: { [Op.like]: `%${filter.search}%` } },
    ];
  }

  // status bisa true/false → cek tipe boolean
  if (typeof filter?.status === 'boolean') {
    whereClause.status = filter.status;
  }

  if (filter?.toko_id) {
    whereClause.toko_id = filter.toko_id;
  }

  let order = [['created_at', 'DESC']];
  if (typeof pagination?.sort === 'string') {
    const [field, direction] = pagination.sort.split(':');
    const dir = (direction || '').toUpperCase();
    if (field && (dir === 'ASC' || dir === 'DESC')) {
      order = [[field, dir]];
    }
  }

  const { rows, count } = await Kategori.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order,
  });

  const totalPages = Math.ceil(count / limit);

  return {
    kategoriList: rows, // getter akan terpakai saat di-serialize
    totalRows: count,
    totalPages,
    currentPage: page,
  };
}

async function GetDataById(id) {
  const item = await Kategori.findOne({ where: { id } });
  return item;
}

async function CreateData(trx, data) {
  try {
    const kategori = await Kategori.create(data, { transaction: trx });
    return kategori;
  } catch (error) {
    throw error;
  }
}

async function UpdateData(trx, id, data) {
  try {
    const kategori = await Kategori.findByPk(id);
    if (!kategori) throw new Error('Kategori not found');
    await kategori.update(data, { transaction: trx });

    return kategori;
  } catch (error) {
    throw error;
  }
}

async function DeleteData( id) {
  try {
    const kategori = await Kategori.findOne({ where: { id } });
    if (!kategori) throw new Error('Kategori not found');
    await kategori.destroy({ force: true });
    return { message: 'Kategori deleted successfully' };
  } catch (error) {
    throw error;
  }
}

export default Kategori;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,

};