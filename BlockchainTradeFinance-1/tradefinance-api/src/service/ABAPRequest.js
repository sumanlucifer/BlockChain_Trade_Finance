const axios = require('axios');
const xsenv = require('@sap/xsenv');
const rp = require('request-promise');
const {
    sapError
} = require('./errorHandling')
const Config = require('../config/config').getProps()
// console.log(config)
const {
    reject
} = require('lodash');

const _include_headers = function (body, response, resolveWithFullResponse) {
    return {
        'headers': response.headers,
        'data': body
    };
};
const {
    createLcHistoryToMongoDB
} = require('./lcHistoryMongoDB');

const {
    updateStatus,
    burnLcToken
} = require('./lcService')
let proxy_url;

const getHeaders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            var headers = {};
            const onPremCred = 'KCALILAN:QWaszx01!';

            if (process.env.PORT) {
                const conn_service = xsenv.getServices({
                    conn: {
                        tag: 'connectivity'
                    }
                }).conn;
                const uaa_service = xsenv.getServices({
                    uaa: {
                        tag: 'xsuaa'
                    }
                }).uaa;
                const sUaaCredentials = conn_service.clientid + ':' + conn_service.clientsecret;
                proxy_url = 'http://' + conn_service["onpremise_proxy_host"] + ':' + conn_service["onpremise_proxy_port"];
                // const onPremCred = 'KCALILAN:QWaszx01!';

                rp({
                    uri: uaa_service.url + '/oauth/token?grant_type=client_credentials&client_id=' + conn_service.clientid,
                    method: 'GET',
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(sUaaCredentials).toString('base64'),
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    // form: {
                    //     'client_id': conn_service.clientid,
                    //     'grant_type': 'client_credentials'
                    // }
                }).then((data) => {
                    token = JSON.parse(data).access_token;
                    const config = {
                        proxy: proxy_url,
                        headers: {
                            'Authorization': 'Basic ' + Buffer.from(onPremCred).toString('base64'),
                            'Proxy-Authorization': 'Bearer ' + token,
                            'SAP-Connectivity-SCC-Location_ID': 'TradeFinanceAbap',
                            'Content-type': 'application/json',
                            'x-csrf-token': 'fetch',
                            'accept': 'application/json',
                        },
                        json: true,
                        transform: _include_headers,

                    }

                    // headers = {
                    //     'Authorization': 'Basic ' + Buffer.from(onPremCred).toString('base64'),
                    //     'Proxy-Authorization': 'Bearer ' + token,
                    //     'SAP-Connectivity-SCC-Location_ID': 'TradeFinanceAbap',
                    //     'Content-type': 'application/json',
                    //     'x-csrf-token': 'fetch',
                    //     'accept': 'application/json',
                    //     // 'Content-Type': 'application/json'

                    // }
                    resolve(config)

                }).catch((err)=>{
                    reject((err));

                })
            } else {
                const config = {
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(onPremCred).toString('base64'),
                        // 'Proxy-Authorization': 'Bearer ' + token,
                        // 'SAP-Connectivity-SCC-Location_ID': 'TradeFinanceAbap',
                        'Content-type': 'application/json',
                        'x-csrf-token': 'fetch',
                        'accept': 'application/json',
                    },
                    json: true,
                    transform: _include_headers,

                }
                resolve(config)

            }
        } catch (err) {
            reject(sapError(err));
        }
    })


}


const getCredentials = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const username = 'KCALILAN';
            const password = 'QWaszx01!';
            var Authorization = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
            getHeaders().then(async (config) => {
                // const configFetchCSRF = {
                //     method: 'get',
                //     url: 'http://10.60.244.148:8001/sap/opu/odata/sap/ZTFPOC_LOC_SRV',
                //     headers: {
                //         "Authorization": Authorization,
                //         "Content-Type": "application/json",
                //         "Accept": "application/json",
                //         "x-csrf-token": "fetch" // get CSRF Token for post or update
                //     }
                // };
                config.uri = `${Config.sapServer}/sap/opu/odata/sap/ZTFPOC_LOC_SRV`;
                config.method = 'get';

                const response = await rp(config);
                console.log('response.headers ', response.headers)
                const csrf = response.headers['x-csrf-token']

                console.log('csrfToken ', csrf)
                var cookies = '"';
                for (var i = 0; i < response.headers["set-cookie"].length; i++) {
                    cookies += response.headers["set-cookie"][i] + ";";
                }

                // const config = {
                //     headers: {
                //         Authorization,
                //         'x-csrf-token': csrf,
                //         "Content-Type": "application/json",
                //         "Accept": "application/json",
                //         cookie: cookies
                //     }
                // }
                // config.headers = headers;
                config.headers['x-csrf-token'] = csrf;
                config.headers['cookie'] = cookies;
                // config.headers['proxy'] =

                // console.log('csrf ', csrf)
                return resolve(config);

            }).catch((err)=>{
                reject((err));

            })
        } catch (err) {
            console.log('error in 148', err)
            reject(sapError(err))
        }
    })

}

