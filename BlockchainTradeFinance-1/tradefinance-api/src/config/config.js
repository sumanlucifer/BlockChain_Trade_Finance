'use strict'
//let env = 'LOCAL' 
let env = process.env.PORT ? 'SERVER' : 'LINUX_VM';
const props = {
    LOCAL: {
        node: {
            rpc: {
                url: 'http://127.0.0.1',
                port: "8545"
            }
        },
        mongoDB: 'mongodb://10.60.244.149:9001/testdb',
        sapServer:"http://10.60.244.148:8001"

    },
    LINUX_VM: {
        node: {
            rpc: {
                url: 'http://10.60.244.149',
                port: "9000"
            },

            networkid: {
                networkId: "15"
            },
            IPFS: {
                protocol:'http',
                host:'10.60.244.149',
                url: 'http://10.60.244.149',
                port: "9003"
            },
        },
        mongoDB: 'mongodb://10.60.244.149:9001/testdb',
        sapServer:"http://10.60.244.148:8001"

    },
    SERVER: {
        node: {
            rpc: {
                url: 'http://20.40.145.233',                
                port: "9000"
            },

            networkid: {
                networkId: "15"
            },
            IPFS: {
                protocol:'http',
                url: 'http://20.40.145.233',
                host:'20.40.145.233',
                port: "9003"
            },
        },
        mongoDB: 'mongodb://20.40.145.233:9001/testdb',
        sapServer:"http://10.60.244.148:8001"

    }
}

/**
 * Set the environment
 * @param { string } environment - environment of app
 */
let setEnv = (environment) => {
    if (props[environment]) {
        env = environment
    }
}

/**
 * get the appropriate environment config
 */
let getProps = () => {
    return props[env]
}

module.exports = {
    setEnv,
    getProps
}
