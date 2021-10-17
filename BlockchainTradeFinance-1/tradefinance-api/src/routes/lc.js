const express = require('express');
const fs = require('fs');
const {
    v4: uuidv4
} = require('uuid');
const path = require("path");
// const { lcHistory } = require("../models/schema");
const {
    createLcToMongoDB,
    getAllLcDetailsFromSAP,
    getLcDetailsByIdFromSAP
} = require('../service/lcDetailsMongoDB')

const verify = require('../validation/varifyToken');
const {lc} = require('../apiValidation/lcValidation')
const router = express.Router();

router.post('/create', verify, async (req, res) => {
    //validation uncomment if required
    //
    // const { error, value }  = lcHistory.validate(req.body);
    // if(error) {
    //     return res.status(400).send(error.details[0].message);
    // }
    try {
        let reqData = req.body;
        const {
            error,
            value
        } = lc.validate(reqData);
        if (error) {
            return res.status(400).send({
                status: 'error',
                errorMessage: error.details[0].message
            });
        }
        let response = await createLcToMongoDB(reqData)
        res.send(response);
    } catch (err) {
        console.log('err ',err)
        return res.status(500).send({
            status: 'error',
            errorMessage: err
        });
    }
});

router.get('/getAll', verify, async (req, res) => {
    try {
        let response = await getAllLcDetailsFromSAP()
        res.send(response);

    } catch (err) {
        console.log('err ',err)
        return res.status(500).send({
            status: 'error',
            errorMessage: err
        });
    }
});

router.get('/getbyid/:id', verify, async (req, res) => {
    try {
        const id = req.params.id;
        let response = await getLcDetailsByIdFromSAP(id)
        res.send(response);

    } catch (err) {
        return res.status(500).send({
            status: 'error',
            errorMessage: err
        });
    }
});

module.exports = router;