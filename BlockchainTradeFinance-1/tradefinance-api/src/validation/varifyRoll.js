const fs = require('fs');
const path = require("path");


module.exports = roles => async (req, res, next) => {
    fs.readFile(path.resolve(__dirname, '../db/user.json'), 'utf8', (err, data) => {
        const fileData = JSON.parse(data);
        if (!fileData) return res.status(401).send({
            status: 'error',
            errorMessage: 'Unauthorized'
        });
        const user = fileData.filter(x => x.id === req.user.id);
        if (user && user.length > 0) {
            if (roles.includes(user[0].role)) {
                return next();
            }
        }
        return res.status(401).send({
            status: 'error',
            errorMessage: 'Unauthorized'
        });
    })

}