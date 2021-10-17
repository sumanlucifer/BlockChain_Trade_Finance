var jsonfile = require("jsonfile");
const jwt = require('jsonwebtoken');
const Web3 = require('web3')
const config = require('../config/config') // require the config file
config.setEnv(process.argv[2]) //set the environment to local or production
const Config = require('../config/config').getProps() //get the properties of environment
var rpcURL = Config.node.rpc.url + ':' + Config.node.rpc.port;

const TOKEN_SECRET = 'tradeFinanceEY'


const networkId = (`${Config.node.networkid.networkId}`)
let web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

const Names_file = jsonfile.readFileSync("./build/contracts/Names.json");
const NamesContract = new web3.eth.Contract(Names_file.abi, Names_file.networks[networkId].address);


const Auth_file = jsonfile.readFileSync("./build/contracts/Auth.json")
const AuthContract = new web3.eth.Contract(Auth_file.abi, Auth_file.networks[networkId].address);

async function gettingrole(user) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("entering getrole");
            console.log(user);
            let role = await AuthContract.methods.getRole(user).call();
            return resolve(role);
        } catch (err) {
            return reject(err);
        }
    });
}

async function userMapper(userData, role, token) {
    const user = {};
    user.email = userData[0];
    user.name = userData[1]
    user.address = userData[2];
    user.location = userData[4];
    user.token = token;
    user.role = role;
    return user;
}

const createUser = (name, email, location, password, address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const byteEmail = web3.utils.toHex(email);
            let userStatus = await NamesContract.methods.getUser(byteEmail).call()
            if (userStatus[1] == "0x0000000000000000000000000000000000000000") {
                let walletAddress = await web3.eth.personal.newAccount(password)
                const unlocked = await web3.eth.personal.unlockAccount(walletAddress, password);
                let userDetails = await NamesContract.methods.setUser(byteEmail, walletAddress, name, location).send({ from: address, gas: 5000000, value: 0 });
                resolve({ status: 200, message: "User Created sucessfully", userDetails: userDetails });
            }
            else {
                resolve({ status: 403, message: "Sorry UserName already exists" })
            }
        } catch (e) {
            console.log("err in registerUser", e)
            reject({ status: 500, message: e.message })

        }
    });
}



const login = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const byteEmail = web3.utils.toHex(email);
            let usercontract = await NamesContract.methods.getUser(byteEmail).call();
            let name = usercontract[0];
            if (usercontract['1'] == "0x0000000000000000000000000000000000000000") {
                //return "user doesnot exist or please check the username or password";
                resolve({ status: 500, message: "User does not exist" });
            }
            else {
                let user = [email, name, usercontract['1'], password, usercontract['2']];
                console.log(user);
                if (email == 'owner') {
                    const role = await gettingrole(user[2]);
                    const token = jwt.sign({ email, role, name }, TOKEN_SECRET);
                    const userMapped = await userMapper(user, role, token);
                    resolve({ status: 200, message: "Login Successful", data: userMapped })
                }
                else {
                    console.log("unlocked");
                    const unlocked = await web3.eth.personal.unlockAccount(user[2], user[3]);
                    if (unlocked) {
                        const role = await gettingrole(user[2]);
                        const token = jwt.sign({ email, role, name }, TOKEN_SECRET);
                        const userMapped = await userMapper(user, role, token);
                        resolve({ status: 200, message: "Login Successful", data: userMapped })
                    }

                    else {
                        console.log('err in login');
                        resolve({ status: 500, message: "Wrong Password" })
                    }
                }
            }


        } catch (e) {
            console.log("err in Login", e)
            reject({ status: 500, message: "Wrong Password" });
        }
    });
}

exports.createUser = createUser;
exports.login = login;