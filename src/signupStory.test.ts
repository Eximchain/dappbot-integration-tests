import prompt from 'prompts';
import casual from 'casual';
import DappbotAPI from '@eximchain/dappbot-api-client';
import User, { Challenges } from '@eximchain/dappbot-types/spec/user';
import { freeTierStripePlan } from '@eximchain/dappbot-types/spec/methods/payment';
import Responses from '@eximchain/dappbot-types/spec/responses';
import { getConfiguredAPI, testConfig } from './common';

let username:string, password: string;
let API:DappbotAPI;

beforeAll(() => {
  API = getConfiguredAPI();
  const conf = testConfig();
  username = conf.username;
  const [address, domain] = username.split('@');
  const randomTag = casual.uuid.slice(0, 8);
  username = `${address}+${randomTag}@${domain}`;
})

describe('Register Account User Story', function(){
  test('CreateUser: Use provided email address to create new account', async function(){
    const signupRes = await API.payment.signUp.call({
      email: username,
      name: `${casual.full_name} (Test User)`,
      plans: freeTierStripePlan()
    })
    expect(signupRes.err).toBeNull();
    if (!signupRes.data || !signupRes.data.user) {
      // Throw a proper error here so that TS understands everything
      // after this definitely have the data object defined. Similar
      // errors are thrown as necessary in the tests below.
      console.log('Failed signup response: ',signupRes);
      throw new Error("Signup response did not have data, failing test.")
    }
    expect(typeof signupRes.data.stripeId).toBe('string')
    expect(typeof signupRes.data.subscriptionId).toBe('string');
    expect(signupRes.data.user).toBeUserData();
  });

  test('First Login: Gather temporary password from user, update password', async function(){
    const { tempPass } = await prompt({
      type: 'text',
      name: 'tempPass',
      message: `We just emailed a temporary password to ${username}.  Please enter it here:`
    });
    const loginRes = await API.auth.login.call({
      username, password: tempPass
    });
    expect(loginRes.err).toBeNull();
    expect(loginRes.data).toBeChallengeData();
    if (!Challenges.isData(loginRes.data)) {
      console.log('Failed temporary password login response: ',loginRes);
      throw new Error("First login did not get a ChallengeResponse as expected.");
    }
    expect(loginRes.data.ChallengeName).toBe(Challenges.Types.NewPasswordRequired);
    const session = loginRes.data.Session;
    const newPassword = casual.password;
    password = newPassword.slice();
    const newPassRes = await API.auth.newPassword.call({
      username, newPassword, session
    })
    expect(newPassRes.err).toBeNull();
    expect(newPassRes.data).toBeAuthData();
  }, 5 * 60 * 1000);

  test('Second Login: Verify updated password works successfully', async function(){
    const finalLoginRes = await API.auth.login.call({
      username, password
    });
    expect(finalLoginRes.err).toBeNull();
    expect(finalLoginRes.data).toBeAuthData();
  });

  // TODO: System doesn't really support deleting accounts; that would theoretically
  // be the last step in this user story.
});