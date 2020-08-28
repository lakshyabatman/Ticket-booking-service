const express = require('express');
const ticketService = require('../provider');
const HTTPStatusCode = require('../../shared/httpcode');
const router = express.Router();


/**
 * 
 * @description: Child routes for ticket module.
 * 
 */

router.get('/:id', async (req,res) => {
    if(req.params.id == undefined) return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: 'Ticket Id should be provided'
    })
    try {
      let ticket = await ticketService.getOne(req.params.id);
      return res.json(ticket);
    }catch(err) {
      return res.status(HTTPStatusCode.NOT_FOUND).json({
        message: err.message
      })
    }
})

router.get('/', async (req,res) => {
  try {
    let tickets =  await ticketService.getAll();
    return res.json({tickets});
  }catch(err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})


router.post('',async (req,res) => {
  try {
    if(req.body.ticket == undefined) throw new Error('Body should have ticket object')
    let ticket = await ticketService.addOne(req.body.ticket);
    return res.json({ticket});
  } catch (err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})


router.delete('', async (req,res) => {
  if(req.query.id == undefined)  return res.status(HTTPStatusCode.BAD_REQUEST).json({
    message: 'Ticket Id should be provided'
  })
  try {
    let deletedTicket = await ticketService.deleteOne(req.query.id);
    if(!deletedTicket) return res.status(HTTPStatusCode.NOT_FOUND).json({ message: 'Ticket not found'});
    return res.json({ticket: deletedTicket});
  } catch (err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})

router.delete('/delete-all' ,async (req,res) => {
  try {
    let result = await ticketService.deleteAll();
    return res.json({deletedCount : result.deletedCount});
  } catch (error) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({message: 'Failed to delete tickets'})
  }
})


module.exports = router;