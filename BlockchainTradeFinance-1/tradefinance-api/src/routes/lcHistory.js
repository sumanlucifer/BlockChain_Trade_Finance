const express = require('express');
const fs = require('fs');
const {
    v4: uuidv4
} = require('uuid');
const path = require("path");
// const { lcHistory } = require("../models/schema");
const {
    createLcHistoryToMongoDB,
    getAllLcHistoryFromMongoDB,
    getLcHistoryByIdFromMongoDB,
    getLcHistoryByLcTokenFromMongoDB
} = require('../service/lcHistoryMongoDB')

const verify = require('../validation/varifyToken');
const {lcHistory} = require('../apiValidation/lcHistoryValidation')
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
        } = lcHistory.validate(reqData);
        if (error) {
            return res.status(400).send({
                status: 'error',
                errorMessage: error.details[0].message
            });
        }
        let response = await createLcHistoryToMongoDB(reqData)
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
        let response = await getAllLcHistoryFromMongoDB()
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
        let response = await getLcHistoryByIdFromMongoDB(id)
        res.send(response);

    } catch (err) {
        return res.status(500).send({
            status: 'error',
            errorMessage: err
        });
    }
});

router.get('/getLcHistoryByLcToken/:lcToken', verify, async (req, res) => {
    try {
        const lcToken = req.params.lcToken;
        let response = await getLcHistoryByLcTokenFromMongoDB(lcToken);
        res.json({
            success: true,
            status: 200,
            lcDetails: response
        });

    } catch (err) {
        return res.status(500).send({
            status: 'error',
            errorMessage: err
        });
    }
});

module.exports = router;