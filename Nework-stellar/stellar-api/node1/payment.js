var StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');
// New Keypair1 GBAQMWAPYVZUFCMSBRC52CQZSKCGODP27TGLP52VAWBX573IDKZFWFAX SD4BJJL6QBUYGZX7GTC5NHRAVTDTBRHLB64SAABXJYU7ALECH7KWJIQL
//New Keypair2 GDI2SGWTNTMI3IHLKE45XJM53SUXU4WE5RLTHZUVO44URGSST5FFW5B6 SD2OJYVEHJPQNAIJWPMPFNAFEWDT74KW5WDURLMA6BGHFPFQQND72TTN

var stellarServer = new StellarSdk.Server('http://127.0.0.1:8000', {allowHttp: true});
StellarSdk.Network.use(new StellarSdk.Network('Standalone Network ; February 2017'))

var source=StellarSdk.Keypair.fromSecret("SADB6WE7ATIBTVJQSFH5RE47X46P32J6LM7BV5ZIKWWZ6XZES7C7ZXIF");

// const source = StellarSdk.Keypair.master();
const destination = StellarSdk.Keypair.fromPublicKey("GBMQ2PH4ZRKJBGZPR4MTD3D432YIMK2VSA6NB3SB5TSP2QB7SKJT2CBQ")
// var memo = Memo.test('Happy birthday!')

stellarServer.accounts()
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
        amount: "1000"  // 100.50 XLM
    }))
    // add a set options operation to the transaction
    // .addOperation(StellarSdk.Operation.setOptions({
    //         signer: {
    //             ed25519PublicKey: source.publicKey() ,
    //             weight: 1
    //         }
    //     }))
    // mark this transaction as valid only for the next 30 seconds
    .setTimeout(30)
    .build()
    transaction.sign(source)
    return stellarServer.submitTransaction(transaction)
    })
.then(results => {
  console.log('Transaction', results._links.transaction.href)
}).then(()=>{
  check()
})

async function check (){

// the JS SDK uses promises for most actions, such as retrieving an account
const account = await stellarServer.loadAccount(destination.publicKey());
console.log("Balances for account: " + destination.publicKey());

account.balances.forEach(function(balance) {
console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
});
}
