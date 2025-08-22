import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const Diskon = db.define('diskon', {
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
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jenis_diskon: {
        type: DataTypes.INTEGER, // 1 for percentage, 2 for fixed amount
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
    tableName: 'diskon',
    timestamps: false
});
Diskon.beforeUpdate((inst) => {
  inst.setDataValue('updated_at', toJakarta(inst.getDataValue('updated_at')));
});


async function GetDataList(pagination, filter) {

  const limit = parseInt(pagination.limit) || 10;
  const page = parseInt(pagination.page) || 1;
  const offset = (page - 1) * limit;

  const whereClause = {};

  if(filter?.search) {
    whereClause[Op.or] = [
      {nama: {[Op.like]: `%${filter.search}%`}},
      // {kode: {[Op.like]: `%${filter.search}%`}},
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


  const {rows: diskonList, count: totalRows } = await Diskon.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    diskonList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}

async function GetDataById(id) {
  const diskon = await Diskon.findOne({
    where: { id },
  });

  return diskon;
}

async function CreateData(trx, data) {
  try {
    const diskon = await Diskon.create(data, { transaction: trx });
    return diskon;
  } catch (error) {
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const diskon = await Diskon.findByPk(id);
    if (!diskon) {
      throw new Error('Diskon not found');
    }
    await diskon.update(data, { transaction: trx });
    return diskon;
  } catch (error) {
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const diskon = await Diskon.findByPk(id);
    if (!diskon) {
      throw new Error('Diskon not found');
    }
    await diskon.destroy({ transaction: trx });
    return { message: 'Diskon deleted successfully' };
  } catch (error) {
    throw error;
  }
}

export default Diskon;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
