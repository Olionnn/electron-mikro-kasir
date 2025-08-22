import { DataTypes } from "sequelize";
import db from "../../config/database.js";
import { Op } from "sequelize";
import { toJakarta } from "../helpers/timestamps.js";

const Users = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    toko_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "toko",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_valid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    kode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    no_telp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sync_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

Users.beforeUpdate((inst) => {
  inst.setDataValue('updated_at',toJakarta(inst.getDataValue('updated_at')));
});

export function UsersResponse(u)  {
      return {
      id: u.id,
      toko_id: u.toko_id,
      nama: u.nama,
      username: u.username,
      email: u.email,
      is_valid: u.is_valid,
      kode: u.kode,
      no_telp: u.no_telp,
      alamat: u.alamat,
      role: u.role,
      image: u.image,
      sync_at: u.sync_at,
      status: u.status,
      created_at: u.created_at,
      updated_at: u.updated_at,
      }
};
async function GetDataList(pagination, filter) {
  const limit = parseInt(pagination.limit) || 10;
  const page = parseInt(pagination.page) || 1;
  const offset = (page - 1) * limit;

  const whereClause = {};

  if (filter?.search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${filter.search}%` } },
      { email: { [Op.like]: `%${filter.search}%` } }, // optional kolom lain
    ];
  }

  let order = [["created_at", "DESC"]];
  if (pagination.sort) {
    const [field, direction] = pagination.sort.split(":");
    if (field && direction) {
      order = [[field, direction.toUpperCase()]];
    }
  }

  const { rows: userList, count: totalRows } = await Users.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order,
  });

  const totalPages = Math.ceil(totalRows / limit);

  return {
    userList,
    totalRows,
    totalRowsInPage: userList.length,
    currentPage: page,
    totalPages,
  };
}

async function GetDataById(id) {
  const user = await Users.findOne({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

async function CreateData(trx, data) {
      try {
      const user = await Users.create(data, { transaction: trx });
      return user;
      } catch (error) {
      throw new Error("Error creating user: " + error.message);
      }
}

async function UpdateData(trx, id, data) {
  try {
    const user = await Users.findOne({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }

    await user.update(data, { transaction: trx });

    return user;
  } catch (error) {
    throw error;
  }
}

async function DeleteData(trx, id) {
  try {
    const user = await Users.findOne({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }

    await user.destroy({ transaction: trx });

    await trx.commit();
    return { message: "User deleted successfully" };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

function findUserByEmail(email) {
      try {
            return Users.findOne({ where: { email } });
      } catch (error) {
            throw new Error("Error finding user by email");
      }
}

export default Users;
export {
  GetDataList,
  GetDataById,
  CreateData,
  UpdateData,
  DeleteData,
  findUserByEmail,
};
