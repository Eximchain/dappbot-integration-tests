/**
 * Verify that all key calls for signing up and initializing
 * an account are behaving correctly.  The one rub is that
 * in order to perform a first login, we must successfully
 * respond to a challenge, and the required data only lives
 * in an email.
 * 
 * In order to properly test this flow, we need to get at
 * the signup email.  We can do that with the Gmail API, but
 * we will need to authenticate into the test account, so
 * we may need to encode an API key into whatever environment
 * we end up with.
 * 
 * Until we have a resolution for this, they're being skipped.
 */

describe.skip('Register for an Account', function(){
  test.todo('Implement signup request')
});

describe.skip('First Login', function(){
  test.todo('Implement first login challenge response loop');
});