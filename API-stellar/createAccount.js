var StellarSdk = require('stellar-sdk')

var StellarServer = new StellarSdk.Server('http://127.0.0.1:8001', { allowHttp: true });
StellarSdk.Network.use(new StellarSdk.Network('Private Network ; February 2017'))



const source = StellarSdk.Keypair.master()
//Gen key account
const Account = StellarSdk.Keypair.random()

//Creating an account

StellarServer.accounts()
  .accountId(source.publicKey())
  .call()
  .then(({ sequence }) => {
    const account = new StellarSdk.Account(source.publicKey(), sequence)
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE
    })
      .addOperation(StellarSdk.Operation.createAccount({
        destination: Account.publicKey(),
        startingBalance: '1000000' //1 M
      })).setTimeout(1000)
      .build()
    transaction.sign(StellarSdk.Keypair.fromSecret(source.secret()))
    return StellarServer.submitTransaction(transaction)
  })
  .then(results => {
    console.log('Account:')
    console.log('Transaction', results._links.transaction.href)
    console.log('New Keypair', Account.publicKey(), Account.secret())
    return
  })
  .then(async results => {

    // the JS SDK uses promises for most actions, such as retrieving an account
    const account = await StellarServer.loadAccount(Account.publicKey());
    console.log("Balances for account: " + Account.publicKey());

    account.balances.forEach(function (balance) {
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    });
    return

  })
  

