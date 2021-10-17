const lcDAO = require('../dao/lc')
const createLcToMongoDB = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('lcDAO ', lcDAO)
            const createResponse = await lcDAO.create(data);
            resolve({
                status: 'success',
                data: data
            })
        } catch (err) {
            console.log('errrrr ', err)
            resolve({
                status: 'error',
                errorMessage: err
            })
        }

    })
}
const getAllLcDetailsFromMongoDB = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const getAllResponse = await lcDAO.getAll();
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
const getLcDetailsByIdFromMongoDB = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const LCid = {LCTokenNumber:id}
            console.log('reqst service')
            const Response = await lcDAO.getById(id);
            resolve(Response)
        } catch (err) {
            reject(err)
        }

    })

}
const deleteLcDetailsByLcIdFromMongoDB = (lcId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const LCid = {LCTokenNumber:id}
            console.log('reqst service')
            const Response = await lcDAO.deleteByLcId(lcId);
            resolve(Response);
        } catch (err) {
            reject(err);
        }

    })

}
module.exports.createLcToMongoDB = createLcToMongoDB;
module.exports.getAllLcDetailsFromMongoDB = getAllLcDetailsFromMongoDB;
module.exports.getLcDetailsByIdFromMongoDB = getLcDetailsByIdFromMongoDB;
module.exports.deleteLcDetailsByLcIdFromMongoDB = deleteLcDetailsByLcIdFromMongoDB;

