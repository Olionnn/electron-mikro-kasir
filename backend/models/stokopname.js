
import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const StokOpname = db.define('stok_opname', {
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
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: true
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
    }
}, {
    tableName: 'stok_opname',
    timestamps: false,
});
StokOpname.beforeUpdate((inst) => {
    inst.setDataValue('updated_at',toJakarta(inst.getDataValue('updated_at')));
});


async function GetDataList(pagination, filter) {

    const limit = parseInt(pagination.limit) || 10;
    const page = parseInt(pagination.page) || 1;
    const offset = (page - 1) * limit;
  
    const whereClause = {};
  
    if(filter?.search) {
      whereClause[Op.or] = [
        // {nama: {[Op.like]: `%${filter.search}%`}},
        // {kode: {[Op.like]: `%${filter.search}%`}},
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
  
  
    const {rows: stokOpnameList, count: totalRows } = await StokOpname.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: order,
    });
  
    const totalPages = Math.ceil(totalRows / limit);
  
    return {
      stokOpnameList,
      totalRows,
      totalPages,
      currentPage: page,
    };
  }
  
  
  async function GetDataById(id) {
    const stokOpname = await StokOpname.findOne({
      where: { id },
    });
  
    return stokOpname;
  }
  
  async function CreateData(trx, data) {
    try {
      const stokOpname = await StokOpname.create(data, { transaction: trx });
      return stokOpname;
    } catch (error) {
      throw error;
    }
  }
  
  
  async function UpdateData(trx, id, data) {
    try {
      const stokOpname = await StokOpname.findByPk(id);
      if (!stokOpname) {
        throw new Error('StokOpname not found');
      }
      await stokOpname.update(data, { transaction: trx });
      return stokOpname;
    } catch (error) {
      throw error;
    }
  }
  
  async function DeleteData(trx, id) {
    try {
      const stokOpname = await StokOpname.findByPk(id);
      if (!stokOpname) {
        throw new Error('StokOpname not found');
      }
      await stokOpname.destroy({ transaction: trx });
      return { message: 'StokOpname deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
  


export default StokOpname;
export {
    GetDataList,
    GetDataById,
    CreateData,
    UpdateData,
    DeleteData,
  };

