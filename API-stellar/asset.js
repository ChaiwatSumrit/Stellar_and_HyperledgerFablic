var StellarSdk = require('stellar-sdk');

var StellarServer = new StellarSdk.Server('http://127.0.0.1:8000', {allowHttp: true});
StellarSdk.Network.use(new StellarSdk.Network('Private Network ; February 2017'))


// Keys for accounts to issue and receive the new asset
// var issuingKeys = StellarSdk.Keypair
//   .fromSecret('SDBEGBLHLWLLJI25IOHEWZFW75QRZ5UBB7GJCBMHOJD3DDWCF5NFAFZP');
// var receivingKeys = StellarSdk.Keypair
//   .fromSecret('SB4ECLZ7JHEOL3XATOLWEBCTZNXTITMYHWTZ5KIANVOXTJOSKP2D237V');
var issuingKeys = StellarSdk.Keypair
  .fromSecret('SDX5XGW4NBCWGTFEBKML5RLTRY6WHJQL6NQVZCANN6OLPXBMMK4L5O62');
var receivingKeys = StellarSdk.Keypair
  .fromSecret('SCDQTBPKJUFGIEZBZHK7BR2CQYJ66ZHTTIE35DBBLWMNAO4KHINT7BWE');

// Create an object to represent the new asset
var astroDollar = new StellarSdk.Asset('AstroDollar', issuingKeys.publicKey());

// First, the receiving account must trust the asset
StellarServer.loadAccount(receivingKeys.publicKey())
  .then(function(receiver) {
    var transaction = new StellarSdk.TransactionBuilder(receiver)
      // The `changeTrust` operation creates (or alters) a trustline
      // The `limit` parameter below is optional
      
      .addOperation(StellarSdk.Operation.changeTrust({
        asset: astroDollar,
        limit: '1000'
      }))
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(receivingKeys);
    return StellarServer.submitTransaction(transaction);
  })

  // Second, the issuing account actually sends a payment using the asset
  .then(function() {
    return StellarServer.loadAccount(issuingKeys.publicKey())
  })
  .then(function(issuer) {
    var transaction = new StellarSdk.TransactionBuilder(issuer)
      .addOperation(StellarSdk.Operation.payment({
        destination: receivingKeys.publicKey(),
        asset: astroDollar,
        amount: '10'
      }))
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(issuingKeys);
    return StellarServer.submitTransaction(transaction);
  })
  .catch(function(error) {
    console.error('Error!', error);
  });