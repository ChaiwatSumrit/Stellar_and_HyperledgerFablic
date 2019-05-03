/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', '../basic-network-2Org2Peer', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        //# Create owner 
        //await contract.submitTransaction('init_owner', 'o58050222', 'Best', 'company', 'GCE24Q5SBUH2DC42LLR3X734TKTJOLCJ3DUHBRYIGIOBVONUCIVKGUEI');
        //# Create Marble
        //await contract.submitTransaction('init_marble', 'm02', 'red', '35', 'o58050244', 'company');
        //# Set owner for marble
        //await contract.submitTransaction('set_owner', 'm02', 'o58050222', 'company');
        //# mark min price for sale
        //await contract.submitTransaction('mark_for_sale', 'm02', 'company', '100');
        //# make_offer
        //await contract.submitTransaction('make_offer', 'm02', 'o58050222', 'company', '300', 'f0002');
        //# accept_offer
        //await contract.submitTransaction('accept_offer', 'f0002', 'company');
        //# payment_complete_against_offer
        await contract.submitTransaction('payment_complete_against_offer', '107fe138f33476cb4395c275dfa4175b815f21317e6c3cc522d25bcd37958e17', 'f0001', 'GBUYMC4K7T3XHHZCJ3J6STONB46H3VALK2JWIRDXN366XDVFRIN7UI5F', '30000', '192.168.13.132:8001');

        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
