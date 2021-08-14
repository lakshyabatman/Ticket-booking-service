const express = require('express');
const userService = require('../provider');
const HTTPStatusCode = require('../../shared/httpcode');
const router = express.Router();
const cache = require('../../shared/redis')
const jwt = require('jsonwebtoken');
const { authenticate } = require('../../../middlewares/auth');
const { AuthenicatedWrite } = require('../../../middlewares/roleBaseAuth');
const { Entity } = require('../../shared/enums');

/**
 * 
 * @description: Child routes for user module.
 * 
 */

//Register
router.post('',async (req,res) => {
  try {
    if(req.body.user == undefined) throw new Error('Body should have user object')
    let  newUser = req.body.user
    if(!newUser || !newUser.email || !newUser.password || !newUser.name ) throw new Error("Missing fields")

    let user = await userService.addOne(newUser);
    let token = jwt.sign({id: user._id}, process.env['JWT_SECRET'])
    return res.json({user,token});
  } catch (err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})

//Login
router.post('/login', async (req, res) => {
  try {
    let userPayload = req.body.user;
    if(!userPayload || !userPayload.email || !userPayload.password) throw new Error("User field is missing")
    let user = await userService.verifyPassword(userPayload);
    if(res) {
      let token = jwt.sign({id: user._id}, process.env['JWT_SECRET'])
      return res.json({token})
    }else {
      return res.status(HTTPStatusCode.NOT_AUTHORISED).json({message: 'Invalid password'})
    }
  }catch(err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})  


router.use(authenticate)
router.get('/:id', cache.route(), async (req,res) => {
    if(req.params.id == undefined) return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: 'User Id should be provided'
    })
    try {
      let user = await userService.getOne(req.params.id);
      return res.json(user);
    }catch(err) {
      return res.status(HTTPStatusCode.NOT_FOUND).json({
        message: err.message
      })
    }
})

router.get('/',cache.route(), async (req,res) => {
  try {
    let users =  await userService.getAll();
    return res.json({users});
  }catch(err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})



router.use(AuthenicatedWrite(Entity.UserEntity))

router.delete('', async (req,res) => {
  if(req.query.id == undefined)  return res.status(HTTPStatusCode.BAD_REQUEST).json({
    message: 'User Id should be provided'
  })
  try {
    let deletedUser = await userService.deleteOne(req.query.id);
    if(!deletedUser) return res.status(HTTPStatusCode.NOT_FOUND).json({ message: 'User not found'});
    return res.json({user: deletedUser});
  } catch (err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})


router.delete('/delete-all',async (req,res) => {
  try {
    let result = await userService.deleteAll();
    return res.json({deletedCount : result.deletedCount});
  } catch (error) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({message: 'Failed to delete users'})
  }
})


module.exports = router;