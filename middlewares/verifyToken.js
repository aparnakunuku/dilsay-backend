const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports.createToken = async (user) => {
    let tokenAge = 60 * 60 * 24 * 10;
    const token = await jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: tokenAge,
    });
    return token;
};

module.exports.isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            } else {
                req.user = decode;
                next();
            }
        });
    } else {
        res.status(401).send({ message: 'No Token' });
    }
};

module.exports.isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.userType === 'Super Admin') {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Super Admin Token' });
    }
};
