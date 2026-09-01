import { Router, Request, Response } from 'express';
import { db, Product } from '../db/database.js';

export const productRouter = Router();

// GET all products
productRouter.get('/', (req: Request, res: Response) => {
  const status = req.query.status as string;
  let products = db.products;
  if (status && status !== 'all') {
    products = products.filter(p => p.status === status);
  }
  res.json({ success: true, count: products.length, data: products });
});

// GET single product
productRouter.get('/:id', (req: Request, res: Response) => {
  const product = db.findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// POST new product
productRouter.post('/', (req: Request, res: Response) => {
  const body = req.body;
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    seller_id: body.seller_id || 'user_artisan_01',
    name: body.name || 'New Artisan Product',
    images: body.images && body.images.length > 0 ? body.images : [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ],
    original_image: body.original_image,
    enhanced_image: body.enhanced_image,
    description: body.description || '',
    description_hi: body.description_hi || '',
    description_regional: body.description_regional || '',
    language: body.language || 'te',
    category: body.category || 'Handcraft',
    material: body.material || 'Natural Materials',
    dimensions: body.dimensions || 'Standard',
    colour: body.colour || 'Natural',
    production_method: body.production_method || 'Handmade',
    making_time_days: Number(body.making_time_days) || 3,
    quantity: Number(body.quantity) || 10,
    raw_material_cost: Number(body.raw_material_cost) || 500,
    labour_cost: Number(body.labour_cost) || 400,
    suggested_price: Number(body.suggested_price) || 1499,
    selling_price: Number(body.selling_price) || 1499,
    status: body.status || 'active',
    channels: body.channels || {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date().toISOString()
  };

  db.addProduct(newProduct);

  // Auto-create a joyful notification
  db.notifications.unshift({
    id: `notif_${Date.now()}`,
    title: 'Product Published Successfully! 🎉',
    message: `${newProduct.name} is now live and visible to buyers worldwide.`,
    time: 'Just now',
    type: 'system',
    read: false,
    audio_text: 'మీ ఉత్పత్తి విజయవంతంగా ప్రచురించబడింది.'
  });

  res.status(201).json({ success: true, data: newProduct });
});

// PUT update product
productRouter.put('/:id', (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: updated });
});

// DELETE product
productRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
});

// POST duplicate product
productRouter.post('/:id/duplicate', (req: Request, res: Response) => {
  const original = db.findProductById(req.params.id);
  if (!original) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  const duplicated: Product = {
    ...original,
    id: `prod_${Date.now()}`,
    name: `${original.name} (Copy)`,
    status: 'draft',
    created_at: new Date().toISOString()
  };
  db.addProduct(duplicated);
  res.status(201).json({ success: true, data: duplicated });
});
