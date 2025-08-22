import { DataTypes } from 'sequelize';
import db from '../../config/database.js';
import { Op } from 'sequelize';
import { toJakarta } from "../helpers/timestamps.js";

const PiutangDetail = db.define('piutang_detail', {
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
  piutang_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'piutang',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  nominal_piutang: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  nominal_bayar: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  jatuh_tempo: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  tanggal_bayar: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status_piutang: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  transaksi_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  metode_bayar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  no_struk: {
    type: DataTypes.TEXT,
    allowNull: true,
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
}, {
  tableName: 'piutang_detail',
  timestamps: false,
});
PiutangDetail.beforeUpdate((inst) => {
  inst.setDataValue('updated_at', toJakarta(inst.getDataValue('updated_at')));});


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

  if(filter?.piutang_id) {
    whereClause.piutang_id = filter.piutang_id;
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


  const {rows: piutangDetailList, count: totalRows } = await PiutangDetail.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    piutangDetailList,
    totalRows,
    totalPages,
    currentPage: page,
  };
}


async function GetDataById(id) {
  const piutangDetail = await PiutangDetail.findOne({
    where: { id },
  });

  return piutangDetail;
}

async function CreateData(trx, data) {
  try {
    const piutangDetail = await PiutangDetail.create(data, { transaction: trx });
    return piutangDetail;
  } catch (error) {
    throw error;
  }
}


async function UpdateData(trx, id, data) {
  try {
    const piutangDetail = await PiutangDetail.findByPk(id);
    if (!piutangDetail) {
      throw new Error('PiutangDetail not found');
    }
    await piutangDetail.update(data, { transaction: trx });
    return piutangDetail;
  } catch (error) {
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const piutangDetail = await PiutangDetail.findByPk(id);
    if (!piutangDetail) {
      throw new Error('PiutangDetail not found');
    }
    await piutangDetail.destroy({ transaction: trx });
    return { message: 'PiutangDetail deleted successfully' };
  } catch (error) {
    throw error;
  }
}


export default PiutangDetail;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
};
