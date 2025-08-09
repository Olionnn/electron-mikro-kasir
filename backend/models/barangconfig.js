import { DataTypes } from "sequelize";
import db from "../../config/database.js";
import { Op } from 'sequelize';

const BarangConfig = db.define("barang_config", {
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
    notif_jumlah: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_harga_tampil: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_stok_tampil: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_kode_tampil: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    tableName: 'barang_config',
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
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


  const {rows: barangConfigList, count: totalRows } = await BarangConfig.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    barangConfigList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}

async function GetDataById(id) {
  const barangConfig = await BarangConfig.findOne({
    where: { id },
  });

  return barangConfig;
}

async function CreateData(trx, data) {
  try {
    const barangConfig = await BarangConfig.create(data, { transaction: trx });
    await trx.commit();
    return barangConfig;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const barangConfig = await BarangConfig.findByPk(id);
    if (!barangConfig) {
      throw new Error('BarangConfig not found');
    }
    await barangConfig.update(data, { transaction: trx });
    await trx.commit();
    return barangConfig;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const barangConfig = await BarangConfig.findByPk(id);
    if (!barangConfig) {
      throw new Error('BarangConfig not found');
    }
    await barangConfig.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'BarangConfig deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


export default BarangConfig;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
