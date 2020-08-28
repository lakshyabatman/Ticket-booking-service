const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const {User}  = require('../model');
const UserRepository = require('./index');
var ObjectID = require('mongodb').ObjectID;


describe('--- User Repository ---', () => {
  const testUser = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    id: faker.random.uuid(),
    phone: '0123456789'
  }


  describe('>> Add One user', () => {
    let mockModel = sinon.stub(User,"create");
    mockModel.onCall(0).returns(testUser);
    mockModel.onCall(1).throws();

    it('should add user' ,async () => {
      const user = await UserRepository.addOne({name: testUser.name,email:testUser.email, phone: testUser.phone});
      expect(user).to.not.undefined;
      expect(mockModel.calledOnce).to.be.true;
      expect(user.name).to.be.equal(testUser.name);
    })

    it('throw error if user name is undefined' ,async() => {
      try {
        const user = await UserRepository.addOne({email:testUser.email, phone: testUser.phone});
      }catch(err) {
        expect(err.message).to.not.undefined;
      }
    })
  })


  describe('>> Fetch Single User', () => {
    let mockModel = sinon.stub(User,"findById");
    mockModel.onCall(0).returns(testUser);
    mockModel.onCall(1).returns(testUser);
    it('should fetch single user' , async () => {
      let user = await UserRepository.getOne(new ObjectID().toHexString());
      expect(user).to.be.not.undefined;

    })

    it('should throw if user id is not valid' , async () => {
      try {
        let user = await UserRepository.getOne('SomeInvalidstring');
      }catch(err) {
        expect(err).to.be.not.undefined;
      }
    })

  })


  describe('>> Fetch All Users ', () => {
    let mockModel = sinon.stub(User,"find").returns([testUser,testUser])

    it('should return array of users' ,async () => {
      let users = await UserRepository.getAll();
      expect(users).to.length(2);
    })
  })
  
  
})






