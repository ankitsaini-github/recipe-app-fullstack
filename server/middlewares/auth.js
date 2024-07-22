const Users = require('../models/users');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;

exports.authenticateUser = async(req,res,next)=>{
  try {
    const token = req.header('Authorization')
    const {userId} = jwt.verify(token, secretKey)
    const user = await Users.findByPk(userId)
    if(!user){
      throw new Error('User not found.');
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('USER NOT AUTHORIZED !')
    res.status(401).json({error:'USER NOT AUTHORIZED !',success:false,})
  }
};

exports.authenticateAdmin = async(req,res,next)=>{
  try {
    const token = req.header('Authorization')
    const {userId} = jwt.verify(token, secretKey)
    const user = await Users.findByPk(userId)
    if(!user){
      throw new Error('User not found.');
    }
    if(!user.isAdmin){
      throw new Error('No Admin Rights.');
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('USER NOT AUTHORIZED !')
    res.status(401).json({error:'USER NOT AUTHORIZED !',success:false,})
  }
};