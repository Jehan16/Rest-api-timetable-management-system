const jwt = require('jsonwebtoken');

exports.logged_in_user = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}

exports.restrict = (role) => {
    return (req, res, next) => {
        if (req.userData.role !== role) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }
        next()
    }
}