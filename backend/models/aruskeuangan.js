import db from '../../config/database.js';
import { DataTypes } from 'sequelize';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const ArusKeuangan = db.define('arus_keuangan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    toko_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total_pemasukan: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    total_pengeluaran: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    total_pemasukan_lain: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    total_pengeluaran_lain: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
    tableName: 'arus_keuangan',
    timestamps: false, 

});
ArusKeuangan.beforeUpdate((inst) => {
  inst.setDataValue('updated_at',toJakarta(inst.getDataValue('updated_at')));
});

async function GetDataList(pagination, filter) {

  const limit = parseInt(pagination.limit) || 10;
  const page = parseInt(pagination.page) || 1;
  const offset = (page - 1) * limit;

  const whereClause = {};

//   if(filter?.search) {
//     whereClause[Op.or] = [
//       {nama: {[Op.like]: `%${filter.search}%`}},
//       {kode: {[Op.like]: `%${filter.search}%`}},
//     ]
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


  const {rows: arusKeuanganList, count: totalRows } = await ArusKeuangan.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    arusKeuanganList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}



async function GetDataById(id) {
  const arusKeuangan = await ArusKeuangan.findOne({
    where: { id },
  });

  return arusKeuangan;
}

async function CreateData(trx, data) {
  try {
    const arusKeuangan = await ArusKeuangan.create(data, { transaction: trx }); 
    return arusKeuangan;
  } catch (error) {
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const arusKeuangan = await ArusKeuangan.findByPk(id);
    if (!arusKeuangan) {
      throw new Error('ArusKeuangan not found');
    }
    await arusKeuangan.update(data, { transaction: trx });
    return arusKeuangan;
  } catch (error) {
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const arusKeuangan = await ArusKeuangan.findByPk(id);
    if (!arusKeuangan) {
      throw new Error('ArusKeuangan not found');
    }
    await arusKeuangan.destroy({ transaction: trx });
    return { message: 'ArusKeuangandeleted successfully' };
  } catch (error) {
    throw error;
  }
}

export default ArusKeuangan;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
