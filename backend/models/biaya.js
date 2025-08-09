import { DataTypes } from "sequelize";
import db from "../../../config/database.js";
import { Op } from 'sequelize';

const Biaya = db.define("biaya", {
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
            model: "toko",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nominal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id"
        },
        onDelete: "CASCADE"
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
    tableName: 'biaya',
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


  const {rows: biayaList, count: totalRows } = await Biaya.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    biayaList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}

async function GetDataById(id) {
  const biaya = await Biaya.findOne({
    where: { id },
  });

  return biaya;
}

async function CreateData(trx, data) {
  try {
    const biaya = await Biaya.create(data, { transaction: trx });
    await trx.commit();
    return biaya;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const biaya = await Biaya.findByPk(id);
    if (!biaya) {
      throw new Error('Biaya not found');
    }
    await biaya.update(data, { transaction: trx });
    await trx.commit();
    return biaya;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const biaya = await Biaya.findByPk(id);
    if (!biaya) {
      throw new Error('Biaya not found');
    }
    await biaya.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'Biaya deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

export default Biaya;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
