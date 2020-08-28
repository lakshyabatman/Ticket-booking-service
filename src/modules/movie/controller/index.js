const express = require('express');
const movieService = require('../provider');
const HTTPStatusCode = require('../../shared/httpcode');
const router = express.Router();
const cache = require('../../shared/redis')



/**
 * 
 * @description: Child routes for movie module.
 * 
 */

router.get('/:id',cache.route(), async (req,res) => {
    if(req.params.id == undefined) return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: 'Movie Id should be provided'
    })
    try {
      let movie = await movieService.getOne(req.params.id);
      return res.json(movie);
    }catch(err) {
      return res.status(HTTPStatusCode.NOT_FOUND).json({
        message: err.message
      })
    }
})

router.get('/',cache.route(), async (req,res) => {
  try {
    let movies =  await movieService.getAll();
    return res.json({movies});
  }catch(err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})


router.post('',async (req,res) => {
  try {
    if(req.body.movie == undefined) throw new Error('Body should have movie object')
    let movie = await movieService.addOne(req.body.movie);
    return res.json({movie});
  } catch (err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})


router.delete('', async (req,res) => {
  if(req.query.id == undefined)  return res.status(HTTPStatusCode.BAD_REQUEST).json({
    message: 'Movie Id should be provided'
  })
  try {
    let deletedMovie = await movieService.deleteOne(req.query.id);
    if(!deletedMovie) return res.status(HTTPStatusCode.NOT_FOUND).json({ message: 'Movie not found'});
    return res.json({movie: deletedMovie});
  } catch (err) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({
      message: err.message
    })
  }
})

router.delete('/delete-all' ,async (req,res) => {
  try {
    let result = await movieService.deleteAll();
    return res.json({deletedCount : result.deletedCount});
  } catch (error) {
    return res.status(HTTPStatusCode.BAD_REQUEST).json({message: 'Failed to delete movies'})
  }
})


module.exports = router;