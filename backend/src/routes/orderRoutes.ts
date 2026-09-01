import { Router, Request, Response } from 'express';
import { db, Order } from '../db/database.js';

export const orderRouter = Router();

// GET all orders
orderRouter.get('/', (req: Request, res: Response) => {
  const status = req.query.status as string;
  let orders = db.orders;
  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }
  res.json({ success: true, count: orders.length, data: orders });
});

// GET single order
orderRouter.get('/:id', (req: Request, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// PUT update order status progression
orderRouter.put('/:id/status', (req: Request, res: Response) => {
  const { status, step } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status, Number(step) || 1);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  // Generate notification when packed or shipped
  if (status === 'shipped') {
    updated.courier_partner = updated.courier_partner || 'India Post Speed Post';
    updated.tracking_id = updated.tracking_id || `INP${Date.now().toString().slice(-8)}`;
  }

  res.json({ success: true, data: updated });
});
