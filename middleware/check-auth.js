
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log( req.signedCookies.jwt)
    try {
        if( req.signedCookies.jwt) {
        const token =  req.signedCookies.jwt;
        const decoded = jwt.verify(token, 'SupoerComplexKey');
        req.userData = decoded;
       // console.log(req.userData);
        next();
        }
        else {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
       
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};