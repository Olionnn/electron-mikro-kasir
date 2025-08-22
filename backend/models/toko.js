import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const Toko = db.define('toko', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nama_toko: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nama_pemilik: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tampilan_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    jenis_toko_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    alamat_toko: {
        type: DataTypes.STRING,
        allowNull: true
    },
    no_telp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      get() {
        return toJakarta(this.getDataValue("created_at"));
      },
    },
    updated_at: {
      type: DataTypes.DATE,
      get() {
        return toJakarta(this.getDataValue("updated_at"));
      },
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
    tableName: 'toko',
    timestamps: false, 
});

Toko.beforeUpdate((inst) => {
  inst.setDataValue('updated_at',toJakarta(inst.getDataValue('updated_at')));
});

async function GetDataList(pagination, filter) {

    const limit = parseInt(pagination.limit) || 10;
    const page = parseInt(pagination.page) || 1;
    const offset = (page - 1) * limit;
  
    const whereClause = {};
  
    if(filter?.search) {
      whereClause[Op.or] = [
        {nama_toko: {[Op.like]: `%${filter.search}%`}},
        {nama_pemilik: {[Op.like]: `%${filter.search}%`}},
      ]
    }
  
    if(filter?.tampilan_id) {
      whereClause.tampilan_id = filter.tampilan_id;
    }
  
    if(filter?.jenis_toko_id) {
      whereClause.jenis_toko_id = filter.jenis_toko_id;
    }


  
    let order = [['created_at', 'DESC']];
    if(pagination?.sort) {
      const [field, direction] = pagination.sort.split(':');
      if(field && direction) {
        order = [[field, direction.toUpperCase()]];
      }
    }
  
  
    const {rows: tokoList, count: totalRows } = await Toko.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: order,
    });
  
    const totalPages = Math.ceil(totalRows / limit);
  
    return {
      tokoList,
      totalRows,
      totalPages,
      currentPage: page,
    };
  }
  
  
  async function GetDataById(id) {
    const toko = await Toko.findOne({
      where: { id },
    });
  
    return toko;
  }
  
  async function CreateData(trx, data) {
    try {
      const toko = await Toko.create(data, { transaction: trx });
      return toko;
    } catch (error) {
      throw new Error("Error creating toko: " + error.message);
    }
  }
  
  
  async function UpdateData(trx, id, data) {
    try {
      const toko = await Toko.findByPk(id);
      if (!toko) {
        throw new Error('Toko not found');
      }
      await toko.update(data, { transaction: trx });
      return toko;
    } catch (error) {
      throw error;
    }
  }
  
  async function DeleteData(trx, id) {
    try {
      const toko = await Toko.findByPk(id);
      if (!toko) {
        throw new Error('Toko not found');
      }
      await toko.destroy({ transaction: trx });
      return { message: 'Toko deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
  
  

export default Toko;
export {
    GetDataList,
    GetDataById,
    CreateData,
    UpdateData,
    DeleteData,
  };
  