const express = require('express');
const userService = require('../provider');
const HTTPStatusCode = require('../../shared/httpcode');
const router = express.Router();


/**
 * 
 * @description: Child routes for user module.
 * 
 */

router.get('/:id', async (req,res) => {
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

router.get('/', async (req,res) => {
  try {
    let users =  await userService.getAll();
    return res.json({users});
  }catch(err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})


router.post('',async (req,res) => {
  try {
    if(req.body.user == undefined) throw new Error('Body should have user object')
    let user = await userService.addOne(req.body.user);
    return res.json({user});
  } catch (err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})


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

router.delete('/delete-all' ,async (req,res) => {
  try {
    let result = await userService.deleteAll();
    return res.json({deletedCount : result.deletedCount});
  } catch (error) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({message: 'Failed to delete users'})
  }
})


module.exports = router;