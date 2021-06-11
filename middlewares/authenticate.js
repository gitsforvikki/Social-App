const jwt = require('jsonwebtoken');

let authenticate = async (request , response , next)=>{
    let token = request.header('x-auth-token');
    if(!token){
        response.status(401).json({msg : 'No token provided , Authentication Denied.'});
    }
    try {
        let decode = await jwt.verify(token , process.env.JWT_SECRET_KEY);
        request.user = decode.user;
        next();
    }
    catch (error) {
        console.error(error);
        response.status(500).json({msg : 'Invalid token'});
   }
};

module.exports = authenticate;