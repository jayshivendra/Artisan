import { Product, db } from '../db/database.js';

export interface OndcCatalogPayload {
  context: {
    domain: string;
    country: string;
    city: string;
    action: string;
    core_version: string;
    bpp_id: string;
    bpp_uri: string;
  };
  message: {
    catalog: {
      bpp_descriptor: {
        name: string;
        symbol: string;
        short_desc: string;
        long_desc: string;
      };
      bpp_providers: Array<{
        id: string;
        descriptor: {
          name: string;
          symbol: string;
          short_desc: string;
        };
        categories: Array<{ id: string; descriptor: { name: string } }>;
        items: Array<{
          id: string;
          descriptor: {
            name: string;
            symbol: string;
            short_desc: string;
            images: string[];
          };
          price: {
            currency: string;
            value: string;
          };
          category_id: string;
          tags: Array<{ code: string; list: Array<{ code: string; value: string }> }>;
        }>;
      }>;
    };
  };
}

export class GovernmentMarketplaceService {
  public static exportToOndcFormat(): OndcCatalogPayload {
    const user = db.users[0] || { business_name: 'Lakshmi Handlooms', location: 'Telangana' };
    const products = db.products.filter(p => p.channels.ondc);

    return {
      context: {
        domain: 'nic2004:52110',
        country: 'IND',
        city: 'std:040',
        action: 'on_search',
        core_version: '1.2.0',
        bpp_id: 'karigar.ondc.network.in',
        bpp_uri: 'https://api.karigar.in/ondc/v1'
      },
      message: {
        catalog: {
          bpp_descriptor: {
            name: user.business_name,
            symbol: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
            short_desc: 'Authentic Rural Artisan & Handloom Collective',
            long_desc: 'Direct-from-weaver verified GI handicraft and textile listings'
          },
          bpp_providers: [
            {
              id: user.id || 'artisan_01',
              descriptor: {
                name: user.business_name,
                symbol: '',
                short_desc: user.location
              },
              categories: [
                { id: 'cat_handloom', descriptor: { name: 'Handloom & Textiles' } },
                { id: 'cat_handicraft', descriptor: { name: 'Handicrafts & Decor' } }
              ],
              items: products.map(p => ({
                id: p.id,
                descriptor: {
                  name: p.name,
                  symbol: p.images[0] || '',
                  short_desc: p.description.slice(0, 150),
                  images: p.images
                },
                price: {
                  currency: 'INR',
                  value: p.selling_price.toString()
                },
                category_id: p.category.includes('Handloom') ? 'cat_handloom' : 'cat_handicraft',
                tags: [
                  {
                    code: 'origin',
                    list: [
                      { code: 'country', value: 'IND' },
                      { code: 'state', value: user.location }
                    ]
                  },
                  {
                    code: 'artisan_meta',
                    list: [
                      { code: 'handmade', value: 'true' },
                      { code: 'material', value: p.material },
                      { code: 'making_days', value: p.making_time_days.toString() }
                    ]
                  }
                ]
              }))
            }
          ]
        }
      }
    };
  }

  public static exportToGeMFormat() {
    const products = db.products.filter(p => p.channels.govt_marketplace);
    return {
      gem_portal_version: '3.0',
      artisan_seller_id: 'GEM-ARTISAN-IN-99481',
      seller_type: 'Micro-Enterprise / Rural Artisan / SC-ST / Women Entrepreneur',
      products: products.map(p => ({
        gem_item_code: `GEM-${p.id.toUpperCase()}`,
        product_title: p.name,
        category: p.category,
        hsn_code: p.category.includes('Handloom') ? '5208' : '6912',
        unit_price_inr: p.selling_price,
        minimum_order_qty: 1,
        delivery_period_days: p.making_time_days + 3,
        gi_certified: true,
        msme_registered: true
      }))
    };
  }
}
