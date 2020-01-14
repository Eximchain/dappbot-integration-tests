import DappbotAPI from '@eximchain/dappbot-api-client';
import { getConfiguredAPI } from './common';

let API:DappbotAPI = getConfiguredAPI();

describe('Health Check', function(){
  test('Verify that API URL is returning a valid response shape', async () => {
    try {
      const response = await API.public.viewDapp.call('NotADapp');
      expect(response).toBeDappbotResponse();
    } catch (err) {
      expect(err.response.toJSON().body).toBeDappbotResponse();
    }
  })
})