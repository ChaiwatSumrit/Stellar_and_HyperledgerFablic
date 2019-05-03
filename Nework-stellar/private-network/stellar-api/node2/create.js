var StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');

var stellarServer = new StellarSdk.Server('http://127.0.0.1:8001', {allowHttp: true});
StellarSdk.Network.use(new StellarSdk.Network('Private Network ; February 2017'))
const source = StellarSdk.Keypair.master();
const destination = StellarSdk.Keypair.random()

console.log(source.secret());
// SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7
console.log(source.publicKey());

stellarServer.accounts()
  .accountId(source.publicKey())
  .call()
  .then(({ sequence }) => {
    const account = new StellarSdk.Account(source.publicKey(), sequence)
    console.log(account);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE
    })
      .addOperation(StellarSdk.Operation.createAccount({
        destination: destination.publicKey(),
        startingBalance: '25'
      })).setTimeout(1000)
      .build()
    transaction.sign(StellarSdk.Keypair.fromSecret(source.secret()))
    return stellarServer.submitTransaction(transaction)
  })
  .then(results => {
    console.log('Transaction', results._links.transaction.href)
    console.log('New Keypair', destination.publicKey(), destination.secret())
  }).then(()=>{
    check()
  })

// GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB
// bot().then(()=>{
//   check()
// })
 

async function bot (){
 try {
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
  );
  const responseJSON = await response.json();
  console.log("SUCCESS! You have a new account :)\n", responseJSON);
} catch (e) {
  console.error("ERROR!", e);
}
}
async function check (){

  // the JS SDK uses promises for most actions, such as retrieving an account
const account = await stellarServer.loadAccount(destination.publicKey());
console.log("Balances for account: " + destination.publicKey());

account.balances.forEach(function(balance) {
  console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
});
}
