import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { B2BBuyerService } from '../services/b2bBuyerService.js';
import { GovernmentMarketplaceService } from '../services/governmentMarketplaceService.js';

export const buyerRouter = Router();

// GET all B2B Buyer requirements
buyerRouter.get('/', (req: Request, res: Response) => {
  const category = req.query.category as string;
  let buyers = db.buyers;
  if (category && category !== 'all') {
    buyers = buyers.filter(b => b.category.toLowerCase().includes(category.toLowerCase()));
  }
  res.json({ success: true, count: buyers.length, data: buyers });
});

// GET single requirement
buyerRouter.get('/:id', (req: Request, res: Response) => {
  const reqItem = db.buyers.find(b => b.id === req.params.id);
  if (!reqItem) {
    return res.status(404).json({ success: false, error: 'Buyer requirement not found' });
  }
  res.json({ success: true, data: reqItem });
});

// POST AI generated proposal for buyer requirement
buyerRouter.post('/:id/generate-proposal', (req: Request, res: Response) => {
  const proposal = B2BBuyerService.generateQuotationProposal(req.params.id, req.body.product_id);
  if (!proposal) {
    return res.status(404).json({ success: false, error: 'Could not generate proposal' });
  }
  res.json({ success: true, data: proposal });
});

// POST send quotation response
buyerRouter.post('/:id/send-quotation', (req: Request, res: Response) => {
  const proposal = req.body;
  // Add joy notification
  db.notifications.unshift({
    id: `notif_${Date.now()}`,
    title: 'Quotation Sent to Buyer! 🤝',
    message: `Your quotation for ₹${(proposal.total_value || 65000).toLocaleString()} was sent directly to the buyer.`,
    time: 'Just now',
    type: 'b2b',
    read: false,
    audio_text: 'మీ కొటేషన్ విజయవంతంగా వ్యాపారికి పంపబడింది.'
  });

  res.json({ success: true, message: 'Quotation submitted successfully', proposal });
});

// GET ONDC export format
buyerRouter.get('/export/ondc', (req: Request, res: Response) => {
  const ondcPayload = GovernmentMarketplaceService.exportToOndcFormat();
  res.json({ success: true, data: ondcPayload });
});

// GET GeM export format
buyerRouter.get('/export/gem', (req: Request, res: Response) => {
  const gemPayload = GovernmentMarketplaceService.exportToGeMFormat();
  res.json({ success: true, data: gemPayload });
});
