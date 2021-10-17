/** ***********************************************************************************************
* Test Script to test letter of credit workflow funcationalities
*
* @author Gaurav Kaushik
************************************************************************************************** */

var jsonfile = require("jsonfile");
const Web3 = require('web3');
const { Console } = require("winston/lib/winston/transports");
const config = require('./config/config') // require the config file
config.setEnv(process.argv[2]) //set the environment to local or production
const Config = require('./config/config').getProps() //get the properties of environment

var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

//web3.eth.net.getId().then(console.log);
var json = jsonfile.readFileSync("../../build/contracts/LCWorkFlow.json");

const contractAddress = '0x31623Ceb2640C313f590CA397d3Dd966C401e105';
const accountAddress = '0x0Fb8E1A23D2Ef537690077E5399CB3a8bF72f0B5'; // Linux VM Accounts
//const accountAddress = '0x3dD32e2163eE4A6Da21e4918826C725C340DB1E5';

/* Funcations Call */
getTokenDetails(json.abi, contractAddress);

//mintToken(json.abi, contractAddress, accountAddress);
//transfer(json.abi, contractAddress, accountAddress);


function mintToken(abi, contractAddress, accountAddress) {
  console.log(".........mintToken..............");
  return new Promise(async (resolve, reject) => {
    try {
      var contract = new web3.eth.Contract(abi, contractAddress);

      // First Token Token 
      await contract.methods.mintUniqueTokenTo(accountAddress, 10, "LC2766").send({ from: accountAddress, gas: 500000 });

      return resolve("token minted");
    } catch (err) {
      console.log('err in mintToken : ', err);
      reject(err);
    }
  });
}


function getTokenDetails(abi, contractAddress) {
  console.log(".........getTokenDetails..............");
  return new Promise(async (resolve, reject) => {
    try {
      var contract = new web3.eth.Contract(abi, contractAddress);

      const name = await contract.methods.name().call();
      console.log("Token Name : " + name);

      const symbol = await contract.methods.symbol().call();
      console.log("Token Symbol : " + symbol);

      const totalSupply = await contract.methods.totalSupply().call();
      console.log("Token TotalSupply : " + totalSupply);

      const tokenURI = await contract.methods.tokenURI('31').call();
      //const tokenURI = await contract.methods.tokenURI('1000000').call();
      console.log("Token tokenURI : " + tokenURI);

      const ownerOf = await contract.methods.ownerOf('31').call();
      //const ownerOf = await contract.methods.ownerOf('1000000').call();
      console.log("Token Owner : " + ownerOf);

      return resolve("totalSupply");
    } catch (err) {
      console.log('err in getTokenDetails : ', err);
      reject(err);
    }
  });
}

//mintToken(json.abi, contractAddress, accountAddress);
function transfer(abi, contractAddress, accountAddress) {
  console.log(".........transfer..............");
  return new Promise(async (resolve, reject) => {
    try {
      var contract = new web3.eth.Contract(abi, contractAddress);

      await contract.methods.transferFrom(accountAddress, '0x4c33fd80aa5421f06132fe1677c0d062aba92222', 10).send({ from: accountAddress, gas: 500000 });

      return resolve("token transfered");
    } catch (err) {
      console.log('err in transfer : ', err);
      reject(err);
    }
  });
}


