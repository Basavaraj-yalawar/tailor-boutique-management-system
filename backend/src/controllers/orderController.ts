import { Response } from 'express';
import { z } from 'zod';
import { Order, Customer } from '../models';
import { AuthRequest, OrderStatus } from '../types';

const measurementsSchema = z.object({
  chest: z.number().optional(),
  waist: z.number().optional(),
  hip: z.number().optional(),
  shoulder: z.number().optional(),
  sleeveLength: z.number().optional(),
  shirtLength: z.number().optional(),
  pantLength: z.number().optional(),
  inseam: z.number().optional(),
  thigh: z.number().optional(),
});

const createOrderSchema = z.object({
  customerId: z.string().uuid(),
  orderDate: z.string().datetime().optional(),
  deliveryDate: z.string().datetime().optional(),
  status: z.enum(['Open', 'In Progress', 'Delivered']).optional(),
  garmentType: z.string().min(1),
  fabricDetails: z.string().optional(),
  measurements: measurementsSchema.optional(),
  price: z.number().positive(),
  advancePaid: z.number().min(0).optional(),
  notes: z.string().optional(),
});

const updateOrderSchema = z.object({
  orderDate: z.string().datetime().optional(),
  deliveryDate: z.string().datetime().optional(),
  status: z.enum(['Open', 'In Progress', 'Delivered']).optional(),
  garmentType: z.string().min(1).optional(),
  fabricDetails: z.string().optional(),
  measurements: measurementsSchema.optional(),
  price: z.number().positive().optional(),
  advancePaid: z.number().min(0).optional(),
  notes: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['Open', 'In Progress', 'Delivered']),
});

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createOrderSchema.parse(req.body);

    const customer = await Customer.findByPk(data.customerId);

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const orderData: any = {
      ...data,
      createdById: req.user!.id,
    };

    if (data.orderDate) {
      orderData.orderDate = new Date(data.orderDate);
    }

    if (data.deliveryDate) {
      orderData.deliveryDate = new Date(data.deliveryDate);
    }

    const order = await Order.create(orderData);

    const orderWithCustomer = await Order.findByPk(order.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
        },
      ],
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: orderWithCustomer,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const whereClause: any = {};

    if (status) {
      whereClause.status = status as OrderStatus;
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
        },
      ],
      order: [['orderDate', 'DESC']],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
        },
      ],
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const updateOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateOrderSchema.parse(req.body);

    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const updateData: any = { ...data };

    if (data.orderDate) {
      updateData.orderDate = new Date(data.orderDate);
    }

    if (data.deliveryDate) {
      updateData.deliveryDate = new Date(data.deliveryDate);
    }

    await order.update(updateData);

    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
        },
      ],
    });

    res.status(200).json({
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = updateStatusSchema.parse(req.body);

    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
        },
      ],
    });

    res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await order.destroy();

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

export const getOrdersByCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const orders = await Order.findAll({
      where: { customerId },
      include: [
        {
          model: Customer,
          as: 'customer',
        },
      ],
      order: [['orderDate', 'DESC']],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Get orders by customer error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
