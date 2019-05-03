var StellarSdk = require('stellar-sdk');
var StellarServer = new StellarSdk.Server('http://127.0.0.1:8001', {allowHttp: true});
StellarSdk.Network.use(new StellarSdk.Network('Private Network ; February 2017'))

// ##Account 1 : A
// Transaction http://127.0.0.1:8000/transactions/38a9cbeb41974f4baa5d6f0bed5b088c6c7b2e1f18feac5460b19e30039ce237
// #New Keypair 1M
// New Keypair GABGBU52KKGZ33BSLVKIQFESZNYUENFZ474Z46O4R3JNHUNWXZFJ5RPC SD7JAKHOJ6YNRY7BI6Q7PXZ2BZ6XNXMZUBOJHP22V5OSIGZYBXKAKGXB

// ##Account 2 : B
// Transaction http://127.0.0.1:8001/transactions/38a9cbeb41974f4baa5d6f0bed5b088c6c7b2e1f18feac5460b19e30039ce237
// #New Keypair 2
// New Keypair GCTIF4ZVZAFO7W3U7W5FALMSBP4DE7AN43MWE2PREYEKMRKRRXBB24RJ SDRQCGKJ5BPT22ZYVJCICF2OSYNG5EUCPQ26P55VOWQF543WRRAIX7J3

var source=StellarSdk.Keypair.fromSecret("SD7JAKHOJ6YNRY7BI6Q7PXZ2BZ6XNXMZUBOJHP22V5OSIGZYBXKAKGXB");

// const source = StellarSdk.Keypair.master();
const destination = StellarSdk.Keypair.fromPublicKey("GCTIF4ZVZAFO7W3U7W5FALMSBP4DE7AN43MWE2PREYEKMRKRRXBB24RJ")

StellarServer.accounts()
.accountId(source.publicKey())
.call()
.then(({ sequence }) => {
  const account = new StellarSdk.Account(source.publicKey(), sequence)
  console.log(account);
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE
    
  })
    .addOperation(StellarSdk.Operation.payment({
        destination: destination.publicKey(),
        asset: StellarSdk.Asset.native(),
        amount: "3000"  // 100.50 XLM,
        
    }))
    // add a set options operation to the transaction
    // .addOperation(StellarSdk.Operation.setOptions({
    //         signer: {
    //             ed25519PublicKey: source.publicKey() ,
    //             weight: 1
    //         }
    //     }))
    // mark this transaction as valid only for the next 30 seconds
    .addMemo(StellarSdk.Memo.text('marble1')) //offer_id / marble_id
    .setTimeout(30)
    .build()
    transaction.sign(source)
    return StellarServer.submitTransaction(transaction)
    })
.then(results => {
  console.log('Transaction', results._links.transaction.href)
}).then(()=>{
  check()
})

async function check (){

// the JS SDK uses promises for most actions, such as retrieving an account
const account = await StellarServer.loadAccount(destination.publicKey());
console.log("Balances for account: " + destination.publicKey());

account.balances.forEach(function(balance) {
console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
});
}
