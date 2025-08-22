import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const SidebarAkses = db.define('sidebar_akses', {
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
    sidebar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sidebar',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    can_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    can_create: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    can_update: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    can_delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    tableName: 'sidebar_akses',
    timestamps: false,
});
SidebarAkses.beforeUpdate((inst) => {
    inst.updated_at = toJakarta(new Date());
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
  
  
    const {rows: sidebarAksesList, count: totalRows } = await SidebarAkses.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: order,
    });
  
    const totalPages = Math.ceil(totalRows / limit);
  
    return {
      sidebarAksesList,
      totalRows,
      totalPages,
      currentPage: page,
    };
  }
  
  
  async function GetDataById(id) {
    const sidebarAkses = await SidebarAkses.findOne({
      where: { id },
    });
  
    return sidebarAkses;
  }
  
  async function CreateData(trx, data) {
    try {
      const sidebarAkses = await SidebarAkses.create(data, { transaction: trx });
      return sidebarAkses;
    } catch (error) {
      throw error;
    }
  }
  
  
  async function UpdateData(trx, id, data) {
    try {
      const sidebarAkses = await SidebarAkses.findByPk(id);
      if (!sidebarAkses) {
        throw new Error('SidebarAkses not found');
      }
      await sidebarAkses.update(data, { transaction: trx });
      return sidebarAkses;
    } catch (error) {
      throw error;
    }
  }
  
  async function DeleteData(trx, id) {
    try {
      const sidebarAkses = await SidebarAkses.findByPk(id);
      if (!sidebarAkses) {
        throw new Error('SidebarAkses not found');
      }
      await sidebarAkses.destroy({ transaction: trx });
      return { message: 'SidebarAkses deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
  

export default SidebarAkses;
export {
    GetDataList,
    GetDataById,
    CreateData,
    UpdateData,
    DeleteData,
  };

