const express = require('express');
const movieScheduleService = require('../provider');
const HTTPStatusCode = require('../../shared/httpcode');
const router = express.Router();
const cache = require('../../shared/redis');
const { AuthenicatedWrite } = require('../../../middlewares/roleBaseAuth');
const { Entity } = require('../../shared/enums');


/**
 * 
 * @description: Child routes for movieSchedule module.
 * 
 */

router.get('/:id',cache.route(), async (req,res) => {
    if(req.params.id == undefined) return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: 'MovieSchedule Id should be provided'
    })
    try {
      let movieSchedule = await movieScheduleService.getOne(req.params.id);
      return res.json(movieSchedule);
    }catch(err) {
      return res.status(HTTPStatusCode.NOT_FOUND).json({
        message: err.message
      })
    }
})

router.get('/',cache.route(), async (req,res) => {
  try {
    let movieSchedules =  await movieScheduleService.getAll();
    return res.json({movieSchedules});
  }catch(err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})

router.use(AuthenicatedWrite(Entity.MovieScheduleEntity))
router.post('',async (req,res) => {
  try {
    if(req.body.movieSchedule == undefined) throw new Error('Body should have movieSchedule object')
    let movieSchedule = await movieScheduleService.addOne(req.body.movieSchedule);
    return res.json({movieSchedule});
  } catch (err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})


router.delete('', async (req,res) => {
  if(req.query.id == undefined)  return res.status(HTTPStatusCode.BAD_REQUEST).json({
    message: 'MovieSchedule Id should be provided'
  })
  try {
    let deletedMovieSchedule = await movieScheduleService.deleteOne(req.query.id);
    if(!deletedMovieSchedule) return res.status(HTTPStatusCode.NOT_FOUND).json({ message: 'MovieSchedule not found'});
    return res.json({movieSchedule: deletedMovieSchedule});
  } catch (err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})

router.delete('/delete-all' ,async (req,res) => {
  try {
    let result = await movieScheduleService.deleteAll();
    return res.json({deletedCount : result.deletedCount});
  } catch (error) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({message: 'Failed to delete movieSchedules'})
  }
})


module.exports = router;