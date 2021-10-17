/** ***********************************************************************************************
 * Presents an API which can be used to control Blockchain letter of credit funcationalities
 *
 * @author Gaurav Kaushik
 ************************************************************************************************** */

var jsonfile = require("jsonfile");
const Web3 = require('web3')
const config = require('../config/config') // require the config file
config.setEnv(process.argv[2]) //set the environment to local or production
const Config = require('../config/config').getProps() //get the properties of environment

var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;
var IPFSURL = Config.node.IPFS.url + ':' + Config.node.IPFS.port;


const lo = require('lodash');


const {
    sendLcNotificationToSAP,
    sendPaymentNotificationToSAP
} = require('../service/ABAPRequest');

const {
    getLcDetailsByIdFromMongoDB,
    deleteLcDetailsByLcIdFromMongoDB
} = require('../service/lcDetailsMongoDB');

const {
    createLcHistoryToMongoDB,
    getLcHistoryByIdOneFromMongoDB,
    deleteLcHistoryByLcIdFromMongoDB

} = require('../service/lcHistoryMongoDB');

const {
    createLc,
    numberWithCommas,
    burnLcToken,
    updateStatus,
    getlcdatabyID
} = require('../service/lcService');

const {
    addFile,
    getIPFSURI,
    uploadBillToIpfs
} = require('../service/ipfs.service');



const { productdata } = require('../apiValidation/apiValidation')



const networkId = (`${Config.node.networkid.networkId}`)
let web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));



const LC_file = jsonfile.readFileSync("./build/contracts/LetterOfCredits.json");
const LCContract = new web3.eth.Contract(LC_file.abi, LC_file.networks[networkId].address);

const LC_Flow_file = jsonfile.readFileSync("./build/contracts/LCWorkFlow.json");
const LC_Flow_Contract = new web3.eth.Contract(LC_Flow_file.abi, LC_Flow_file.networks[networkId].address);


let provider = LCContract.setProvider(web3.currentProvider);

let methods = {}




// Function to create LC

