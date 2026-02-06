import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Admin } from '../models';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../types';

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (!admin.isActive) {
      res.status(403).json({ error: 'Account is deactivated. Please contact super admin.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken({
      id: admin.id,
      role: 'admin',
      username: admin.username,
      email: admin.email,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        phone: admin.phone,
        role: 'admin',
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

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = await Admin.findByPk(req.user!.id, {
      attributes: ['id', 'email', 'username', 'phone', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, phone, currentPassword, newPassword } = updateProfileSchema.parse(req.body);

    const admin = await Admin.findByPk(req.user!.id);

    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({ where: { email } });
      if (existingAdmin) {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }
      admin.email = email;
    }

    if (phone !== undefined) {
      admin.phone = phone;
    }

    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isPasswordValid) {
        res.status(400).json({ error: 'Current password is incorrect' });
        return;
      }
      admin.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        phone: admin.phone,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
