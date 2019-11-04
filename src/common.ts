import fs from 'fs';
import path from 'path';
import User, { isAuthData } from '@eximchain/dappbot-types/spec/user';
import DappbotAPI from '@eximchain/dappbot-api-client';
import Responses from '@eximchain/dappbot-types/spec/responses';
import { Auth } from '@eximchain/dappbot-types/spec/methods';
import Dapp from '@eximchain/dappbot-types/spec/dapp';
import casual from 'casual';
import { CreateDapp } from '@eximchain/dappbot-types/spec/methods/private';
export const TEST_API = 'https://api-staging.dapp.bot';


export function sleep(ms:number) {
  return new Promise((res) => setTimeout(res, ms));
}

export function testCreds(){
  const credsPath = path.resolve(process.cwd(), './test-creds.json');
  if (fs.existsSync(credsPath)) {
    return JSON.parse(fs.readFileSync(credsPath).toString())
  } else {
    throw new Error(`Please create a file with a valid "username" and "password" at ${credsPath}`);
  }
}

export function getConfiguredAPI(existingAuth?:User.AuthData) {
  return new DappbotAPI({
    authData: existingAuth || User.newAuthData(),
    setAuthData: setAuthFileData,
    dappbotUrl: TEST_API
  })
}

const authDataPath = path.resolve(process.cwd(), './dappbotAuthData.json');
export function getAuthFileData() {
  if (fs.existsSync(authDataPath)) {
    return JSON.parse(fs.readFileSync(authDataPath).toString())
  } else {
    const authData = User.newAuthData();
    setAuthFileData(authData);
    return authData;
  }
}

export function setAuthFileData(newData:User.AuthData) {
  fs.writeFileSync(authDataPath, JSON.stringify(newData, null, 2));
}

export const ethAddress = '0x000000000000000000000000000000000000002A';
export const SmallABI = `[{"constant": true,"inputs": [],"name": "storedData","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "x","type": "uint256"}],"name": "set","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "get","outputs": [{"name": "retVal","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"inputs": [{"name": "initVal","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"}]`

function prettyPrint(anything:any) { return JSON.stringify(anything, null, 2) }

/**
 * Below is a set of custom assertions based on our underlying
 * data types.  Their response shape is dictated by jest's
 * expect function, you can find docs about .extend() here:
 * 
 * https://jestjs.io/docs/en/expect#expectextendmatchers
 * 
 */
expect.extend({
  toBeDappbotResponse(received) {
    const pass = Responses.isErrResponse(received) || Responses.isSuccessResponse(received) || false;
    const message = () => pass ?
      `Did not expect to get a response following DappBot's shape, but we did: ${prettyPrint(received)}` :
      `Expected to get a DappBot response, but instead got: ${prettyPrint(received)}`
      return { pass, message }
  },

  toBeSuccessResponse(received) {
    const pass = Responses.isSuccessResponse(received);
    const message = () => pass ?
      `Did not expect a successResponse, but got one.` :
      `Expected a successResponse, but it was not, instead including: ${prettyPrint(received.err)} on its err field`;
    return { pass, message }
  },

  toBeErrResponse(received) {
    const pass = Responses.isErrResponse(received);
    const message = () => pass ?
      `Did not expect an errResponse, but we got this one: ${prettyPrint(received)}` :
      `Expected an errResponse, but instead we got ${prettyPrint(received)}`
    return { pass, message }
  },

  toBeMessageResult(received) {
    const pass = Responses.isMessageResult(received);
    const message = () => pass ?
      `Did not expect to get a message result, but we did and here it is: ${prettyPrint(received)}` :
      `Expected to get a message result but we didn't, instead receiving: ${prettyPrint(received)}`
    return { pass, message };
  },

  toBeAuthData(received) {
    const pass = User.isAuthData(received);
    const message = () => pass ? 
      `Did not expect to get authData, but we did.` :
      `Expected to get authData, but instead got the following object: ${prettyPrint(received)}`;
    return { pass, message }
  },

  toBeChallengeData(received) {
    if (User.Challenges.isData(received)) {
      return {
        pass: true,
        message: () => `Received an unexpected challenge of type "${received.ChallengeName}"`
      }
    } else {
      return {
        pass: false,
        message : () => `Expected to get ChallengeData, but instead received: ${prettyPrint(received)}`
      }
    }
  },

  toBeItemApi(received) {
    const pass = Dapp.Item.isApi(received);
    const message = () => pass ?
      `Did not expect to get an Item.Api, but we did!` :
      `Expected to get an Item.Api, instead received object w/ following keys: ${Object.keys(received || {})}`
    return { pass, message }
  },

  toBeItemCore(received) {
    const pass = Dapp.Item.isCore(received);
    const message = () => pass ?
      `Did not expect to get an Item.Core, but we did!` :
      `Expected to get an Item.Core, instead received object w/ following keys: ${Object.keys(received || {})}`
    return { pass, message }
  }
})

/**
 * Types for above
 */
declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeDappbotResponse(): R;
      toBeSuccessResponse(): R;
      toBeErrResponse(): R;
      toBeMessageResult(): R;
      toBeAuthData(): R;
      toBeChallengeData(): R;
      toBeItemApi(): R;
      toBeItemCore(): R;
    }
  }
}

/**
 * Casual is a dummy data generator with a bunch of built-in
 * generators, as well as the ability to define your own.
 */
export function DummyDappName(){
  return Dapp.cleanName(casual.words(3).split(' ').join('-'));
}

export function DummyCreateDappArg(){
  const arg:CreateDapp.Args = {
    Tier: Dapp.Tiers.Standard,
    GuardianURL: casual.url,
    Web3URL: Dapp.Chain.Ropsten().web3Url,
    Abi: SmallABI,
    ContractAddr: ethAddress
  }
  return arg;
}