methods.createLC = async (req, res) => {
    try {
        let useraddress = req.headers.address;
        let contract = LCContract;
        const arraylength = await contract.methods.getLCIDArrayLength().call();
        const lcNumber = parseInt(arraylength) + 1;
        let LCTokenNumber = 'LC' + ('00000' + lcNumber).slice(-5)
        const product = req.body.ProductMetadata[0];
        const {
            error,
            value
        } = productdata.validate(product);
        if (error) {
            return res.status(500).json({
                status: 500,
                message: error.details[0].message
            });

        }
        const metaData = req.body;
        const lcStatus = 'PENDING'

        const createLcResponse = await createLc(LCTokenNumber, useraddress, metaData, lcStatus, req.user);
        res.json({
            success: true,
            status: 200,
            message: 'LC has been created successfully',
            data: {
                LCID: createLcResponse.events.createLCEvent.returnValues[0],
                LCTokenNumber: LCTokenNumber,
                Status: 'PENDING'
            }
        });
    } catch (err) {
        console.log('err in Creating LC service', err);
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}


//Function to retrieve LC data by LCID

methods.getLcDataByIDCtrl = async (req, res) => {
    try {
        let id = req.params.lcid;
        let address = req.headers.address;
        const getLCdata = await getlcdatabyID(id);
        res.json(getLCdata);

    } catch (err) {
        console.log('err in getting LCdata by LCID', err);
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}




methods.updateLCStatus = async (req, res) => {

    try {
        let LCId = req.body.LCId;
        let address = req.headers.address;
        // const updatestatus = await updateStatus(LCId, address, req.body.LCStatus)

        if (req.body.LCStatus == "DELETE") {
            console.log("deleted entry")
        const updatestatus = await updateStatus(LCId, address, req.body.LCStatus)

            let burn = await burnLcToken(LCId, address)
            let deletedata = await deleteLcHistoryByLcIdFromMongoDB(LCId);
            let deletedatafrom = await deleteLcDetailsByLcIdFromMongoDB(LCId);
            res.json({
                success: true,
                status: 200,
                message: 'LC Deleted successfully',
            });
        } else if (req.body.LCStatus == 'SUB_BUYER') {
            const data = await LCContract.methods.readLC(LCId).call();
            let options = {
                LCId: LCId,
                LCTokenNumber: web3.utils.toUtf8(data.LCTokenNumber),
                OwnerAddress: data.OwnerAddress,
                BuyerMetadata: (data.BuyerMetadata),
                SellerMetadata: (data.SellerMetadata),
                ProductMetadata: data.ProductMetadata, //JSON.parse(data.ProductMetadata),
                LCStatus: web3.utils.toUtf8(data.LCStatus),
                LCTimestamp: web3.utils.toUtf8(data.LCTimestamp),

            }
            const historyPayload = {
                LCId: LCId,
                LCTokenNumber: web3.utils.toUtf8(data.LCTokenNumber),
                LCStatus: req.body.LCStatus,
                ChangedOn: new Date().toISOString(),
                ChangedBy: req.user.email,
                ChangedByName: req.user.name,
                ChangeType: 'Status Update',
                OwnerAddress: data.OwnerAddress
            }
            const sapResponse = await sendLcNotificationToSAP(options, req.user);
            const updatestatus = await updateStatus(LCId, address, req.body.LCStatus)

            const createLcHistoryData = await createLcHistoryToMongoDB(historyPayload);
            res.json({
                success: true,
                status: 200,
                message: 'LC Status updated successfully',
            });
        } else {
            const updatestatus = await updateStatus(LCId, address, req.body.LCStatus)
            const lcDetails = await getLcDetailsByIdFromMongoDB(LCId);
            const lcHistoryData = await getLcHistoryByIdOneFromMongoDB(LCId);
            const historyPayload = {
                LCId: LCId,
                LCTokenNumber: lcHistoryData.LCTokenNumber,
                LCStatus: req.body.LCStatus,
                ChangedOn: new Date().toISOString(),
                ChangedBy: req.user.email,
                ChangedByName: req.user.name,

                ChangeType: 'Status Update',
                OwnerAddress: lcDetails.OwnerAddress
            }
            const createLcHistoryData = await createLcHistoryToMongoDB(historyPayload)
            res.json({
                success: true,
                status: 200,
                message: 'LC Status updated successfully',
            });

        }
    } catch (err) {
        console.log('err in updating  LC status', err);
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}

methods.getLetterOfCreditArrayLength = async (req, res) => {
    try {

        const LClength = await LCContract.methods.getLetterOfCreditArrayLength().call();
        res.json({
            success: true,
            status: 200,
            data: LClength
        });
    } catch (err) {
        console.log('err in getting length', err);
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}

methods.getLCId = async (req, res) => {
    try {
        let LCTokenNumber = web3.utils.fromAscii(req.params.LCTokenNumber);
        const LCTokennum = await LCContract.methods.getLCId(LCTokenNumber).call();
        res.json({
            success: true,
            status: 200,
            LCID: LCTokennum
        });
    } catch (err) {
        console.log('err in get LCID', err);
        res.status(500).json({
            status: 500,
            message: err.message
        });

    }
}



methods.uploadBillCtrl = async (req, res) => {
    try {
        let data = req.file;
        let filepath = data.path;
        let bodydata = req.headers;
        if (data.mimetype !== 'application/pdf') {

            res.json({
                message: 'Only pdfs allowed'
            });
        }
        const file = await addFile(data.filename, filepath);
        let fileurl = IPFSURL + '/api/v0/cat?arg' + '=' + `${file}`;
        let content = await uploadBillToIpfs(req.user, fileurl, bodydata.lcid, bodydata.address);
        res.json({
            status: 200,
            message: 'Request Processed sucessfully',
            data: 'Bill uploaded successfully'
        });
    } catch (err) {
        console.log('err in Upload bill', err);
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}


methods.getfilefromIPFS = async (req, res) => {
    try {
        let LCID = req.params.lcid;
        let buffdata = await getIPFSURI(LCID);
        res.json({
            success: true,
            status: 200,
            data: buffdata
        });
    } catch (err) {
        console.log('err in getfilefromIPFS', err);
        res.status(500).json({
            status: 500,
            message: err.message
        });


    }
}

methods.rejectLc = async (req, res) => {
    try {
        const tokenID = req.body.LCId;
        const lcStatus = req.body.lcStatus;
        const lcDetails = await getLcDetailsByIdFromMongoDB(tokenID);
        const lcHistoryData = await getLcHistoryByIdOneFromMongoDB(tokenID);
        const historyPayload = {
            LCId: tokenID,
            LCTokenNumber: lcHistoryData.LCTokenNumber,
            LCStatus: lcStatus,
            ChangedOn: new Date().toISOString(),
            ChangedBy: req.user.email,
            ChangedByName: req.user.name,

            ChangeType: 'Status Update',
            OwnerAddress: lcDetails.OwnerAddress
        }
        const COCODE = JSON.parse(lcDetails.BuyerMetadata).COCODE;
        const createLcHistoryData = await createLcHistoryToMongoDB(historyPayload)
        await sendPaymentNotificationToSAP(tokenID, lcDetails.OwnerAddress, lcDetails.LCTokenNumber, COCODE, '50', lcStatus, req.user);
        res.json({
            status: 200,
            message: 'LC Rejected sucessfully',
        });
    } catch (err) {
        console.log('err in get LCID', err);
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}

methods.landingPage = async (req, res) => {
    try {
        let newLc = req.query.newlc;
        let address = req.headers.address;
        let lcstatus = req.query.status;
        console.log(lcstatus);
        let arrdata = [];
        const arraylength = await LCContract.methods.getLCIDArrayLength().call();
        for (let i = 1; i <= arraylength; i++) {
            const LCid = i.toString()
            const data = await LCContract.methods.readLC(LCid).call();
            let status = web3.utils.toUtf8(data.LCStatus);
            let LCTimestamp = web3.utils.toUtf8(data.LCTimestamp)
            let ProductMetadata = JSON.parse(data.ProductMetadata);
            ProductMetadata = ProductMetadata.hasOwnProperty('ProductMetadata') ? ProductMetadata.ProductMetadata : ProductMetadata;
            ProductMetadata.TOTAL_VAL = numberWithCommas(ProductMetadata.TOTAL_VAL);
            ProductMetadata.PROD_QTY = numberWithCommas(ProductMetadata.PROD_QTY);
            ProductMetadata.PROD_PRICE = numberWithCommas(ProductMetadata.PROD_PRICE);


            let options = {
                LCId: LCid,
                LCTokenNumber: web3.utils.toUtf8(data.LCTokenNumber),
                OwnerAddress: data.OwnerAddress,
                BuyerMetadata: JSON.parse(data.BuyerMetadata),
                SellerMetadata: JSON.parse(data.SellerMetadata),
                ProductMetadata: ProductMetadata, //JSON.parse(data.ProductMetadata),
                LCStatus: status,
                LCTimestamp: web3.utils.toUtf8(data.LCTimestamp),

            }
            arrdata.push(options);

        }
        const newLC = await lo.orderBy(lo.filter(arrdata, {
            LCStatus: newLc
        }), ["LCTimestamp"], ['desc']);
        const Review = await lo.orderBy(lo.filter(arrdata, (data) => {
            return lcstatus.includes(data.LCStatus);
        }), ["LCTimestamp"], ['desc'])

        var grouped = lo.groupBy(arrdata, function (data) {
            return data.LCStatus;
        });
        var data = {};
        data.newLC = newLC;
        data.Review = Review;

        var counts = {};
        counts.PENDING = grouped.PENDING ? grouped.PENDING.length : 0
        counts.SUB_BUYER = grouped.SUB_BUYER ? grouped.SUB_BUYER.length : 0
        counts.COMPLETED = grouped.COMPLETED ? grouped.COMPLETED.length : 0
        counts.APP_BUYER_BANK = grouped.APP_BUYER_BANK ? grouped.APP_BUYER_BANK.length : 0
        counts.REJ_BUYER_BANK = grouped.REJ_BUYER_BANK ? grouped.REJ_BUYER_BANK.length : 0
        counts.APP_SELLER_BANK = grouped.APP_SELLER_BANK ? grouped.APP_SELLER_BANK.length : 0
        counts.REJ_SELLER_BANK = grouped.REJ_SELLER_BANK ? grouped.REJ_SELLER_BANK.length : 0
        counts.REJ_SELLER = grouped.REJ_SELLER ? grouped.REJ_SELLER.length : 0

        counts.GOODS_DIS_PEN = grouped.GOODS_DIS_PEN ? grouped.GOODS_DIS_PEN.length : 0
        counts.PAYMENT_PROGRESS = grouped.PAYMENT_PROGRESS ? grouped.PAYMENT_PROGRESS.length : 0
        counts.PAYMENT_PROGRESS = grouped.PAYMENT_PROGRESS ? grouped.PAYMENT_PROGRESS.length : 0

        web3.eth.getBalance(address, (err, balance) => {
            if (err) {
                console.log('Could not get balance', err);
                res.send({
                    success: false,
                    status: 400,
                    error: err
                });
            } else {
                balance = web3.utils.fromWei(balance, 'ether').toString()
                counts.accountBalance = parseFloat(balance).toFixed(2);
                data.statistics = counts;
                // console.log('data ',data);
                return res.json({
                    success: true,
                    status: 200,
                    data
                });
            }
        });

    } catch (err) {
        console.log('err in get AllLC', err);
        res.status(500).json({
            status: 500,
            message: err.message
        });

    }
}


module.exports = methods;