# KarigarAI (ShilpMitra) — AI Virtual Business Manager for Artisans

> **“Take your craft to the world.”**
> Production-ready, cross-platform mobile application designed specifically for traditional artisans, weavers, handicraft makers, and micro-entrepreneurs with low digital literacy.

---

## 🌟 Core Highlights & Design Philosophy

1. **Accessible & Low-Literacy Design**:
   - Warm Indian Cultural Design System (Terracotta `#D9532F`, Indigo `#1E3A8A`, Marigold `#F59E0B`).
   - Large touch targets (min 56px), high-contrast typography, minimal text, maximum icons and imagery.
   - Spoken Audio Guidance buttons (🔊) on every screen for artisans who prefer listening over reading.
   - Acoustic reassurance chimes on every important action.

2. **Multilingual Across 10 Indian Languages**:
   - English, हिन्दी (Hindi), తెలుగు (Telugu), தமிழ் (Tamil), বাংলা (Bengali), मराठी (Marathi), ગુજરાતી (Gujarati), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam), ਪੰਜਾਬੀ (Punjabi) in native scripts with voice playback.

3. **Guided 7-Step AI Add-Product Wizard**:
   - **Step 1: Smart Photo Capture** with visual photography tips.
   - **Step 2: AI Photo Studio & Enhancer** with interactive **Before / After** comparison slider, studio lighting, background isolation, and studio/white/light/original presets.
   - **Step 3: Multilingual Voice-to-Catalog** (artisan speaks naturally e.g. in Telugu/Hindi; AI automatically extracts Product Name, Category, Material, Craft Type, Making Days, and Dimensions).
   - **Step 4: AI Dual-Language Storytelling Descriptions** (English + Hindi + Regional authentic artisan stories and care instructions).
   - **Step 5: Dynamic Pricing Assistant** calculating fair daily living wages + raw materials + market demand with an interactive profit breakdown slider.
   - **Step 6: WYSIWYG Buyer Preview** & Multichannel Distributor (My Store, Government Marketplace GeM, B2B Wholesale, ONDC Network).
   - **Step 7: Celebration Publish Experience** with confetti and buyer discovery reach counter.

4. **Global Floating AI Voice Assistant**:
   - Floating pulsating microphone available on every screen.
   - Listens to natural speech commands (*"Show my orders"*, *"Add a new product"*, *"Check my sales"*, *"What price should I keep?"*, *"Find bulk buyers"*).
   - Speaks answers back and navigates directly to target screens.

5. **Direct B2B Buyer Matching & Quotation Generator**:
   - Connects verified wholesale buyers (Hotels, Retailers, Interior Designers, Corporate Gifting, Government Procurement) directly with artisans.
   - 1-tap AI wholesale proposal sender with sample dispatch and milestone payment protection.

6. **Government Marketplace (GeM) & ONDC Integration Hub**:
   - 1-click catalog export formatted according to official Government e-Marketplace (GeM) and Open Network for Digital Commerce (ONDC v1.2.0) schemas.

---

## 📱 The 27 Screens Built

1. **Screen 1: Splash & Welcome** (*"Take your craft to the world"*)
2. **Screen 2: Choose Language** (10 Indian regional languages in native scripts)
3. **Screen 3: Craft Categories** (*"What do you make?"* with visual cards: Handloom, Pottery, Jewellery, Woodwork, etc.)
4. **Screen 4: Simple Artisan Profile Setup**
5. **Screen 5: Home Dashboard** (Greeting, AI Assistant card, Big Number stats, Quick actions, AI Suggestions)
6. **Screen 6: AI Voice Assistant Modal** (Live listening, speech synthesis & command execution)
7. **Screen 7: Camera & Smart Photo Capture**
8. **Screen 8: Gallery Upload & Demo Craft Selectors**
9. **Screen 9: AI Photo Studio Enhancer** (Interactive Before/After split slider & studio backdrops)
10. **Screen 10: Voice-to-Catalog Input** (Pulsating microphone recording)
11. **Screen 11: Speech-to-Text & NLP Attribute Extraction**
12. **Screen 12: Multilingual AI Descriptions** (English, Hindi, and Regional stories)
13. **Screen 13: AI Dynamic Pricing Assistant** (Fair wages, material cost, profit margin slider)
14. **Screen 14: Product Listing WYSIWYG Preview**
15. **Screen 15: Publish Celebration Experience** (Confetti & buyer discovery metrics)
16. **Screen 16: My Products Catalog** (Filterable cards: Active, Low Stock, Draft)
17. **Screen 17: Product Details & Metrics**
18. **Screen 18: Inline Price & Stock Editor**
19. **Screen 19: Orders Management** (Tabs: New, Processing, Shipped, Completed)
20. **Screen 20: Order Details & 4-Step Progress Tracking** (Received → Packed → Shipped → Delivered)
21. **Screen 21: B2B "Find Buyers" Marketplace** (Hotel & Retailer RFQs)
22. **Screen 22: Buyer Details & AI Wholesale Quotation Generator**
23. **Screen 23: Sales & Business Analytics Dashboard** (Revenue, bar chart growth, top crafts, festival trends)
24. **Screen 24: Government Marketplace (GeM / ONDC) Integration Hub**
25. **Screen 25: Notifications & Audio Alerts**
26. **Screen 26: Profile & Language Settings**
27. **Screen 27: Spoken Audio-Visual Tutorials** (Step-by-step voice guides for low digital literacy)

---

## 🛠️ Tech Stack & Setup

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm

### 1. Run Backend Service
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### 2. Run Frontend Mobile App
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000 (proxying /api to 5000)
```

### 3. Build for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

---

## 🌐 API Endpoints Summary

- `GET /api/health` — System status & version
- `GET /api/products` — Retrieve all artisan products (with `status` filter)
- `POST /api/products` — Add a new product to catalog
- `PUT /api/products/:id` — Update product details, price, and stock
- `DELETE /api/products/:id` — Delete product
- `POST /api/products/:id/duplicate` — Duplicate product draft
- `GET /api/orders` — Retrieve all customer orders (with status filter)
- `PUT /api/orders/:id/status` — Advance order step (Received → Packed → Shipped → Delivered)
- `POST /api/ai/enhance-image` — AI studio lighting and background removal pipeline
- `POST /api/ai/voice-catalog` — Multilingual voice-to-catalog NLP attribute extractor
- `POST /api/ai/pricing` — Dynamic pricing calculator with fair wages & market demand
- `POST /api/ai/assistant-command` — Natural language voice command router
- `GET /api/ai/suggestions` — Smart proactive business suggestions
- `GET /api/buyers` — B2B wholesale buyer requirements & RFQs
- `POST /api/buyers/:id/send-quotation` — Submit tailored wholesale quotation
- `GET /api/buyers/export/ondc` — Export catalog in ONDC v1.2.0 schema
- `GET /api/buyers/export/gem` — Export catalog in GeM MSME Artisan registry format
