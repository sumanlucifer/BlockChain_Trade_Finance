/** ***********************************************************************************************
* Test Script to test letter of credit funcationalities
*
* @author Gaurav Kaushik
************************************************************************************************** */

var jsonfile = require("jsonfile");
const Web3 = require('web3');
const { Console } = require("winston/lib/winston/transports");
const config = require('../config/config') // require the config file
config.setEnv(process.argv[2]) //set the environment to local or production
const Config = require('../config/config').getProps() //get the properties of environment

var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
const networkId = (`${Config.node.networkid.networkId}`);

//web3.eth.net.getId().then(console.log);
var json = jsonfile.readFileSync("./build/contracts/LetterOfCredits.json");

const contractAddress = json.networks[networkId].address;
const accountAddress = '0x0Fb8E1A23D2Ef537690077E5399CB3a8bF72f0B5'; // Linux VM Accounts
const ownerAddress = '0xf20d3b0735d8933c8bE29F00f9b47d183C153Ccd'; // Linux VM Accounts
//const accountAddress = '0x3dD32e2163eE4A6Da21e4918826C725C340DB1E5';

/* Funcations Call */
readLCData(json.abi, contractAddress, accountAddress, 'LC0098');
//getAllLCs(json.abi, contractAddress, accountAddress);
//getOwnerLCs(json.abi, contractAddress, accountAddress, ownerAddress);

function readLCData(abi, contractAddress, accountAddress, lcTokenNumber) {
  return new Promise(async (resolve, reject) => {
    try {
      const LCTokenNumber = web3.utils.fromAscii(lcTokenNumber);
      var contract = new web3.eth.Contract(abi, contractAddress);
      const LCID = await contract.methods.getLCId(LCTokenNumber).call();
      //console.log("LC ID : " + LCID);

      const data = await contract.methods.readLC(LCID).call();
      console.log("--------------------------------------------------------------------------------------------------------------------------------------");
      console.log(
        "LC ID : " + LCID
        + "     LCTokenNumber : " + web3.utils.toUtf8(data.LCTokenNumber)
        + "     LCStatus : " + web3.utils.toUtf8(data.LCStatus)
        + "     OwnerAddress : " + data.OwnerAddress
      );
      console.log("--------------------------------------------------------------------------------------------------------------------------------------");
      console.log(data);

      //resolve(lcData);
    } catch (err) {
      console.log('error in lcData : ', err);
      reject(err.message);
    }
  });
}

function getAllLCs(abi, contractAddress, accountAddress) {
  return new Promise(async (resolve, reject) => {
    try {
      //let lcDataArray = [];

      var contract = new web3.eth.Contract(abi, contractAddress);
      const arraylength = await contract.methods.getLCIDArrayLength().call();
      for (let i = 0; i < arraylength; i++) {
        const LCid = await contract.methods.LCIDArray(i).call();
        const data = await contract.methods.readLC(LCid).call();
        console.log(
          "****************   LC ID : " + LCid
          + "       LCTokenNumber : " + web3.utils.toUtf8(data.LCTokenNumber)
          + "       LCStatus : " + web3.utils.toUtf8(data.LCStatus) + "   ****************"
        );
        console.log(data);
      }
    } catch (err) {
      console.log('error in lcData : ', err);
      reject(err.message);
    }
  });
}

function getOwnerLCs(abi, contractAddress, accountAddress, ownerAddress) {
  return new Promise(async (resolve, reject) => {
    try {
      //let lcDataArray = [];

      var contract = new web3.eth.Contract(abi, contractAddress);
      const arraylength = await contract.methods.getLCIDArrayLength().call();
      for (let i = 0; i < arraylength; i++) {
        const LCid = await contract.methods.LCIDArray(i).call();
        console.log("**************** LC ID : " + LCid + " ****************");
        const data = await contract.methods.readLC(LCid).call();
        if (data.OwnerAddress == ownerAddress) {
          console.log(data);
        }
        //resolve(lcData);
      }
    } catch (err) {
      console.log('error in lcData : ', err);
      reject(err.message);
    }
  });
}

// ** Test Command **
// BlockchainTradeFinance\tradefinance-api>node src/test/test_getLCData.js




