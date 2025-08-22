import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";


const Pajak = db.define('pajak', {
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
    pajak_persen: {
        type: DataTypes.INTEGER,
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
    }
}, {
    tableName: 'pajak',
    timestamps: false,
});
Pajak.beforeUpdate((inst) => {
    inst.setDataValue('updated_at', toJakarta(inst.getDataValue('updated_at')))
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
  
    // if(filter?.kategori_id) {
    //   whereClause.kategori_id = filter.kategori_id;
    // }
  
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
  
  
    const {rows: pajakList, count: totalRows } = await Pajak.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: order,
    });
  
    const totalPages = Math.ceil(totalRows / limit);
  
    return {
      pajakList,
      totalRows,
      totalPages,
      currentPage: page,
    };
  }
  
  
  async function GetDataById(id) {
    const pajak = await Pajak.findOne({
      where: { id },
    });
  
    return pajak;
  }
  
  async function CreateData(trx, data) {
    try {
      const pajak = await Pajak.create(data, { transaction: trx });
      return pajak;
    } catch (error) {
      throw error;
    }
  }
  
  
  async function UpdateData(trx, id, data) {
    try {
      const pajak = await Pajak.findByPk(id);
      if (!pajak) {
        throw new Error('Pajak not found');
      }
      await pajak.update(data, { transaction: trx });
      return pajak;
    } catch (error) {
      throw error;
    }
  }
  
  async function DeleteData(trx, id) {
    try {
      const pajak = await Pajak.findByPk(id);
      if (!pajak) {
        throw new Error('Pajak not found');
      }
      await pajak.destroy({ transaction: trx });
      return { message: 'Pajak deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
  
  

export default Pajak;
export {
    GetDataList,
    GetDataById,
    CreateData,
    UpdateData,
    DeleteData,
  };
  