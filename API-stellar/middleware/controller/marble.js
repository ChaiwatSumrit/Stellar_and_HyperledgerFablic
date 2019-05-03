
const blockchain = require('../../blockchain/service');
const ParseAttributes = require('./parsedAttributes');

const logger = require('../../util/logger');

//Host Stellar core 
// const STELLAR_CORE_A = "192.168.13.132:8000"
// const STELLAR_CORE_B = "192.168.13.132:8001"

//Function chaincode
// const TRANSFER_MARBLE = "payment_complete_against_offer";
const CREATE_MARBLE = "initMarble";
const TRANSFER_MARBLE = "transferMarble";
const READ_MARBLE = "readMarble";

const HOST_STELLAR = process.env.HOST_STELLAR




/**
 * Marble
 * @class 
 */
class Marble {

    /**
     * Represents a Marble
     * @constructs Marble
     * @param {string} userName - Enrollment Id of the blockchain user
     */
    constructor(userName) {
        this.enrollID = userName;
    }


    createMarble(request) {
        let self = this;
        var functionName = '[CreateMarble]'

        logger.info(JSON.stringify(request.marble_id));

        return new Promise(async (resolve, reject) => {
            // Parse attributes transfer "Marble"
            try {
                logger.info(JSON.stringify(request));

                // var parsedAttrs = await ParseAttributes.createMarble(request)
                var parsedAttrs = request;

                logger.info(`[ParseAttributes] Create Marble: {\n${parsedAttrs}\n}`);

                logger.info(`[invoke] enrollID : ${self.enrollID}`);

                var invokeObject = {
                    enrollID: self.enrollID,
                    fcnname: CREATE_MARBLE,
                    attrs: [
                        parsedAttrs.marble_id.toString().toUpperCase(),
                        parsedAttrs.color.toString().toUpperCase(),
                        parsedAttrs.size.toString(),
                        parsedAttrs.owner.toString().toUpperCase(),
                    ]
                };

            } catch (error) {
                let errorMessage = `${functionName} Failed to Create Marble : ${error}`
                // logger.error(errorMessage);
                reject({
                    error: {
                        message: errorMessage,
                        status: 400,
                    }
                });
                return;
            };

            // Invoke blockchain transfer "Marble"
            try {
                var result = await blockchain.invoke(invokeObject.enrollID, invokeObject.fcnname, invokeObject.attrs, TRANSFER_MARBLE)

                logger.debug(`Create Marble => Success`);
                resolve({
                    message: {
                        marble_id: invokeObject.attrs[0],
                        color: invokeObject.attrs[1],
                        size: invokeObject.attrs[2],
                        owner: invokeObject.attrs[3],
                    }
                });
            } catch (error) {
                let errorMessage = `${functionName} Blockchain service Invoke Create Marble Failed  : ${error}`
                // logger.error(errorMessage);
                reject({
                    error: {
                        message: errorMessage,
                        status: 400,
                    }
                });
                return;
            };
        });
    }

    /**
     * Save Marble document to local database
     * @method post
     * @description - Save Marble document to local database
     * @param {object}req - tx_id,hospital_ID,receipt_No,doc ...   //'107fe138f33476cb4395c275dfa4175b815f21317e6c3cc522d25bcd37958e17', 'f0001', 'GBUYMC4K7T3XHHZCJ3J6STONB46H3VALK2JWIRDXN366XDVFRIN7UI5F', '30000', '192.168.13.132:8001'
     * @param {object}res - result
    */
    transferMarble(request) {
        let self = this;
        var functionName = '[TransferMarble]'

        return new Promise(async (resolve, reject) => {

            // Parse attributes transfer "Marble"
            try {
                // var parsedAttrs = await ParseAttributes.transferMarble(request, process.env.HOST_STELLAR)
                // logger.info(`[ParseAttributes] Transfer Marble: {\n${parsedAttrs}\n}`);
                var parsedAttrs = request;

                var invokeObject = {
                    enrollID: self.enrollID,
                    fcnname: TRANSFER_MARBLE,
                    attrs: [
                        parsedAttrs.stellar_tx_id.toString(),
                        parsedAttrs.offer_id.toString().toUpperCase(),
                        parsedAttrs.public_key_receive.toString(),
                        parsedAttrs.amount.toString(),
                        HOST_STELLAR.toString(),
                        parsedAttrs.marble_id.toString().toUpperCase(),
                        parsedAttrs.owner_name.toString().toUpperCase(),
                    ]
                };

            } catch (error) {
                let errorMessage = `${functionName} Failed to transfer Marble : ${error}`
                logger.error(errorMessage);
                reject({
                    error: {
                        message: errorMessage,
                        status: 400,
                    }
                });
                return;
            };

            // Invoke blockchain transfer "Marble"
            try {
                var result = await blockchain.invoke(invokeObject.enrollID, invokeObject.fcnname, invokeObject.attrs, TRANSFER_MARBLE)
                logger.debug(`Transfer Marble => Success`);
                // logger.debug(result.toString());


                // let Marble_infoParsed = result.result.toString().replace(/\"/gi, '"')
                // var MarbleInfoJSON = JSON.parse(Marble_infoParsed)

                resolve({
                    message: {
                        'HOST_STELLAR': HOST_STELLAR,
                        'Transfer Marble ID' :parsedAttrs.marble_id,
                        'TO': parsedAttrs.owner_name,
                    }
                    
                });
            } catch (error) {
                let errorMessage = `${functionName} Blockchain service Invoke Transfer Marble Failed  : ${error}`
                logger.error(errorMessage);
                reject({
                    error: {
                        message: errorMessage,
                        status: 400,
                    }
                });
                return;
            };
        });
    }

    /** 
  * GetMarbleByID.
  * @method
  * @description -  GetMarbleByID on blockchain by id 
  * @param {string} req - GetMarbleByID
  * @param {string} res - info for GetMarbleByID
  */
    GetMarbleByID(MarbleID) {
        var functionName = '[GetMarbleByID(MarbleID)]';
        return new Promise(async (resolve, reject) => {
            let id = MarbleID.toString().toUpperCase()
            let self = this;
            var queryObject = {
                enrollID: self.enrollID,
                fcnname: READ_MARBLE,
                attrs: [id]
            }
            try {
                var Marble_info = await blockchain.query(queryObject.enrollID, queryObject.fcnname, queryObject.attrs, READ_MARBLE)
                logger.debug(Marble_info)

                let Marble_infoParsed = Marble_info.result.toString().replace(/\"/gi, '"');
                logger.debug(Marble_infoParsed)

                var MarbleInfoJSON = JSON.parse(Marble_infoParsed)
                logger.debug(MarbleInfoJSON)
                resolve(MarbleInfoJSON)
            } catch (error) {
                let errorMessage = `${functionName} Blockchain service Query for Marble failed: ${error.message}`
                logger.error(errorMessage);
                reject({
                    error: {
                        message: errorMessage,
                        status: 400,
                    }
                });
                return;
            };
        });
    }//Function End GetMarbleByID

}
module.exports = Marble;