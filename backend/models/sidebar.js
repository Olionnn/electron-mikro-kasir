import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const Sidebar = db.define('sidebar', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    nama: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    route: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    kode: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    icon: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    indexing: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    sync_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
},{
    tableName: 'sidebar',
    timestamps: false,
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
  
    if(filter?.parent_id) {
      whereClause.parent_id = filter.parent_id;
    }
  
    let order = [['created_at', 'DESC']];
    if(pagination?.sort) {
      const [field, direction] = pagination.sort.split(':');
      if(field && direction) {
        order = [[field, direction.toUpperCase()]];
      }
    }
  
  
    const {rows: sidebarList, count: totalRows } = await Sidebar.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: order,
    });
  
    const totalPages = Math.ceil(totalRows / limit);
  
    return {
      sidebarList,
      totalRows,
      totalPages,
      currentPage: page,
    };
  }
  
  
  async function GetDataById(id) {
    const sidebar = await Sidebar.findOne({
      where: { id },
    });
  
    return sidebar;
  }
  
  async function CreateData(trx, data) {
    try {
      const sidebar = await Sidebar.create(data, { transaction: trx });
      return sidebar;
    } catch (error) {
      throw error;
    }
  }
  
  
  async function UpdateData(trx, id, data) {
    try {
      const sidebar = await Sidebar.findByPk(id);
      if (!sidebar) {
        throw new Error('Sidebar not found');
      }
      await sidebar.update(data, { transaction: trx });
      return sidebar;
    } catch (error) {
      throw error;
    }
  }
  
  async function DeleteData(trx, id) {
    try {
      const sidebar = await Sidebar.findByPk(id);
      if (!sidebar) {
        throw new Error('Sidebar not found');
      }
      await sidebar.destroy({ transaction: trx });
      return { message: 'Sidebar deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
  
export default Sidebar;
export {
    GetDataList,
    GetDataById,
    CreateData,
    UpdateData,
    DeleteData,
  };
  