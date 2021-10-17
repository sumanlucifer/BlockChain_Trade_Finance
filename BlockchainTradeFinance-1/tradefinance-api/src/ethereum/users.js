/** ***********************************************************************************************
* Presents an API which can be used to control Blockchain user functionalities
*
* @author Gaurav Kaushik
************************************************************************************************** */

var jsonfile = require("jsonfile");
const jwt = require('jsonwebtoken');
const Web3 = require('web3')
const config = require('../config/config') // require the config file
config.setEnv(process.argv[2]) //set the environment to local or production
const Config = require('../config/config').getProps() //get the properties of environment
var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;

const TOKEN_SECRET = 'tradeFinanceEY'

const {
    createUser,
    login
} = require('../service/userService');


const networkId = (`${Config.node.networkid.networkId}`)
let web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

const Names_file = jsonfile.readFileSync("./build/contracts/Names.json");
const NamesContract = new web3.eth.Contract(Names_file.abi, Names_file.networks[networkId].address);


const Auth_file = jsonfile.readFileSync("./build/contracts/Auth.json")
const AuthContract = new web3.eth.Contract(Auth_file.abi, Auth_file.networks[networkId].address);



let methods = {};


methods.assignRole = async (req, res) => {
    let { admin, userAddress, role } = req.body
    try {
        console.log(req.body);
        let details = await AuthContract.methods.permissionUser(userAddress, role).send({ from: admin, gas: 3000000, value: 0 });
        res.send({ status: 200, message: "role created sucessfully" })
    } catch (e) {
        console.log("err in registerUser", e)
        res.send({ status: 500, message: e.message })
    }
};




methods.createUserCtrl = async (req, res) => {
    const { name } = req.body;
    const { email } = req.body;
    const { location } = req.body;
    const { password } = req.body;
    let address = req.headers.address;
    try {
        let userDetails = await createUser(name, email, location, password, address)
        res.json(userDetails);
    }
    catch (e) {
        console.log("err in registerUser", e)
        res.json({ status: 500, message: e.message })
    }
}

//login functionality
methods.loginCtrl = async (req, res) => {
    try {

        let email = req.body.email;
        let password = req.body.password;
        let usercontract = await login(email, password)
        res.json(usercontract)

    } catch (e) {
        console.log("err in Login", e)
        res.json({ status: 500, message: e.message })
    }
}


//getUser details by email

methods.getUser = async (req, res) => {
    try {

        const { email } = req.body;
        const byteEmail = web3.utils.toHex(email);
        let userDetails = await NamesContract.methods.getUser(byteEmail).call();
        res.send({ status: 200, data: userDetails })

    } catch (e) {
        console.log("err in getUser", e)
        res.send({ status: 500, message: e.message })
    }
}

//getUser details by address

methods.getUserbyaddr = async (req, res) => {
    try {

        const address = req.headers.address;
        let userDetails = await NamesContract.methods.getUserName(address).call();
        res.send({ status: 200, data: userDetails })

    } catch (e) {
        console.log("err in getUserbyaddr", e)
        res.send({ status: 500, message: e.message })
    }
}

//getallaccounts functionality

methods.getallaccounts = async (req, res) => {
    try {
        let userDetails = await NamesContract.methods.getUserArr().call();
        let details = [];
        for (i = 0; i < userDetails.length; i++) {
            let data = web3.utils.toUtf8(userDetails[i]);
            details.push(data);
        }
        res.send({ status: 200, data: details })

    } catch (e) {
        res.send({ status: 500, message: e.message })
    }
}


//getbalance by address

methods.getBalance = async (req, res) => {
    try {
        let address = req.params.address;
        web3.eth.getBalance(address, (err, balance) => {
            if (err) {
                console.log('Could not get balance', err);
            } else {
                balance = web3.utils.fromWei(balance, 'ether').toString()
                res.send({ AvailableBalance: balance });
            }
        });
    } catch (e) {
        console.log("err in getBalance", e)
        res.send({ status: 500, message: e.message })
    }

}


module.exports = methods;