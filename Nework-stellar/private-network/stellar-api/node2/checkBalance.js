var StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');

var stellarServer = new StellarSdk.Server('http://127.0.0.1:8001', {allowHttp: true});
StellarSdk.Network.use(new StellarSdk.Network('Standalone Network ; February 2017'))
const destination = StellarSdk.Keypair.fromPublicKey("GBXXWAXOSTJSNRCKU3A7WEHIRAQDP3PN3QNL6SKMYR7JKNLNRLFCVIRR")
async function check (){

    // the JS SDK uses promises for most actions, such as retrieving an account
  const account = await stellarServer.loadAccount(destination.publicKey());
  console.log("Balances for account: " + destination.publicKey());
  
  account.balances.forEach(function(balance) {
    console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
  });
  }
  check ()
