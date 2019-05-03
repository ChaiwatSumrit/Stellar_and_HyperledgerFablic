var StellarSdk = require('stellar-sdk');

var StellarServer = new StellarSdk.Server('http://127.0.0.1:8001', {allowHttp: true});
StellarSdk.Network.use(new StellarSdk.Network('Private Network ; February 2017'))



const destination = StellarSdk.Keypair.fromPublicKey("SAI7VONFAM4FLJD5Y3LBHQFNRDA7QME4EUXSOBNRBS25EAXCJAS5J2ZS")
// const destination = StellarSdk.Keypair.fromPublicKey("GBGJSBPBSS6L66KIXKFEK3ZJR7JVS7UZL3HCNZTSTSESUQYWQNOS5BRZ")
async function check (){

    // the JS SDK uses promises for most actions, such as retrieving an account
  const account = await StellarServer.loadAccount(destination.publicKey()); 
  console.log("Balances for account: " + destination.publicKey());
  
  account.balances.forEach(function(balance) {
    console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
  });
  }
  check ()