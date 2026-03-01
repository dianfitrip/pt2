const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");

module.exports = (req,res,next)=>{
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) return res.status(401).json({message:"Token required"});

  try{
    req.user = jwt.verify(token, secret);
    next();
  }catch(err){
    return res.status(403).json({message:"Invalid token"});
  }
};
