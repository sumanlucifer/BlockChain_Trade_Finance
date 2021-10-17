/** ***********************************************************************************************
 * Presents an API which can be used to control Blockchain letter of credit workflow funcationalities
 *
 * @author Gaurav Kaushik
 ************************************************************************************************** */

var jsonfile = require("jsonfile");
const Web3 = require('web3')
const config = require('../config/config') // require the config file
config.setEnv(process.argv[2]) //set the environment to local or production
const Config = require('../config/config').getProps() //get the properties of environment

var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;
const lo = require('lodash');


const networkId = (`${Config.node.networkid.networkId}`)
let web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));


const LC_file = jsonfile.readFileSync("./build/contracts/LetterOfCredits.json");
const LCContract = new web3.eth.Contract(LC_file.abi, LC_file.networks[networkId].address);

const LC_Flow_file = jsonfile.readFileSync("./build/contracts/LCWorkFlow.json");
const LC_Flow_Contract = new web3.eth.Contract(LC_Flow_file.abi, LC_Flow_file.networks[networkId].address);

const {
    createLcHistoryToMongoDB,
    getLcHistoryByIdOneFromMongoDB
} = require('../service/lcHistoryMongoDB');

const {
    burnLcToken
} = require('../service/lcService');

let provider = LCContract.setProvider(web3.currentProvider);

let methods = {}



methods.tokenTransfer = async (req, res) => {
    try {
        let accountAddress = req.headers.address;

        const {
            fromAddress,
            toAddress,
            LcTokenId,
            lcStatus
        } = req.body
        let data = await LC_Flow_Contract.methods.transferFrom(fromAddress, toAddress, LcTokenId).send({
            from: fromAddress,
            gas: 3000000
        });
        console.log('transfer ', JSON.stringify(data));
        const LCStatus = web3.utils.fromAscii(lcStatus);
        const timeStamp = new Date().toISOString();
        const TimeStamp = web3.utils.fromAscii(timeStamp);

        let updateLcOwner = await LCContract.methods.updateLCOwnerAndStatus(LcTokenId, toAddress, LCStatus, TimeStamp).send({
            from: fromAddress,
            gas: 3000000
        });
        console.log('updateLcOwner ', JSON.stringify(updateLcOwner));
        const lcHistoryData = await getLcHistoryByIdOneFromMongoDB(LcTokenId);
        const historyPayload = {
            LCId: LcTokenId,
            LCTokenNumber: lcHistoryData.LCTokenNumber,
            LCStatus: lcStatus,
            ChangedOn: new Date().toISOString(),
            ChangedBy: req.user.email,
            ChangedByName: req.user.name,

            ChangeType: 'Status Update',
            OwnerAddress: toAddress

        }
        const createLcHistoryData = await createLcHistoryToMongoDB(historyPayload)

        return res.json({
            success: true,
            status: 200,
            message: 'LC Token transferred successfully',
        });
    } catch (err) {
        console.log('err in LC Token transfer', err);
        res.status(500).json({
            status: 500,
            message: 'Server side error Please after some time'
        });

    }
}
methods.burnToken = async (req, res) => {
    try {
        let accountAddress = req.headers.address;
        console.log('req.body ', req.body)
        const {
            LcTokenId
        } = req.body;
        const response = await burnLcToken(LcTokenId, accountAddress);//LC_Flow_Contract.methods.burnLCToken(LcTokenId).send({ from: accountAddress, gas: 500000 });
        return res.json({
            success: true,
            status: 200,
            message: 'LC Token burned successfully',
        });
    } catch (err) {
        console.log('err in LC Token burned', err);
        res.status(500).json({
            status: 500,
            message: 'Server side error Please after some time'
        });

    }
}


module.exports = methods;