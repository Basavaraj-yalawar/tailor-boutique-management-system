import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { AdminAttributes } from '../types';

interface AdminCreationAttributes extends Optional<AdminAttributes, 'id' | 'phone' | 'createdAt' | 'updatedAt'> {}

class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: string;
  public email!: string;
  public username!: string;
  public passwordHash!: string;
  public phone!: string;
  public isActive!: boolean;
  public createdById!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Admin.init(
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
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'admins',
    timestamps: true,
  }
);

export default Admin;
