const config = require('../config/config') // require the config file
config.setEnv(process.argv[2]) //set the environment to local or production
const Config = require('../config/config').getProps()

const fs = require('fs');
const path = require('path');
var jsonfile = require("jsonfile");

const Web3 = require('web3')
var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;

const lo = require('lodash');

const {
    sendPaymentNotificationToSAP
} = require('./ABAPRequest')
const {
    getLcDetailsByIdFromMongoDB,

} = require('./lcDetailsMongoDB');
const {
    createLcHistoryToMongoDB,
    getLcHistoryByIdOneFromMongoDB,

} = require('./lcHistoryMongoDB');


const ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI(`/ip4/${Config.node.IPFS.host}/tcp/${Config.node.IPFS.port}`)

const networkId = (`${Config.node.networkid.networkId}`)
let web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));



const LC_file = jsonfile.readFileSync("./build/contracts/LetterOfCredits.json");
const LCContract = new web3.eth.Contract(LC_file.abi, LC_file.networks[networkId].address);

const LC_Flow_file = jsonfile.readFileSync("./build/contracts/LCWorkFlow.json");
const LC_Flow_Contract = new web3.eth.Contract(LC_Flow_file.abi, LC_Flow_file.networks[networkId].address);



const addFile = async (fileName, filePath) => {
    console.log("entering to addfile");
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({
        path: fileName,
        content: file
    });
    const fileHash = fileAdded[0].hash;

    return fileHash;
}

async function getIPFSURI(LCID) {
    const tokenURI = await LCContract.methods.getLCTokenURI(LCID).call();
    console.log(tokenURI);
    let result = JSON.parse(tokenURI);
    let file = (result).slice(-46);
    const fileurl2 = await ipfs.get(file);
    let buff = fileurl2[0].content;
    let base64data = buff.toString('base64');
    return base64data;

}

async function uploadBillToIpfs(userDetails, url, tokenID, address) {
    console.log("entering to uploadbilltoIPFS");
    let uri = JSON.stringify(url);
    const lcStatus = "PAYMENT_PROGRESS"
    let LCStatus = web3.utils.fromAscii(lcStatus)
    let data = await LCContract.methods.setLCTokenURI(tokenID, uri).send({
        from: address,
        gas: 5000000
    });
    const timeStamp = new Date().toISOString();
    const TimeStamp = web3.utils.fromAscii(timeStamp);

    const updateStatus = await LCContract.methods.updateLCStatus(tokenID, LCStatus, TimeStamp).send({
        from: address,
        gas: 3000000
    });
    const lcDetails = await getLcDetailsByIdFromMongoDB(tokenID);
    const lcHistoryData = await getLcHistoryByIdOneFromMongoDB(tokenID);
    console.log(lcDetails);
    const historyPayload = {
        LCId: tokenID,
        LCTokenNumber: lcHistoryData.LCTokenNumber,
        LCStatus: lcStatus,
        ChangedOn: new Date().toISOString(),
        ChangedBy: userDetails.email,
        ChangeType: 'Status Update',
        ChangedByName: 'SAP Notification',
        OwnerAddress: lcDetails.OwnerAddress
    }
    const COCODE = JSON.parse(lcDetails.BuyerMetadata).COCODE;
    const createLcHistoryData = await createLcHistoryToMongoDB(historyPayload)
    await sendPaymentNotificationToSAP(tokenID, lcDetails.OwnerAddress, lcHistoryData.LCTokenNumber, COCODE, '52', lcStatus, userDetails);
    return data;

}


exports.addFile = addFile;
exports.getIPFSURI = getIPFSURI;
exports.uploadBillToIpfs = uploadBillToIpfs;
