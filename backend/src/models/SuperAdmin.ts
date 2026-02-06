import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { SuperAdminAttributes } from '../types';

interface SuperAdminCreationAttributes extends Optional<SuperAdminAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class SuperAdmin extends Model<SuperAdminAttributes, SuperAdminCreationAttributes> implements SuperAdminAttributes {
  public id!: string;
  public email!: string;
  public username!: string;
  public passwordHash!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SuperAdmin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'super_admins',
    timestamps: true,
  }
);

export default SuperAdmin;