const sendLcNotificationToSAP = async (data, userDetails) => {
    return new Promise(async (resolve, reject) => {

        try {
            const abapUrl = `${Config.sapServer}/sap/opu/odata/sap/ZTFPOC_LOC_SRV/LOCreditSet`;
            const method = 'POST'

            let payload = {};

            const BuyerMetadata = JSON.parse(data.BuyerMetadata)
            const SellerMetadata = JSON.parse(data.SellerMetadata)
            const ProductMetadata = JSON.parse(data.ProductMetadata)
            payload.PROCESS_CODE = userDetails.role == 3 ? '100' : '200';
            payload.LC_NUMBER = data.LCTokenNumber;
            payload.END_DATE = ProductMetadata.END_DATE;
            payload.CHARGES = ProductMetadata.INTEREST_RATE;
            payload.PLACE_EXP = BuyerMetadata.PLACE_EXP;
            payload.COUNTRY = BuyerMetadata.COUNTRY;
            payload.PARTNER = BuyerMetadata.PARTNER;
            payload.COCODE = BuyerMetadata.COCODE;
            payload.VAL_CLASS = BuyerMetadata.VAL_CLASS;
            payload.CURRENCY = BuyerMetadata.CURRENCY;

            payload.PROD_TYPE = ProductMetadata.PROD_TYPE;
            payload.PROD_QTY = ProductMetadata.PROD_QTY;
            payload.PROD_PRICE = ProductMetadata.PROD_PRICE;
            payload.TOTAL_VAL = ProductMetadata.TOTAL_VAL;
            payload.BUY_NAME = BuyerMetadata.BUY_NAME;
            payload.BUY_COMPANY = BuyerMetadata.BUY_COMPANY;
            payload.BUY_ADDRESS = BuyerMetadata.COM_ADDR;
            payload.BUY_IBAN = BuyerMetadata.BUY_IBAN;
            payload.BUY_BANK = BuyerMetadata.BUY_BANK;
            payload.BUY_SWIFT = BuyerMetadata.BUY_SWIFT;
            payload.SEL_NAME = SellerMetadata.SEL_NAME;
            payload.SEL_COMPANY = SellerMetadata.SEL_COMPANY;
            payload.SEL_ADDRESS = SellerMetadata.COM_ADDR;
            payload.SEL_IBAN = SellerMetadata.SEL_IBAN;
            payload.SEL_BANK = SellerMetadata.SEL_BANK;
            console.log('printing payload', JSON.stringify(payload));
            // payload.SEL_SWIFT = SellerMetadata.SEL_SWIFT;
            const config = await getCredentials();
            // console.log('config ', config)
            config.uri = `${Config.sapServer}/sap/opu/odata/sap/ZTFPOC_LOC_SRV/LOCreditSet`;
            config.method = 'post';
            config.body = payload;
            const response = await rp(config);
            // console.log('response ', response)
            // await sendPaymentDetails(data.LCId, data.OwnerAddress, data.LCTokenNumber,'1710','52');
            // const response = await axios({
            //     url,
            //     method,
            //     data,
            //     headers: {
            //         Authorization,
            //         'x-csrf-token': csrfToken,
            //         'accept': 'application/json',
            //         'Content-Type': 'application/json'
            //     }
            // })
            console.log('LC Creation details sent to ABAP Successfully');
            return resolve('LC Creation details sent to ABAP Successfully');
        } catch (err) {
            // console.log('Error in sending LC Creation details ', err);

            return reject(sapError(err));
        }
    });
}

const sendPaymentNotificationToSAP = async (LCId, OwnerAddress, LC_NUMBER_1, COCODE, LC_STATUSCODE, LC_STATUS, userDetails) => {
    return new Promise(async (resolve, reject) => {

        try {
            const abapUrl = `${Config.sapServer}/sap/opu/odata/sap/ZTFPOC_LOC_SRV/LOCPaymentSet`;
            const method = 'POST';
            const config = await getCredentials();
            const lcStatus = LC_STATUSCODE == '52' ? 'COMPLETED' : LC_STATUS;
            const data = {
                LC_NUMBER_1,
                COCODE,
                LC_STATUS: LC_STATUSCODE
            }
            config.uri = abapUrl;
            config.method = 'post';
            config.body = data;
            const response = await rp(config);

            // const response = await axios.post(abapUrl, data, config);
            if (LC_STATUSCODE == '52') {
                const responseData = response.data.d;
                const {
                    PAYMENT_DATE,
                    PAYMENT_TIME
                } = responseData

                console.log('responseData 251', JSON.stringify(responseData));
                var year = parseInt(PAYMENT_DATE.slice(0, 4));
                var month = parseInt(PAYMENT_DATE.slice(4, 6));
                var day = parseInt(PAYMENT_DATE.slice(6, 8));
                var time = PAYMENT_TIME.split(':')
                var date = new Date(year, month-1, day, parseInt(time[0]), parseInt(time[1]), parseInt(time[2])).toISOString();
                const payload = {
                    LCId,
                    OwnerAddress,
                    LCTokenNumber: LC_NUMBER_1,
                    LCStatus: lcStatus,
                    ChangedBy: userDetails.email,
                    ChangedOn: date,
                    ChangedByName: lcStatus == "COMPLETED" ? 'L/C Token Burned' : userDetails.name,

                    ChangeType: 'payment info'

                }
                // console.log('payload ',payload)
                const historyResponse = await createLcHistoryToMongoDB(payload);
            }
            // console.log('historyResponse ',historyResponse)
            const updateStatusResponse = await updateStatus(LCId, OwnerAddress, lcStatus);
            // console.log('updateStatusResponse ',updateStatusResponse)

            const burnLcTokenResponse = await burnLcToken(LCId, OwnerAddress);
            //console.log('burnLcTokenResponse ', burnLcTokenResponse)

            console.log('Payment details updated successfully')
            return resolve('Payment details updated successfully');
            // console.log('historyResponse ',historyResponse)
            // console.log('response for payment ', responseData)
        } catch (err) {
            console.log('error in paydetails ', err);
            return reject(sapError(err));
        }
    })

};
// sendPayload('','')
// sendPaymentDetails('Test_Odata77', '1710', '52');
exports.sendLcNotificationToSAP = sendLcNotificationToSAP;
exports.sendPaymentNotificationToSAP = sendPaymentNotificationToSAP;