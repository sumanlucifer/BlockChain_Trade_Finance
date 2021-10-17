const winston = require('winston');
module.exports = (err, req, res, next) => {
    //Log the exception
    // winston.error(err.message, err);
    console.log(err);
    res.status(500).send({
        status: "error",
        errorMessage: err
    });
};