
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
  async getById(userID) {
    if(!ObjectId.isValid(userID)) throw new Error('User Id is invalid')
    let user = await User.findById(userID)
    if(!user) throw new Error("User not found");
    
    const {password, ...res}  = user.toObject()
    return res;
  }

  /**
   * 
   * @param {Partial<User>} userDto 
   * @returns document of user type
   */
  async getUserDetails(userDto) {
    let user = await User.findOne({...userDto});
    if(!user) throw new Error("User not found");
    delete user['password'];
    return user;
  }

  /**
   * @description Fetches all user
   * @returns Array of user document
   */
  async getAll() {
    return (await User.find()).map(user => user.toObject());
  }

  /**
   * @description Add user if email and phone number doesn't already exist
   * @param {{name : string, email:string, phone : string}} userDto 
   * @returns document of user type
   */
  async addOne(userDto) {
    let res = await User.create(userDto);
    const { password, ...user} = res.toObject();
    return user
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