'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode Invoke
 */

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('mychannel'); //edit channel
var peer = fabric_client.newPeer('grpc://localhost:7051'); //edit Peer
channel.addPeer(peer);
// var peer2 = fabric_client.newPeer('grpc://localhost:8051');
// channel.addPeer(peer2);
var order = fabric_client.newOrderer('grpc://localhost:7050')
channel.addOrderer(order);

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;
var fullmoney =0;
// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
  invoke()

function invoke()
{
  Fabric_Client.newDefaultKeyValueStore({ path: store_path
  }).then((state_store) => {
    // assign the store to the fabric client
    fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();
    // use the same location for the state store (where the users' certificate are kept)
    // and the crypto store (where the users' keys are kept)
    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
  
    // get the enrolled user from persistence, this user will sign all requests
    return fabric_client.getUserContext('user1', true);
  }).then((user_from_store) => {
    if (user_from_store && user_from_store.isEnrolled()) {
     // console.log('Successfully loaded user1 from persistence');
      member_user = user_from_store;
    } else {
      throw new Error('Failed to get user1.... run registerUser.js');
    }
  
    // get a transaction id object based on the current user assigned to fabric client
    let tx_object = fabric_client.newTransactionID();
  
  // get the transaction ID string for later use
  const transient_data = {
    'marblename': Buffer.from('marble1'), // string <-> byte[]
    'color': Buffer.from('red'), // string <-> byte[]
    'owner': Buffer.from('Arthur Morgan'), // string <-> byte[]
    'size': Buffer.from('95'), // string <-> byte[]
    'price': Buffer.from('99'), // string <-> byte[]
  };
  const request = {
    chaincodeId : "fabcar",
    txId: tx_object,
    fcn: 'initMarble',
    args: ["Marble1","Blue","35","BEST"], // all data is transient data
    tranientMap: transient_data // private data
  };
  
  return channel.sendTransactionProposal(request);
  }).then((results) => {
  // a real application would check the proposal results
  //console.log('Successfully endorsed proposal to invoke chaincode');
  console.log(results);
  // start block may be null if there is no need to resume or replay
  // console.log("Marble1 has been create")
  let send_trans = channel.sendTransaction({proposalResponses: results[0], proposal: results[1]});
  
  return 1
  }).then((results) => {
  
    console.log("Marble1 has been create")
  }).catch((err) => {
    console.error('Failed to invoke successfully :: ' + err);
  });   
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//console.log(getRandomInt(11));
// expected output: 0, 1 or 2

