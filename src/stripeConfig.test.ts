import Stripe from 'stripe';
import { StripePlans, freeTierStripePlan } from '@eximchain/dappbot-types/spec/methods/payment';
import { testConfig } from './common';

describe('Stripe Config Validation', function(){
  const conf = testConfig();
  if (!conf.stripeApiKey) {
    test.only('Only run Stripe tests when an API key is in the config', () => {
      console.log("Config file has no value in 'stripeApiKey', ignoring the Stripe config test suite.");
    });
    return;
  }
  const stripeAPI = new Stripe(conf.stripeApiKey, { typescript: true, apiVersion: '2019-12-03' });

  test(`Pricing Plans (${Object.keys(freeTierStripePlan())}) Exist`, async function(){
    const planIds = Object.keys(freeTierStripePlan()) as (keyof StripePlans)[];
    for (var planId of planIds) {
      const plan = await stripeAPI.plans.retrieve(planId);
      expect(plan.id).toBe(planId);
    }
  });
});