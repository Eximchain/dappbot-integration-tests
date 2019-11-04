# DappBot Integration Tests

How to verify that a deployed DappBot API is behaving properly:

```console
# Get the code
foo@bar:~$ git clone https://github.com/Eximchain/dappbot-integration-tests.git
foo@bar:~$ cd dappbot-integration-tests

# Install all dependencies, compile all files
foo@bar:~/dappbot-integration-tests$ npm i
foo@bar:~/dappbot-integration-tests$ npm run build

# One-time: Configure the API URL & your test credentials
foo@bar:~/dappbot-integration-tests$ npm run setup

# Run to perform an integration test
foo@bar:~/dappbot-integration-tests$ npm run test
```