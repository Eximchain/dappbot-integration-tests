# DappBot Integration Tests

How to verify that a deployed DappBot API is behaving properly:

```console
# Get the code
foo@bar:~$ git clone https://github.com/Eximchain/dappbot-integration-tests.git
foo@bar:~$ cd dappbot-integration-tests

# Install all dependencies, compile all files
foo@bar:~/dappbot-integration-tests$ npm i
foo@bar:~/dappbot-integration-tests$ npm run build

# One-time: Create a test credentials JSON file
# at ./test-config.json which contains a valid
# `apiUrl`, `username`, & `password`.  Testing
# currently requires a valid account, cannot
# perform full signup loop without inbox integration.

# Run to perform an integration test
foo@bar:~/dappbot-integration-tests$ npm run test
```

Sample `test-config.json`:

```json
{
  "apiUrl": "https://api-staging.dapp.bot",
  "username": "john+foo@eximchain.com",
  "password": "password"
}
```

- If the file does not specify an `apiUrl`, the tests will default to staging (URL shown above).
- If the file does not specify `username` & `password`, all tests of private API endpoints will just fail.