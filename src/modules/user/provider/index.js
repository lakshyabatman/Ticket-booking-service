const UserRepository = require('../repository');
const bcrypt = require('bcryptjs')

/**
 * @description Provider class which wires up repository layer wtih controller layer.
 */
class UserService {
  constructor() {
    this.UserRepository = UserRepository;
  }

  async getOne(userID) {
    let user = await this.UserRepository.getById(userID);
    if(!user) throw new Error("User doesn't exist");
    return user;
  }

  async getAll() {
    let users = await this.UserRepository.getAll();
    return users;
  }

  async addOne(userDto) {
    let salt = bcrypt.genSaltSync(10);
    userDto.password =  bcrypt.hashSync(userDto.password, salt);
    let user = await this.UserRepository.addOne(userDto)
    return user;
  }

  async verifyPassword(userDto) {
    let user = await this.UserRepository.getOne({email: userDto.email});
    if(!user) throw new Error("User not found")
    let res = bcrypt.compareSync(userDto.password, user.password);
    return res? user : null;
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