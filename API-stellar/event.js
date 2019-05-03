

const StellarSdk = require('stellar-sdk')
var StellarServer = new StellarSdk.Server('http://127.0.0.1:8001', { allowHttp: true });
StellarSdk.Network.use(new StellarSdk.Network('Private Network ; February 2017'))

// Get a message any time a payment occurs. Cursor is set to "now" to be notified
// of payments happening starting from when this script runs (as opposed to from
// the beginning of time).
console.log(`SATRT STELLAR EVENT =>`);
const es = StellarServer.payments()
  .cursor('now')
  .stream({

    onmessage: function (message) {
      console.log(`Message : ${JSON.stringify(message)}`);

      console.log(`TX_TYPE : ${message.type}`);
      console.log(`COUNT : ${message.type_i}`);
      console.log(`CREATE_DATE : ${message.created_at}`);
      console.log(`ASSET_TYPE : ${message.asset_type}`);
      console.log(`FROM :   ${message.from}`);
      console.log(`TO :     ${message.to}`);
      console.log(`AMOUNT : ${message.amount}`);

      console.log(`===================================================================`);
    }
  })