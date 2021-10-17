const config = require('../config/config') // require the config file

var jsonfile = require("jsonfile");
const Config = require('../config/config').getProps() //get the properties of environment
var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;
console.log(rpcURL);
const lo = require('lodash');
const Web3 = require('web3')


const networkId = (`${Config.node.networkid.networkId}`)
let web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
const accountAddress = '0x0fb8e1a23d2ef537690077e5399cb3a8bf72f0b5';


var LC_file = jsonfile.readFileSync('./build/contracts/LCWorkFlow.json');
const LCContract = new web3.eth.Contract(LC_file.abi, LC_file.networks[networkId].address);
console.log('LC_file.networks[networkId].address ', LC_file.networks[networkId].address);
const contractAddress = LC_file.networks[networkId].address

getTokenDetails(LC_file.abi, contractAddress);

function getTokenDetails(abi, contractAddress) {
  console.log(".........getTokenDetails..............");
  return new Promise(async (resolve, reject) => {
    try {
      var contract = new web3.eth.Contract(abi, contractAddress);
      // console.log('contract ',contract.methods)
      const name = await contract.methods.name().call();
      console.log('name ,name')
      console.log("Token Name : " + name);

      // const symbol = await contract.methods.symbol().call();
      // console.log("Token Symbol : " + symbol);

      // const totalSupply = await contract.methods.totalSupply().call();
      // console.log("Token TotalSupply : " + totalSupply);

      // const tokenURI = await contract.methods.tokenURI('31').call();
      // //const tokenURI = await contract.methods.tokenURI('1000000').call();
      // console.log("Token tokenURI : " + tokenURI);

      // const ownerOf = await contract.methods.ownerOf('31').call();
      // //const ownerOf = await contract.methods.ownerOf('1000000').call();
      // console.log("Token Owner : " + ownerOf);

      return resolve("totalSupply");
    } catch (err) {
      console.log('err in getTokenDetails : ', err);
      reject(err);
    }
  });
}