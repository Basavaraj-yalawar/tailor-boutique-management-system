import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { SuperAdmin, Admin } from '../models';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../types';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const createAdminSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  phone: z.string().optional(),
});

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const superAdmin = await SuperAdmin.findOne({ where: { email } });

    if (!superAdmin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, superAdmin.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken({
      id: superAdmin.id,
      role: 'superadmin',
      email: superAdmin.email,
      username: superAdmin.username,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: superAdmin.id,
        email: superAdmin.email,
        username: superAdmin.username,
        role: 'superadmin',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const createAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, username, password, phone } = createAdminSchema.parse(req.body);

    const existingAdmin = await Admin.findOne({
      where: {
        [require('sequelize').Op.or]: [{ email }, { username }],
      },
    });

    if (existingAdmin) {
      res.status(400).json({ error: 'Email or username already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      username,
      passwordHash,
      phone,
      isActive: true,
      createdById: req.user!.id,
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        phone: admin.phone,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
};

export const getAllAdmins = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admins = await Admin.findAll({
      attributes: ['id', 'email', 'username', 'phone', 'isActive', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ admins });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
};

export const toggleAdminStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByPk(id);

    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    res.status(200).json({
      message: 'Admin status updated successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    console.error('Toggle admin status error:', error);
    res.status(500).json({ error: 'Failed to update admin status' });
  }
};

export const deleteAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByPk(id);

    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    await admin.destroy();

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ error: 'Failed to delete admin' });
  }
};
