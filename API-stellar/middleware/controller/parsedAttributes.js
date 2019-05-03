




function createMarble(unparsedAttrs) {
    let functionName = `[CreateMarble]`
    logger.info(functionName);

    return new Promise((resolve, reject) => {
        try {
            resolve([
                unparsedAttrs.marble_id.toString().toUpperCase(),
                unparsedAttrs.color.toString().toUpperCase(),
                unparsedAttrs.size.toString(),
                unparsedAttrs.owner.toString().toUpperCase(),

            ]);
            return;

        } catch (error) {
            logger.error(`${functionName} Parsing attributes failed ${error}`);
            reject(`Sorry could not parse attributes: ${error}`);
        }

    });

}




function transferMarble(unparsedAttrs, HOST_STELLAR) {

    let functionName = `[TransferMarble]`
    return new Promise((resolve, reject) => {
        try {

            resolve([
                unparsedAttrs.stellar_tx_id.toString(),
                unparsedAttrs.marble_id.toString().toUpperCase(),
                unparsedAttrs.public_key_receive.toString(),
                unparsedAttrs.amount.toString(),
                HOST_STELLAR
            ]);
            return;

        } catch (error) {
            logger.error(`${functionName} Parsing attributes failed ${error}`);
            reject(`Sorry could not parse attributes: ${error}`);
        }

    });
}


module.exports = {
    createMarble: createMarble,
    transferMarble: transferMarble
}

