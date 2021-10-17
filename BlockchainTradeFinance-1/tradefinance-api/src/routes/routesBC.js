/** ***********************************************************************************************
 * Presents an API which can be used to control Blockchain letter of credit workflow funcationalities
 *
 * @author Gaurav Kaushik
 ************************************************************************************************** */

const router = require('express').Router();
const verify = require('../validation/varifyToken');
const config = require('../config/config') // require the config file
config.setEnv(process.argv[2]) //set the environment to local or production
const Config = require('../config/config').getProps()
const multer = require('multer');
const path = require('path');
let uploadDir = path.join(__dirname, 'uploads/');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


var upload = multer({
    storage: storage
});



const {
    createLC,
    getLcDataByIDCtrl,
    updateLCStatus,
    getLetterOfCreditArrayLength,
    getLCId,
    rejectLc,
    landingPage,
    getfilefromIPFS,
    uploadBillCtrl
} = require('../ethereum/letterOfCredit');
const {
    createUserCtrl,
    getUser,
    getUserbyaddr,
    getallaccounts,
    getBalance,
    loginCtrl,
    assignRole
} = require('../ethereum/users')
const {
    tokenTransfer,
    burnToken
} = require('../ethereum/lcWorkflow');

router.post('/createLC', verify, createLC);
router.get('/getlcdatabyID/:lcid', verify, getLcDataByIDCtrl);
router.put('/updateLCStatus', verify, updateLCStatus);
router.get('/LClength', verify, getLetterOfCreditArrayLength);
router.get('/getLCId/:LCTokenNumber', verify, getLCId);
router.post('/tokenTransfer/', verify, tokenTransfer);
router.post('/burnToken', burnToken);

router.get('/landingPage', landingPage);

router.post('/createUser', createUserCtrl);
router.post('/login', loginCtrl);
router.get('/getUser', verify, getUser);
router.get('/getUserbyaddr', verify, getUserbyaddr);
router.get('/getallUsers', verify, getallaccounts);
router.get('/getBalance/:address', verify, getBalance);
router.post('/assignRole', assignRole);
router.post('/lcreject', verify, rejectLc);


router.post("/uploadBill", upload.single('bill'), verify, uploadBillCtrl);
router.get('/getfilefromIPFS/:lcid', verify, getfilefromIPFS);


module.exports = router;