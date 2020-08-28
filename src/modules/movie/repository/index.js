
const { Movie } = require('../model');
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * 
 * @description Movie repository is repository layer class which interacts with movie documents to manipulate movie collection.
 * 
 */
class MovieRepository {

  /**
   * @description Fetch movie documents using movie id
   * @param {string} movieID 
   * @returns Document of movie type
   */
  async getOne(movieID) {
    if(!ObjectId.isValid(movieID)) throw new Error('Movie Id is invalid')
    return await Movie.findById(movieID);
  }

  /**
   * @description Fetches all movie
   * @returns Array of movie document
   */
  async getAll() {
    return await Movie.find();
  }

  /**
   * @description Add movie if email and phone number doesn't already exist
   * @param {{name : string}} movieDto 
   * @returns document of movie type
   */
  async addOne(movieDto) {
    return await Movie.create(movieDto);
  }

  /**
   * @description Deletes movie if already exist
   * @param {string} movieID 
   * @returns document of deleted movie
   */
  async deleteOne(movieID) {
    if(!ObjectId.isValid(movieID)) throw new Error('Movie Id is invalid')
    return await Movie.findByIdAndDelete(movieID);
  }

  /**
   * @description Deletes whole movie collection
   */
  async deleteAll() {
    return await Movie.deleteMany({});
  }

}

module.exports = new MovieRepository();