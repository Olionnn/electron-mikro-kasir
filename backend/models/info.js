import { DataTypes } from 'sequelize';
import db from '../../../config/database.js';
import { Op } from 'sequelize';

const Info = db.define('info', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    toko_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'toko',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isi: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    sync_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'info', 
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
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


  const {rows: infoList, count: totalRows } = await Info.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    infoList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}
async function GetDataById(id) {
  const info = await Info.findOne({
    where: { id },
  });

  return info;
}

async function CreateData(trx, data) {
  try {
    const info = await Info.create(data, { transaction: trx });
    await trx.commit();
    return info;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const info = await Info.findByPk(id);
    if (!info) {
      throw new Error('Info not found');
    }
    await info.update(data, { transaction: trx });
    await trx.commit();
    return info;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const info = await Info.findByPk(id);
    if (!info) {
      throw new Error('Info not found');
    }
    await info.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'Info deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

export default Info;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
