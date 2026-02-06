import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import sequelize from './config/database';
import { SuperAdmin } from './models';
import { errorHandler } from './middleware/errorHandler';
import superAdminRoutes from './routes/superAdminRoutes';
import adminRoutes from './routes/adminRoutes';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    message: 'Tailor Boutique Management System API',
    version: '1.0.0',
    endpoints: {
      superadmin: '/api/superadmin',
      admin: '/api/admin',
      customers: '/api/customers',
      orders: '/api/orders',
    },
  });
});

app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✓ Database models synchronized.');

    const existingSuperAdmin = await SuperAdmin.findOne({
      where: { email: 'superadmin@tailor.com' },
    });

    if (!existingSuperAdmin) {
      const passwordHash = await bcrypt.hash('SuperAdmin@123', 10);
      await SuperAdmin.create({
        email: 'superadmin@tailor.com',
        username: 'superadmin',
        passwordHash,
      });
      console.log('✓ Default super admin created successfully.');
      console.log('  Email: superadmin@tailor.com');
      console.log('  Username: superadmin');
      console.log('  Password: SuperAdmin@123');
    } else {
      console.log('✓ Super admin already exists.');
    }
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    throw error;
  }
};

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log('✓ Server is running');
      console.log(`  Local: http://localhost:${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
