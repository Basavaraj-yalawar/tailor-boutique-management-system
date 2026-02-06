import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'superadmin' | 'admin';
    email?: string;
    username?: string;
  };
}

export interface Measurements {
  chest?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  sleeveLength?: number;
  shirtLength?: number;
  pantLength?: number;
  inseam?: number;
  thigh?: number;
}

export type OrderStatus = 'Open' | 'In Progress' | 'Delivered';

export interface SuperAdminAttributes {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminAttributes {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  phone?: string;
  isActive: boolean;
  createdById: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerAttributes {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdById: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderAttributes {
  id: string;
  customerId: string;
  orderDate: Date;
  deliveryDate?: Date;
  status: OrderStatus;
  garmentType: string;
  fabricDetails?: string;
  measurements?: Measurements;
  price: number;
  advancePaid: number;
  balance: number;
  notes?: string;
  createdById: string;
  createdAt?: Date;
  updatedAt?: Date;
}
