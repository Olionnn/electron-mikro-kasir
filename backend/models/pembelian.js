import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const Pembelian = db.define('pembelian', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    toko_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'toko',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'supplier',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    tanggal_waktu: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    total_harga: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    total_diskon: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    total_pajak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    nominal_bayar: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    nominal_dibayar: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    nominal_biaya: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    nominal_kembalian: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    no_struk: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    nama_biaya: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    is_use_hutang: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    sync_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
},{
    tableName: 'pembelian',
    timestamps: false,
});
Pembelian.beforeUpdate((inst) => {
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
        {kode: {[Op.like]: `%${filter.search}%`}},
      ]
    }
  
    if(filter?.supplier_id) {
      whereClause.supplier_id = filter.supplier_id;
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
  
  
    const {rows: pembelianDetailList, count: totalRows } = await Pembelian.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: order,
    });
  
    const totalPages = Math.ceil(totalRows / limit);
  
    return {
      pembelianDetailList,
      totalRows,
      totalPages,
      currentPage: page,
    };
  }
  
  
  async function GetDataById(id) {
    const pembelian = await Pembelian.findOne({
      where: { id },
    });
  
    return pembelian;
  }
  
  async function CreateData(trx, data) {
    try {
      const pembelian = await Pembelian.create(data, { transaction: trx });
      return pembelian;
    } catch (error) {
      throw error;
    }
  }
  
  
  async function UpdateData(trx, id, data) {
    try {
      const pembelian = await Pembelian.findByPk(id);
      if (!pembelian) {
        throw new Error('Pembelian not found');
      }
      await pembelian.update(data, { transaction: trx });
      return pembelian;
    } catch (error) {
      throw error;
    }
  }
  
  async function DeleteData(trx, id) {
    try {
      const pembelian = await Pembelian.findByPk(id);
      if (!pembelian) {
        throw new Error('Pembelian not found');
      }
      await pembelian.destroy({ transaction: trx });
      return { message: 'Pembelian deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
  
  
  export default Pembelian;
  export {
    GetDataList,
    GetDataById,
    CreateData,
    UpdateData,
    DeleteData,
  };
  