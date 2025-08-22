import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const PengaturanStruk = db.define('pengaturan_struk', {
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
    is_tampilkan_logo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    mode_cetak_gambar: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_tampilkan_kode_struk: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_tampilkan_no_urut: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_tampilkan_satuan_sebelah_qty: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_tampilkan_alamat_pelanggan: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_tampilkan_no_struk: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_tampilkan_total_kuantitas: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_tampilkan_kolom_ttd_hutang_piutang: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_tampilkan_tipe_harga: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    keterangan_header: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    keterangan_footer: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    panjang_logo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    image: {
        type: DataTypes.STRING,
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
  tableName: 'pengaturan_struk',
    timestamps: false,
});
PengaturanStruk.beforeUpdate((inst) => {
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
  
  
    const {rows: pengaturanStrukList, count: totalRows } = await PengaturanStruk.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: order,
    });
  
    const totalPages = Math.ceil(totalRows / limit);
  
    return {
      pengaturanStrukList,
      totalRows,
      totalPages,
      currentPage: page,
    };
  }
  
  
  async function GetDataById(id) {
    const pengaturanStruk = await PengaturanStruk.findOne({
      where: { id },
    });
  
    return pengaturanStruk;
  }
  
  async function CreateData(trx, data) {
    try {
      const pengaturanStruk = await PengaturanStruk.create(data, { transaction: trx });
      return pengaturanStruk;
    } catch (error) {
      throw error;
    }
  }
  
  
  async function UpdateData(trx, id, data) {
    try {
      const pengaturanStruk = await PengaturanStruk.findByPk(id);
      if (!pengaturanStruk) {
        throw new Error('PengaturanStruk not found');
      }
      await pengaturanStruk.update(data, { transaction: trx });
      return pengaturanStruk;
    } catch (error) {
      throw error;
    }
  }
  
  async function DeleteData(trx, id) {
    try {
      const pengaturanStruk = await PengaturanStruk.findByPk(id);
      if (!pengaturanStruk) {
        throw new Error('PengaturanStruk not found');
      }
      await pengaturanStruk.destroy({ transaction: trx });
      return { message: 'PengaturanStruk deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
  


export default PengaturanStruk;
export {
    GetDataList,
    GetDataById,
    CreateData,
    UpdateData,
    DeleteData,
  };
  