var jsonfile = require("jsonfile");
const Web3 = require('web3')
const config = require('../config/config') // require the config file
config.setEnv(process.argv[2]) //set the environment to local or production
const Config = require('../config/config').getProps() //get the properties of environment
const {
    eventListener
} = require('../ethereum/eventlistener');
//console.log('eventListenereventListenereventListener====> ',eventListener)

var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;
const lo = require('lodash');
const {
    reject
} = require("lodash");

const networkId = (`${Config.node.networkid.networkId}`)
let web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

const LC_file = jsonfile.readFileSync("./build/contracts/LetterOfCredits.json");
const LCContract = new web3.eth.Contract(LC_file.abi, LC_file.networks[networkId].address);

const LC_Flow_file = jsonfile.readFileSync("./build/contracts/LCWorkFlow.json");
const LC_Flow_Contract = new web3.eth.Contract(LC_Flow_file.abi, LC_Flow_file.networks[networkId].address);


const createLc = (LCTokenNumber, useraddress, metadata, lcStatus, user) => {
    console.log(LCTokenNumber, useraddress, metadata, lcStatus, user)
    return new Promise(async (resolve, reject) => {
        try {
            let LCToken = web3.utils.fromAscii(LCTokenNumber);
            let contract = LCContract;

            const BuyerMetadata = JSON.stringify(metadata.BuyerMetadata[0]);
            const SellerMetadata = JSON.stringify(metadata.SellerMetadata[0]);
            const ProductMetadata = JSON.stringify(metadata.ProductMetadata[0]);
            const LCStatus = web3.utils.fromAscii(lcStatus);
            const timeStamp = new Date().toISOString();
            const TimeStamp = web3.utils.fromAscii(timeStamp);
            const createLCdata = await LCContract.methods.createLC(LCToken, useraddress, BuyerMetadata, SellerMetadata, ProductMetadata, LCStatus, TimeStamp).send({
                from: useraddress,
                gas: 3000000
            });
            const lcid = createLCdata.events.createLCEvent.returnValues[0];
            let blocknumber = createLCdata.events.createLCEvent.blockNumber;
            let eventname = createLCdata.events.createLCEvent.returnValues.event;
            await mintdata(useraddress, lcid);
            console.log('eventListener ', eventListener)
            await eventListener(blocknumber, contract, eventname, user);
            resolve(createLCdata);
        } catch (err) {
            reject(err);
        }
    })


}
const mintdata = async (useraddress, lcid) => {
    return LC_Flow_Contract.methods.mintUniqueTokenTo(useraddress, lcid).send({
        from: useraddress,
        gas: 3000000
    });

}
const burnLcToken = async (LcTokenId, accountAddress) => {
    return LC_Flow_Contract.methods.burnLCToken(LcTokenId).send({
        from: accountAddress,
        gas: 500000
    });
}

const updateStatus = (LcTokenId, accountAddress, lcStatus) => {
    return new Promise(async (resolve, reject) => {
        try {

            let LCStatus = web3.utils.fromAscii(lcStatus);
            const timeStamp = new Date().toISOString();
            const TimeStamp = web3.utils.fromAscii(timeStamp);
            const updateStatus = await LCContract.methods.updateLCStatus(LcTokenId, LCStatus, TimeStamp).send({
                from: accountAddress,
                gas: 3000000
            });
            resolve(updateStatus);
        } catch (err) {
            console.log('Error in update status ', err.message);
            reject(err);
        }
    })
}

const numberWithCommas = (x) => {
    try {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    } catch (err) {
        console.log('Error in adding commas ', err);
        return x;
    }
}

const getlcdatabyID = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getLCdata = await LCContract.methods.readLC(id).call();
            let ProductMetadata = (JSON.parse(getLCdata[2]));
            ProductMetadata = ProductMetadata.hasOwnProperty('ProductMetadata') ? ProductMetadata.ProductMetadata : ProductMetadata;
            ProductMetadata.TOTAL_VAL = numberWithCommas(ProductMetadata.TOTAL_VAL);
            ProductMetadata.PROD_QTY = numberWithCommas(ProductMetadata.PROD_QTY);
            ProductMetadata.PROD_PRICE = numberWithCommas(ProductMetadata.PROD_PRICE);
            let END_DATE = ProductMetadata.END_DATE;
            var year = parseInt(END_DATE.slice(0, 4));
            var month = parseInt(END_DATE.slice(4, 6));
            var day = parseInt(END_DATE.slice(6, 8));
            let date = year + '-' + month + '-' + day;
            ProductMetadata.END_DATE = date;
            let LCdataObj = {
                LCTokenNumber: web3.utils.toUtf8(getLCdata[0]),
                OwnerAddress: getLCdata[1],
                ProductMetadata: ProductMetadata, //JSON.parse(getLCdata[2]),
                LCStatus: web3.utils.toUtf8(getLCdata[3]),
                LCTimestamp: web3.utils.toUtf8(getLCdata[4]),

                BuyerMetadata: JSON.parse(getLCdata[5]),
                SellerMetadata: JSON.parse(getLCdata[6])

            };
            resolve({
                success: true,
                status: 200,
                message: 'LC data by LCID',
                data: LCdataObj
            });
        } catch (err) {
            console.log('Error in update status ', err.message);
            reject(err);
        }
    });
}

exports.createLc = createLc;
exports.burnLcToken = burnLcToken;
exports.updateStatus = updateStatus;
exports.numberWithCommas = numberWithCommas;
exports.getlcdatabyID = getlcdatabyID;
