import { Response } from 'express';
import { z } from 'zod';
import { Customer, Order } from '../models';
import { AuthRequest } from '../types';

const createCustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  address: z.string().optional(),
});

const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
});

export const createCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createCustomerSchema.parse(req.body);

    const existingCustomer = await Customer.findOne({ where: { phone: data.phone } });

    if (existingCustomer) {
      res.status(400).json({ error: 'Customer with this phone number already exists' });
      return;
    }

    const customer = await Customer.create({
      ...data,
      createdById: req.user!.id,
    });

    res.status(201).json({
      message: 'Customer created successfully',
      customer,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

export const getAllCustomers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customers = await Customer.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ customers });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const getCustomerById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'orders',
          order: [['orderDate', 'DESC']],
        },
      ],
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.status(200).json({ customer });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

export const searchByPhone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { phone } = req.params;

    const customer = await Customer.findOne({
      where: { phone },
      include: [
        {
          model: Order,
          as: 'orders',
          order: [['orderDate', 'DESC']],
        },
      ],
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.status(200).json({ customer });
  } catch (error) {
    console.error('Search customer error:', error);
    res.status(500).json({ error: 'Failed to search customer' });
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateCustomerSchema.parse(req.body);

    const customer = await Customer.findByPk(id);

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    if (data.phone && data.phone !== customer.phone) {
      const existingCustomer = await Customer.findOne({ where: { phone: data.phone } });
      if (existingCustomer) {
        res.status(400).json({ error: 'Phone number already in use' });
        return;
      }
    }

    await customer.update(data);

    res.status(200).json({
      message: 'Customer updated successfully',
      customer,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

export const deleteCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const orderCount = await Order.count({ where: { customerId: id } });

    if (orderCount > 0) {
      res.status(400).json({
        error: 'Cannot delete customer with existing orders',
        orderCount,
      });
      return;
    }

    await customer.destroy();

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};
