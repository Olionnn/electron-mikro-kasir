import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';


const Supplier = db.define('supplier', {
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
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    no_telp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
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
    tableName: 'supplier',
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
        {email: {[Op.like]: `%${filter.search}%`}},
        {no_telp: {[Op.like]: `%${filter.search}%`}},
      ]
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
  
  
    const {rows: supplierList, count: totalRows } = await Supplier.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: order,
    });
  
    const totalPages = Math.ceil(totalRows / limit);
  
    return {
      supplierList,
      totalRows,
      totalPages,
      currentPage: page,
    };
  }
  
  
  async function GetDataById(id) {
    const supplier = await Supplier.findOne({
      where: { id },
    });
  
    return supplier;
  }
  
  async function CreateData(trx, data) {
    try {
      const supplier = await Supplier.create(data, { transaction: trx });
      await trx.commit();
      return supplier;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
  
  
  async function UpdateData(trx, id, data) {
    try {
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        throw new Error('Supplier not found');
      }
      await supplier.update(data, { transaction: trx });
      await trx.commit();
      return supplier;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
  
  async function DeleteData(trx, id) {
    try {
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        throw new Error('Supplier not found');
      }
      await supplier.destroy({ transaction: trx });
      await trx.commit();
      return { message: 'Supplier deleted successfully' };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
  
  


export default Supplier;
export {
    GetDataList,
    GetDataById,
    CreateData,
    UpdateData,
    DeleteData,
  };
  