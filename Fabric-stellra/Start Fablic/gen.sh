#!/bin/bash

# clean the keystore
rm -rf /home/best/GO-PATH/src/Fabric-stellra/Start\ Fablic/javascript/Org1/wallet
rm -rf /home/best/GO-PATH/src/Fabric-stellra/Start\ Fablic/javascript/Org2/wallet


#enrollAdmin
cat <<EOF
=========================================
Enroll Admin 
=========================================
EOF
node /home/best/GO-PATH/src/Fabric-stellra/Start\ Fablic/javascript/Org1/enrollAdmin.js
node /home/best/GO-PATH/src/Fabric-stellra/Start\ Fablic/javascript/Org2/enrollAdmin.js

#registerUser
cat <<EOF
=========================================
Register User
=========================================
EOF
node /home/best/GO-PATH/src/Fabric-stellra/Start\ Fablic/javascript/Org1/registerUser.js
node /home/best/GO-PATH/src/Fabric-stellra/Start\ Fablic/javascript/Org2/registerUser.js

#copy keystore
cat <<EOF
=========================================
copy keystore
=========================================
EOF

rm -rf /home/best/GO-PATH/src/Stellar/API-stellar/blockchain/deployLocal/keyValStore
mkdir /home/best/GO-PATH/src/Stellar/API-stellar/blockchain/deployLocal/keyValStore
cp -R /home/best/GO-PATH/src/Fabric-stellra/Start\ Fablic/javascript/Org1/wallet/user1 /home/best/GO-PATH/src/Stellar/API-stellar/blockchain/deployLocal/keyValStore
cp -R /home/best/GO-PATH/src/Fabric-stellra/Start\ Fablic/javascript/Org2/wallet/user2 /home/best/GO-PATH/src/Stellar/API-stellar/blockchain/deployLocal/keyValStore

