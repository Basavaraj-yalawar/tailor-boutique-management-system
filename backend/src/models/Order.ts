import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { OrderAttributes, OrderStatus, Measurements } from '../types';

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'deliveryDate' | 'fabricDetails' | 'measurements' | 'notes' | 'createdAt' | 'updatedAt'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public customerId!: string;
  public orderDate!: Date;
  public deliveryDate!: Date;
  public status!: OrderStatus;
  public garmentType!: string;
  public fabricDetails!: string;
  public measurements!: Measurements;
  public price!: number;
  public advancePaid!: number;
  public balance!: number;
  public notes!: string;
  public createdById!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Open', 'In Progress', 'Delivered'),
      allowNull: false,
      defaultValue: 'Open',
    },
    garmentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fabricDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    measurements: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    advancePaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    hooks: {
      beforeValidate: (order: Order) => {
        order.balance = Number(order.price) - Number(order.advancePaid);
      },
      beforeUpdate: (order: Order) => {
        if (order.changed('price') || order.changed('advancePaid')) {
          order.balance = Number(order.price) - Number(order.advancePaid);
        }
      },
    },
  }
);

export default Order;
