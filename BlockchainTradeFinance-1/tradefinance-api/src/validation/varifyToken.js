const jwt = require('jsonwebtoken');
const TOKEN_SECRET = 'tradeFinanceEY'

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');
    try {
        const varified = jwt.verify(token, TOKEN_SECRET);
        req.user = varified;
        next();
    } catch (err) {
        return res.status(400).send({
            status: 'error',
            errorMessage: 'Invalid token'
        });
    }
}