let methods = {};
const Web3 = require('web3');
const Config = require('../config/config').getProps()
var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;
let web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

const {
    createLcToMongoDB
} = require('../service/lcDetailsMongoDB');

const {
    sendLcNotificationToSAP
} = require('../service/ABAPRequest');

const {
    createLcHistoryToMongoDB
} = require('../service/lcHistoryMongoDB');

methods.eventListener = async (blocknumber, contract, eventname, userDetails) => {
    console.log("** printing simple event name ***")

    let event = await contract.getPastEvents(eventname, {
        fromBlock: blocknumber,
        toBlock: 'latest'
    });
    let eventdata = event[0].returnValues;
    if (!eventdata) {
        console.log("eventdata is not available");
    } else {
        console.log('eventdata ', eventdata)
        let options = {
            LCId: eventdata[0],
            LCTokenNumber: web3.utils.toUtf8(eventdata[1]),
            OwnerAddress: eventdata[2],
            BuyerMetadata: eventdata[3],
            SellerMetadata: eventdata[4],
            ProductMetadata: eventdata[5],
            LCStatus: web3.utils.toUtf8(eventdata[6]),
            timestamp: web3.utils.toUtf8(eventdata[7])
        }

        const historyData = {
            LCId: eventdata[0],

            LCTokenNumber: web3.utils.toUtf8(eventdata[1]),
            OwnerAddress: eventdata[2],

            LCStatus: web3.utils.toUtf8(eventdata[6]),
            ChangedOn: new Date().toISOString(),
            ChangedBy: userDetails.email,
            ChangedByName: userDetails.name,
            ChangeType: 'Status Update',
            createdBy: userDetails.email
        }
        console.log('historyData ', historyData)
        await createLcToMongoDB(options);
        await createLcHistoryToMongoDB(historyData);

    }



}



module.exports = methods;