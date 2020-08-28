const UserRepository = require('../repository');


/**
 * @description Provider class which wires up repository layer wtih controller layer.
 */
class UserService {
  constructor() {
    this.UserRepository = UserRepository;
  }

  async getOne(userID) {
    let user = await this.UserRepository.getOne(userID);
    if(!user) throw new Error("User doesn't exist");
    return user.toObject();
  }

  async getAll() {
    let users = await this.UserRepository.getAll();
    return users.map(user => user.toObject());
  }

  async addOne(userDto) {
    return await (await this.UserRepository.addOne(userDto)).toObject();
  }

  async deleteOne(userID) {
    let deletedUser = await this.UserRepository.deleteOne(userID);
    if(!deletedUser) throw new Error("User doesn't exist");
    return deletedUser.toObject();
  }

  async deleteAll() {
    return await this.UserRepository.deleteAll();
  }

}

module.exports = new UserService();