import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_building_purposes_only';

export const stripe = new Stripe(apiKey, {
  apiVersion: '2025-02-24.acacia',
  appInfo: {
    name: 'PriveChauffeur',
    version: '0.1.0',
  },
});
