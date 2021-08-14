const jwt = require('jsonwebtoken');
const HTTPStatusCode = require('../../modules/shared/httpcode');

const userService = require('../../modules/user/provider');

let authenticate = async (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token) return res.status(401).json({message: 'Access Token is required to access private routes'});

    try {
        const decoded = jwt.verify(token, process.env['JWT_SECRET'])
        if(!decoded || !decoded.id)  throw new Error("Failed to authorise the user");
        let user = await userService.getOne(decoded.id);
        req.user = user;
        next()
    }catch(err) {
        console.error(err.message)
        return res.status(HTTPStatusCode.NOT_AUTHORISED).json({message: 'Unnauthorised'})
    }
}

module.exports = {
    authenticate
}