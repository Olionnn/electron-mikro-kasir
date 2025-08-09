import { DataTypes } from 'sequelize';
import db from '../../../config/database.js';
import { Op } from 'sequelize';

const PajakDefault = db.define('pajak_default', {
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
    nominal_persen: {
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
    tableName: 'pajak_default',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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
  
  
    const {rows: pajakDefaultList, count: totalRows } = await PajakDefault.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: order,
    });
  
    const totalPages = Math.ceil(totalRows / limit);
  
    return {
      pajakDefaultList,
      totalRows,
      totalPages,
      currentPage: page,
    };
  }
  
  
  async function GetDataById(id) {
    const pajakDefault = await PajakDefault.findOne({
      where: { id },
    });
  
    return pajakDefault;
  }
  
  async function CreateData(trx, data) {
    try {
      const pajakDefault = await PajakDefault.create(data, { transaction: trx });
      await trx.commit();
      return pajakDefault;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
  
  
  async function UpdateData(trx, id, data) {
    try {
      const pajakDefault = await PajakDefault.findByPk(id);
      if (!pajakDefault) {
        throw new Error('PajakDefault not found');
      }
      await pajakDefault.update(data, { transaction: trx });
      await trx.commit();
      return pajakDefault;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
  
  async function DeleteData(trx, id) {
    try {
      const pajakDefault = await PajakDefault.findByPk(id);
      if (!pajakDefault) {
        throw new Error('PajakDefault not found');
      }
      await pajakDefault.destroy({ transaction: trx });
      await trx.commit();
      return { message: 'PajakDefault deleted successfully' };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
  

  
export default PajakDefault;
export {
    GetDataList,
    GetDataById,
    CreateData,
    UpdateData,
    DeleteData,
  };
  