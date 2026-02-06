import SuperAdmin from './SuperAdmin';
import Admin from './Admin';
import Customer from './Customer';
import Order from './Order';

SuperAdmin.hasMany(Admin, {
  foreignKey: 'createdById',
  as: 'admins',
});

Admin.belongsTo(SuperAdmin, {
  foreignKey: 'createdById',
  as: 'creator',
});

Admin.hasMany(Customer, {
  foreignKey: 'createdById',
  as: 'customers',
});

Customer.belongsTo(Admin, {
  foreignKey: 'createdById',
  as: 'creator',
});

Customer.hasMany(Order, {
  foreignKey: 'customerId',
  as: 'orders',
});

Order.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});

Admin.hasMany(Order, {
  foreignKey: 'createdById',
  as: 'orders',
});

Order.belongsTo(Admin, {
  foreignKey: 'createdById',
  as: 'creator',
});

export { SuperAdmin, Admin, Customer, Order };
