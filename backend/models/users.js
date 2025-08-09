
import { DataTypes } from 'sequelize';
import db from '../../../config/database.js';
import { Op } from 'sequelize';

const Users = db.define('users', {
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
    username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
    },
    password: {
          type: DataTypes.STRING,
          allowNull: false
    },
    is_valid: {
          type: DataTypes.INTEGER,
          defaultValue: 0
    },
    kode: {
          type: DataTypes.STRING,
          allowNull: true
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
          type: DataTypes.STRING,
          allowNull: true
    },
    role: {
          type: DataTypes.STRING,
          allowNull: true
    },
    image: {
          type: DataTypes.STRING,
          allowNull: true
    },
    sync_at: {
          type: DataTypes.DATE,
          allowNull: true
    },
    status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
    },
}, {
    timestamps : true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


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
    
      let order = [['created_at', 'DESC']]; 
      if (pagination.sort) {
        const [field, direction] = pagination.sort.split(':');
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
      const user = await Users.findByPk(id);
      if (!user) {
            throw new Error('User not found');
      }
      return user;
}

async function CreateData(trx, data) {
      try {
            const user = await Users.create(data, { transaction: trx });
      
            await trx.commit();
            return user;
      } catch (error) {
            await trx.rollback(); 
            throw error;
      }
}

async function UpdateData(trx, id, data) {
      try {
            const user = await Users.findByPk(id);
            if (!user) {
                  throw new Error('User not found');
            }
      
            await user.update(data, { transaction: trx });
      
            await trx.commit();
            return user;
      } catch (error) {
            await trx.rollback(); 
            throw error;
      }
}

async function DeleteData(trx, id) {
      try {
            const user = await Users.findByPk(id);
            if (!user) {
                  throw new Error('User not found');
            }
      
            await user.destroy({ transaction: trx });
      
            await trx.commit();
            return { message : 'User deleted successfully' };
      } catch (error) {
            await trx.rollback(); 
            throw error;
      }
}


export default Users;
export {
    GetDataList,
    GetDataById,
    CreateData,
    UpdateData,
    DeleteData
};