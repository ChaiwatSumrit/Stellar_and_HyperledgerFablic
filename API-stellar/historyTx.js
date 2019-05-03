var StellarSdk = require('stellar-sdk');
var StellarServer = new StellarSdk.Server('http://127.0.0.1:8000', {allowHttp: true});
StellarSdk.Network.use(new StellarSdk.Network('Private Network ; February 2017'))


const accountId = 'GBGJSBPBSS6L66KIXKFEK3ZJR7JVS7UZL3HCNZTSTSESUQYWQNOS5BRZ';

//Loading an account’s transaction history

StellarServer.transactions()
    .forAccount(accountId)
    .call()
    .then(function (page) {
        console.log('Page 1: ');
        console.log(page.records);
        return page.next();
    })
    .then(function (page) {
        console.log('Page 2: ');
        console.log(page.records);
    })
    .catch(function (err) {
        console.log(err);
    });