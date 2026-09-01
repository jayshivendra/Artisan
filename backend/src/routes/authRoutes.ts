import { Router, Request, Response } from 'express';
import { db, User } from '../db/database.js';

export const authRouter = Router();

// GET current profile
authRouter.get('/profile', (req: Request, res: Response) => {
  const user = db.users[0];
  res.json({ success: true, data: user });
});

// PUT update profile
authRouter.put('/profile', (req: Request, res: Response) => {
  if (db.users.length > 0) {
    db.users[0] = { ...db.users[0], ...req.body };
    return res.json({ success: true, data: db.users[0] });
  }
  const newUser: User = {
    id: 'user_artisan_01',
    name: req.body.name || 'Artisan',
    phone: req.body.phone || '+91 98480 22334',
    preferred_language: req.body.preferred_language || 'te',
    craft_categories: req.body.craft_categories || ['Handloom / Textiles'],
    location: req.body.location || 'India',
    business_name: req.body.business_name || 'Artisan Studio',
    created_at: new Date().toISOString()
  };
  db.users.push(newUser);
  res.json({ success: true, data: newUser });
});

// GET notifications
authRouter.get('/notifications', (req: Request, res: Response) => {
  res.json({ success: true, count: db.notifications.length, data: db.notifications });
});

// POST mark notification read
authRouter.post('/notifications/:id/read', (req: Request, res: Response) => {
  const notif = db.notifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true, data: notif });
});
