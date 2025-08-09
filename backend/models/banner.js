import { DataTypes } from "sequelize";
import db from "../../../config/database.js";
import { Op } from 'sequelize';

const Banner = db.define("banner", {
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
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_banner_utama: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    tableName: "banner",
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


  const {rows: bannerList, count: totalRows } = await Banner.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    bannerList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const banner = await Banner.findOne({
    where: { id },
  });

  return banner;
}

async function CreateData(trx, data) {
  try {
    const banner = await Banner.create(data, { transaction: trx });
    await trx.commit();
    return banner;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const banner = await Banner.findByPk(id);
    if (!banner) {
      throw new Error('Banner not found');
    }
    await banner.update(data, { transaction: trx });
    await trx.commit();
    return banner;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const banner = await Banner.findByPk(id);
    if (!banner) {
      throw new Error('Banner not found');
    }
    await banner.destroy({ transaction: trx });
    await trx.commit();
    return { message: 'Banner deleted successfully' };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}
export default Banner;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
