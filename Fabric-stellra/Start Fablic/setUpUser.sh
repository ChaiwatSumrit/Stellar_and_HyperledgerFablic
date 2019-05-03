#!/bin/bash

#user1
cat <<EOF
=========================================
Register User1 for Org 1
=========================================
EOF

cd user1

# clean the keystore 
rm -rf ./hfc-key-store

#enrollAdmin and registerUser
node enrollAdmin.js
node registerUser.js

cd ..

#user2
cat <<EOF
=========================================
Register User2 for Org 2
=========================================
EOF

cd user2

# clean the keystore
rm -rf ./hfc-key-store

#enrollAdmin and registerUser
node enrollAdmin.js
node registerUser.js

# clean the keystore for API


rm -rf /home/best/GO-PATH/src/stellar_hyperledgerfablic/API-stellar/blockchain/deployLocal/keyValStore/key_org1

rm -rf /home/best/GO-PATH/src/stellar_hyperledgerfablic/API-stellar/blockchain/deployLocal/keyValStore/key_org2

# Copy the keystore to API
cat <<EOF
=========================================
Copy the keystore to API
=========================================
EOF
mkdir /home/best/GO-PATH/src/stellar_hyperledgerfablic/API-stellar/blockchain/deployLocal/keyValStore/key_org1
mkdir /home/best/GO-PATH/src/stellar_hyperledgerfablic/API-stellar/blockchain/deployLocal/keyValStore/key_org2

cd /home/best/GO-PATH/src/Fabric-stellra/Start\ Fablic/user1/hfc-key-store
cp * /home/best/GO-PATH/src/stellar_hyperledgerfablic/API-stellar/blockchain/deployLocal/keyValStore/key_org1

cd /home/best/GO-PATH/src/Fabric-stellra/Start\ Fablic/user2/hfc-key-store 
cp * /home/best/GO-PATH/src/stellar_hyperledgerfablic/API-stellar/blockchain/deployLocal/keyValStore/key_org2

cat <<EOF
=========================================
basic Network on ready
=========================================
EOF
