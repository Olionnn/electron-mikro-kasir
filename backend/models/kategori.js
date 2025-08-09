import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';


const Kategori = db.define('kategori', {
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
    nama: {
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
    tableName: 'kategori',
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
    //   {kode: {[Op.like]: `%${filter.search}%`}},
    ]
  }

//   if(filter?.kategori_id) {
//     whereClause.kategori_id = filter.kategori_id;
//   }

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


  const {rows: kategoriList, count: totalRows } = await Kategori.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    kategoriList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const Kategori = await Kategori.findOne({
    where: { id },
  });

  return Kategori;
}

async function CreateData(trx, data) {
  try {
    const Kategori = await Kategori.create(data, { transaction: trx });
    await trx.commit();
    return Kategori;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const Kategori = await Kategori.findByPk(id);
    if (!Kategori) {
      throw new Error('Kategori not found');
    }
    await Kategori.update(data, { transaction: trx });
    await trx.commit();
    return Kategori;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const Kategori = await Kategori.findByPk(id);
    if (!Kategori) {
      throw new Error('Kategori not found');
    }
    await Kategori.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'Kategori deleted successfully' };
  } catch (error) {
    await trx.rollback();
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
