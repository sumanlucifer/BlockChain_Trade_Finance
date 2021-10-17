const lcHistoryDAO = require('../dao/lcHistory')
const createLcHistoryToMongoDB = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('lcHistoryDAO ', lcHistoryDAO)
            const createResponse = await lcHistoryDAO.create(data);
            resolve({
                status: 'success',
                data: data
            })
        } catch (err) {
            console.log('lcHistoryDAO ', lcHistoryDAO);

            console.log('errrrr ', err);
            resolve({
                status: 'error',
                errorMessage: err
            })
        }

    })

}
const getAllLcHistoryFromMongoDB = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const getAllResponse = await lcHistoryDAO.getAll();
            resolve({
                status: 'success',
                data: getAllResponse
            })
        } catch (err) {
            console.log(err)
            resolve({
                status: 'error',
                errorMessage: err
            })
        }

    })

}
const getLcHistoryByIdFromMongoDB = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Response = await lcHistoryDAO.getById(id);
            resolve({
                status: 'success',
                data: Response
            })
        } catch (err) {
            resolve({
                status: 'error',
                errorMessage: err
            })
        }

    })

}
const getLcHistoryByIdOneFromMongoDB = (LCid) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const LCid = {LCTokenNumber:id}
            console.log('reqst service')
            const Response = await lcHistoryDAO.getByIdOne(LCid);
            resolve(Response);
        } catch (err) {
            reject(err);
        }

    })

}

const getLcHistoryByLcTokenFromMongoDB = (lcToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const LCid = {LCTokenNumber:id}
            console.log('reqst service')
            const Response = await lcHistoryDAO.getByIdLcToken(lcToken);
            resolve(Response);
        } catch (err) {
            reject(err);
        }

    })

}
const deleteLcHistoryByLcIdFromMongoDB = (lcId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const LCid = {LCTokenNumber:id}
            console.log('reqst service')
            const Response = await lcHistoryDAO.deleteByLcId(lcId);
            resolve(Response);
        } catch (err) {
            reject(err);
        }

    })

}

module.exports.createLcHistoryToMongoDB = createLcHistoryToMongoDB;
module.exports.getAllLcHistoryFromMongoDB = getAllLcHistoryFromMongoDB;
module.exports.getLcHistoryByIdFromMongoDB = getLcHistoryByIdFromMongoDB;
module.exports.getLcHistoryByIdOneFromMongoDB = getLcHistoryByIdOneFromMongoDB
module.exports.getLcHistoryByLcTokenFromMongoDB = getLcHistoryByLcTokenFromMongoDB;
module.exports.deleteLcHistoryByLcIdFromMongoDB = deleteLcHistoryByLcIdFromMongoDB;