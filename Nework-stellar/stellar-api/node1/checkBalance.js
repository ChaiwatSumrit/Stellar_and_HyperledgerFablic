var StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');

var stellarServer = new StellarSdk.Server('http://127.0.0.1:8000', {allowHttp: true});
StellarSdk.Network.use(new StellarSdk.Network('Standalone Network ; February 2017'))
//const destination = StellarSdk.Keypair.fromPublicKey("GCKKYVBAEKGYMUK4PPL6UZJDMACXMK2TY5NONZV7324VEETXUNYN4Y32")
const destination = StellarSdk.Keypair.fromPublicKey("GCXN7M23H3MS7D3FTAXH7OOJABUMLZNYF6334IOSQUURENP3XP7OEKQO")
async function check (){

    // the JS SDK uses promises for most actions, such as retrieving an account
  const account = await stellarServer.loadAccount(destination.publicKey());
  console.log("Balances for account: " + destination.publicKey());
  
  account.balances.forEach(function(balance) {
    console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
  });
  }
  check ()
