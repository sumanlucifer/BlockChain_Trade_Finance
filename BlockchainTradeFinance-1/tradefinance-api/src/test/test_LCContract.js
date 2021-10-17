/** ***********************************************************************************************
 * Test Script to test letter of credit funcationalities
 *
 * @author Gaurav Kaushik
 ************************************************************************************************** */

var jsonfile = require("jsonfile");
const Web3 = require('web3');
const {
  Console
} = require("winston/lib/winston/transports");
const config = require('../config/config') // require the config file
config.setEnv(process.argv[2]) //set the environment to local or production
const Config = require('../config/config').getProps() //get the properties of environment

var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
const networkId = (`${Config.node.networkid.networkId}`);

var json = jsonfile.readFileSync("./build/contracts/LetterOfCredits.json");

const contractAddress = json.networks[networkId].address;
console.log(contractAddress);
const accountAddress = '0x42Fd403688B0623C5Cc7A1ff34F75B1AeEB68106'; // Linux VM Accounts
//const accountAddress = '0x3dD32e2163eE4A6Da21e4918826C725C340DB1E5';

/* Funcations Call */
// createLC(json.abi, contractAddress, accountAddress);
//readLC(json.abi, contractAddress, accountAddress);
// updateLC(json.abi, contractAddress, accountAddress);
 getAllLCs(json.abi, contractAddress, accountAddress);

//getLCId(json.abi, contractAddress, accountAddress);

//getLCId(json.abi, contractAddress, accountAddress);

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function createLC(abi, contractAddress, accountAddress) {
  console.log(".........createLC..............");
  return new Promise(async (resolve, reject) => {
    try {
      var contract = new web3.eth.Contract(abi, contractAddress);

      // const LCTokenNumber = web3.utils.fromAscii('LC0002');
      const arraylength = await contract.methods.getLCIDArrayLength().call();
      const lcNumber = parseInt(arraylength) + 1;
      let LCTokenNumber = 'LC' + ('00000' + lcNumber).slice(-5)
      let LCToken = web3.utils.fromAscii(LCTokenNumber);

      const BuyerMetadata = '{"BUY_NAME":"Eion Morgan","BUY_COMPANY":"Alpha Ltd US","BUY_IBAN":"EY6552611718","BUY_BANK":"Bank of UK","BUY_SWIFT":"SW7372819199"} ';
      const SellerMetadata = '{"SEL_NAME":"Jeo Root","SEL_COMPANY":"Mnon Ltd US","SEL_IBAN":"EY6552611718","SEL_BANK":"Bank of US","SEL_SWIFT":"SW7372819199"} ';
      const ProductMetadata = '{"PROD_TYPE":"Computers","PROD_QTY":"201","PROD_PRICE":"1000","TOTAL_VAL":"20100","END_DATE":"26 Dec 2020","INTEREST_RATE":"10" }';
      const LCStatus = web3.utils.fromAscii('PENDING');
      const timeStamp = new Date().toISOString();
      const TimeStamp = web3.utils.fromAscii(timeStamp);

      await contract.methods.createLC(LCToken, accountAddress, BuyerMetadata, SellerMetadata, ProductMetadata, LCStatus, TimeStamp).send({
        from: accountAddress,
        gas: 5000000
      }).then(function (result) {
        console.log(JSON.stringify(result));
      });
      return resolve("created LC");
    } catch (err) {
      console.log('err in createLC : ', err);
      reject(err);
    }
  });
}


function readLC(abi, contractAddress, accountAddress) {
  console.log(".........readLC..............");
  return new Promise(async (resolve, reject) => {
    try {
      var contract = new web3.eth.Contract(abi, contractAddress);


      // First Token Token 
      let getLCdata = await contract.methods.readLC('14').call(); //.then(function (result) {
      // console.log(getLCdata[2]);
      let ProductMetadata = (JSON.parse(getLCdata[2]));
      // console.log('11111111111111 ',ProductMetadata)
      ProductMetadata = ProductMetadata.hasOwnProperty('ProductMetadata')?ProductMetadata.ProductMetadata:ProductMetadata;

      ProductMetadata.TOTAL_VAL = numberWithCommas(ProductMetadata.TOTAL_VAL);
      ProductMetadata.PROD_QTY = numberWithCommas(ProductMetadata.PROD_QTY);
      ProductMetadata.PROD_PRICE = numberWithCommas(ProductMetadata.PROD_PRICE);

      let LCdataObj = {
        LCTokenNumber: web3.utils.toUtf8(getLCdata[0]),
        OwnerAddress: getLCdata[1],
        ProductMetadata: ProductMetadata, //JSON.parse(getLCdata[2]),
        LCStatus: web3.utils.toUtf8(getLCdata[3]),
        // BuyerMetadata: JSON.parse(getLCdata[4]),
        // SellerMetadata: JSON.parse(getLCdata[5]),
        // LCTimestamp:web3.utils.toUtf8(getLCdata[6]),
        // LCTimestamp:web3.utils.toUtf8(data.LCTimestamp),
        LCTimestamp: web3.utils.toUtf8(getLCdata[4]),

        BuyerMetadata: JSON.parse(getLCdata[5]),
        SellerMetadata: JSON.parse(getLCdata[6])

      };

      console.log(LCdataObj);
      // });

      return resolve("readLC");
    } catch (err) {
      console.log('err in readLC : ', err);
      reject(err);
    }
  });
}


function updateLC(abi, contractAddress, accountAddress) {
  console.log(".........updateLC..............");
  return new Promise(async (resolve, reject) => {
    try {
      var contract = new web3.eth.Contract(abi, contractAddress);
      const LCTokenNumber = web3.utils.fromAscii('LC0001');
      const timeStamp = new Date().toISOString();
      const TimeStamp = web3.utils.fromAscii(timeStamp);

      const ProductMetadata = '{"ProductMetadata": {"ProductType Updated":"Computers","ProductQuantity":"201","PricePerUnit":"1000", "TotalValue":"20100","MaturityDate":"26 Dec 2020", "InterestRate":"10"}';

      const LCStatus = web3.utils.fromAscii('SUB_BUYER');
      // updateLCStatus(LCId, LCStatus, TimeStamp)
      await contract.methods.updateLCStatus('16', LCStatus, TimeStamp).send({
        from: accountAddress,
        gas: 5000000
      }).then(function (result) {
        console.log(JSON.stringify(result));
      });
      return resolve("created LC");
    } catch (err) {
      console.log('err in updateLC : ', err);
      reject(err);
    }
  });
}

function getAllLCs(abi, contractAddress, accountAddress) {
  return new Promise(async (resolve, reject) => {
    try {
      //let lcDataArray = [];

      var contract = new web3.eth.Contract(abi, contractAddress);
      const lcArrayLength = await contract.methods.getLetterOfCreditArrayLength().call();
      for (let i = 0; i < Number(lcArrayLength); i++) {

        const lcData = await contract.methods.LetterOfCreditArray(i).call();
        console.log(lcData);
        //lcDataArray.push(lcData);
      }
      //resolve(lcData);
    } catch (err) {
      console.log('error in lcData : ', err);
      reject(err.message);
    }
  });
}

function getLCId(abi, contractAddress, accountAddress) {
  return new Promise(async (resolve, reject) => {
    try {

      const LCTokenNumber = web3.utils.fromAscii('LC0001');
      var contract = new web3.eth.Contract(abi, contractAddress);
      const lcID = await contract.methods.getLCId(LCTokenNumber).call();
      console.log("LC ID : " + lcID);

      //resolve(lcData);
    } catch (err) {
      console.log('error in lcData : ', err);
      reject(err.message);
    }
  });
}