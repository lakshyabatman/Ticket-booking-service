const express = require('express');
const ticketService = require('../provider');
const HTTPStatusCode = require('../../shared/httpcode');
const router = express.Router();
const cache = require('../../shared/redis');
const { authenticate } = require('../../../middlewares/auth');
const { AuthenicatedWrite } = require('../../../middlewares/roleBaseAuth');
const { Entity } = require('../../shared/enums');


/**
 * 
 * @description: Child routes for ticket module.
 * 
 */

 router.post('/update-timing', async (req,res) => {
  try {
    let newTicket = await ticketService.updateTiming(req.body.user,req.body.ticket,req.body.movieSchedule);
    return res.json({ticket: newTicket})
  }catch(err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({message: err.message})
  }
})

router.get('/get-tickets' ,cache.route() ,async (req,res) => {
  try {
    if(req.query.startTime == undefined || req.query.endTime == undefined || req.query.startTime >req.query.endTime) throw new Error("Fill the range properly")
    let payload = await ticketService.getAllBetweenRange(req.query.startTime,req.query.endTime);
    return res.json({tickets: payload})
  }catch(err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({message: err.message})
  }
})

router.use(AuthenicatedWrite(Entity.TicketEntity))


router.get('/',cache.route(), async (req,res) => {
  try {
    let tickets =  await ticketService.getAll();
    return res.json({tickets});
  }catch(err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})

router.get('/:id',cache.route(), async (req,res) => {
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


router.post('',async (req,res) => {
  try {
    if(req.body.ticket == undefined) throw new Error('Body should have ticket object')
    let ticket = await ticketService.addOne(req.body.ticket.user, req.body.ticket.movieSchedule);
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
  if(req.query.user == undefined)  return res.status(HTTPStatusCode.BAD_REQUEST).json({
    message: 'User Id should be provided'
  })
  //Check if user owns the ticket
  try {
    let ticket = await ticketService.getOne(req.query.id);
    if(ticket.user._id !=req.query.user) throw new Error("You are not authorised to delete this ticket")
  }catch(err){
    return res.status(HTTPStatusCode.NOT_AUTHORISED).json({
      message: err.message
    })
  }

  try {
    let deletedTicket = await ticketService.deleteOne(req.query.id);
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

router.get('/user/:id',cache.route(), async (req,res) => {
  try {

    if(req.params.id == undefined) throw new Error("Ticket id is required")
    let user = await ticketService.getUserDetails(req.params.id);
    return res.json({user})
  } catch (error) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({message: error.message})
  }
  
})







module.exports = router;