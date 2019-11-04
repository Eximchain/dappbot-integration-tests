# DappBot Integration Tests

How to verify that a deployed DappBot API is behaving properly:

**Installation**

```console
# Get the code
foo@bar:~$ git clone https://github.com/Eximchain/dappbot-integration-tests.git
foo@bar:~$ cd dappbot-integration-tests
```

**Setup**

Testing currently requires a valid account, we can't test the full signup loop without an inbox integration.  Before continuing, create a `test-config.json` file here with a valid `username` and `password`, as shown below.

```json
{
  "username": "john+foo@eximchain.com",
  "password": "password",
  "apiUrl": "https://api-staging.dapp.bot",
}
```
- *You can also specify an `apiUrl`, the tests will default to staging (URL shown above).*
- *If the file does not specify `username` & `password`, all tests of private API endpoints will just fail.*

**Performing Test**

Just run the command below.  The `ts-jest` library manages all the compilation here, so we don't even need to build the code.

```console
# Shorthand for npm run test
npm t
```

Successful output looks like:

![](https://user-images.githubusercontent.com/3820981/68163281-308f8e80-ff28-11e9-8d23-07c6c1422eb3.png)