
const { MovieSchedule } = require('../model');
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * 
 * @description MovieSchedule repository is repository layer class which interacts with movieSchedule documents to manipulate movieschedule collection.
 * 
 */
class MovieScheduleRepository {

  /**
   * @description Fetch movieSchedule documents using movieSchedule id
   * @param {string} movieScheduleID 
   * @returns Document of movieSchedule type
   */
  async getOne(movieScheduleID) {
    if(!ObjectId.isValid(movieScheduleID)) throw new Error('MovieSchedule Id is invalid')
    return await MovieSchedule.findById(movieScheduleID);
  }

  /**
   * @description Fetches all movieSchedule
   * @returns Array of movieSchedule document
   */
  async getAll() {
    return await MovieSchedule.find().populate('movie')
  }

  /**
   * @description Add movieSchedule 
   * @param {{movieID: string,startTime: string,endTime: string}} movieScheduleDto 
   * @returns document of movieSchedule type
   */
  async addOne(movieScheduleDto) {
    return await (await MovieSchedule.create(movieScheduleDto)).populate('movie').execPopulate();
  }

  /**
   * @description Deletes movieSchedule if already exist
   * @param {string} movieScheduleID 
   * @returns document of deleted movieSchedule
   */
  async deleteOne(movieScheduleID) {
    if(!ObjectId.isValid(movieScheduleID)) throw new Error('MovieSchedule Id is invalid')
    return await MovieSchedule.findByIdAndDelete(movieScheduleID);
  }

  /**
   * @description Deletes whole movieSchedule collection
   */
  async deleteAll() {
    return await MovieSchedule.deleteMany({});
  }

}

module.exports = new MovieScheduleRepository();