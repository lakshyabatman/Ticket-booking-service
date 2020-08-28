
const { User } = require('../model');
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * 
 * @description User repository is repository layer class which interacts with user documents to manipulate user collection.
 * 
 */
class UserRepository {

  /**
   * @description Fetch user documents using user id
   * @param {string} userID 
   * @returns Document of user type
   */
  async getOne(userID) {
    if(!ObjectId.isValid(userID)) throw new Error('User Id is invalid')
    return await User.findById(userID);
  }

  /**
   * @description Fetches all user
   * @returns Array of user document
   */
  async getAll() {
    return await User.find();
  }

  /**
   * @description Add user if email and phone number doesn't already exist
   * @param {{name : string, email:string, phone : string}} userDto 
   * @returns document of user type
   */
  async addOne(userDto) {
    return await User.create(userDto);
  }

  /**
   * @description Deletes user if already exist
   * @param {string} userID 
   * @returns document of deleted user
   */
  async deleteOne(userID) {
    if(!ObjectId.isValid(userID)) throw new Error('User Id is invalid')
    return await User.findByIdAndDelete(userID);
  }

  /**
   * @description Deletes whole user collection
   */
  async deleteAll() {
    return await User.deleteMany({});
  }

}

module.exports = new UserRepository();