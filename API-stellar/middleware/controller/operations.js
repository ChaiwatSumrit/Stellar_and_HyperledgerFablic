const StellarSdk = require('stellar-sdk')

var StellarServer = new StellarSdk.Server('http://127.0.0.1:8000', { allowHttp: true });
StellarSdk.Network.use(new StellarSdk.Network('Private Network ; February 2017'))

// const logger = require('../../util/logger')
/**
 * {Operations Stellar}
 * @class
 */
class Stellar {

    createAccount(request) {
        return new Promise(async (resolve, reject) => {
            var startingBalance = request.startingBalance
            const source = StellarSdk.Keypair.master()
            console.log(`Get keypair for master`);

            //Gen key account
            const Account = StellarSdk.Keypair.random()
            console.log(`Generate keypair for account`);

            //Creating an account
            StellarServer.accounts()
                .accountId(source.publicKey())
                .call()
                .then(({ sequence }) => {
                    console.log(`master key : ${source.publicKey()} `);
                    const account = new StellarSdk.Account(source.publicKey(), sequence)
                    console.log(`Transaction Builder`);
                    const transaction = new StellarSdk.TransactionBuilder(account, {
                        fee: StellarSdk.BASE_FEE
                    })
                        .addOperation(StellarSdk.Operation.createAccount({
                            destination: Account.publicKey(),
                            startingBalance: startingBalance //1 M
                        })).setTimeout(30)
                        .build()
                    transaction.sign(StellarSdk.Keypair.fromSecret(source.secret()))
                    return StellarServer.submitTransaction(transaction)
                })
                .then(results => {
                    resolve({
                        message: {
                            PublicKey: Account.publicKey(),
                            SecretKey: Account.secret(),
                            StartingBalance: startingBalance,
                            Transaction: results._links.transaction.href,
                        }
                    });

                })

        });
    }

    checkBalances(request) {
        return new Promise(async (resolve, reject) => {

            const destination = StellarSdk.Keypair.fromPublicKey(request.destination)
            // the JS SDK uses promises for most actions, such as retrieving an account
            const account = await StellarServer.loadAccount(destination.publicKey());
            console.log("Balances for account: " + destination.publicKey());

            account.balances.forEach(function (balance) {
                // console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
                resolve({
                    message: {
                        Type: balance.asset_type,
                        Balance: balance.balance,

                    }
                });
            });
        })
    }

    createPayment(request) {
        return new Promise(async (resolve, reject) => {

            var source = StellarSdk.Keypair.fromSecret(request.buyer);

            // const source = StellarSdk.Keypair.master();
            const destination = StellarSdk.Keypair.fromPublicKey(request.seller)
            var amount = request.amount
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
                            amount: amount  // 100.50 XLM,

                        }))
                        // add a set options operation to the transaction
                        // .addOperation(StellarSdk.Operation.setOptions({
                        //         signer: {
                        //             ed25519PublicKey: source.publicKey() ,
                        //             weight: 1
                        //         }
                        //     }))
                        // mark this transaction as valid only for the next 30 seconds
                        .addMemo(StellarSdk.Memo.text(request.offer_id.toUpperCase())) //offer_id
                        .setTimeout(30)
                        .build()
                    transaction.sign(source)
                    return StellarServer.submitTransaction(transaction)
                })
                .then(async results => {
                    console.log('Transaction', results._links.transaction.href)
                    var sourceB = await check(source)
                    console.log('sourceB', sourceB)

                    var destinationB = await check(destination)

                    resolve({
                        message: {
                            Status: "success",
                            Buyer: request.buyer,
                            Buyer_balance: sourceB.balance,
                            Seller: request.seller,
                            Seller_balance: destinationB.balance,
                            Transaction: results._links.transaction.href,
                            Memo : request.offer_id,
                            Transfer: request.amount ,
                            Fee: StellarSdk.BASE_FEE
                        }
                    });
                })
        })
        //.then(()=>{
        //     // check(source)
        //     // check(destination)
        // })

        async function check(key) {

            // the JS SDK uses promises for most actions, such as retrieving an account
            const account = await StellarServer.loadAccount(key.publicKey());
            console.log("Balances for account: " + key.publicKey());
            // console.log("Balances : " +  account.balances.balance[0].balance );
            // console.log("Balances : " +  JSON.stringify(account.balances));

            // return account.balances.balance
            var check_balance
            account.balances.forEach(function (balance) {
                console.log("Balances : " + balance.balance)
                check_balance = balance
                return balance
                
            });
            console.log("Balanceaas : " )
            return check_balance


        }

    }


}
module.exports = Stellar;