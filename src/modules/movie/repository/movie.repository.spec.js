const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const {Movie}  = require('../model');
const MovieRepository = require('./index');
var ObjectID = require('mongodb').ObjectID;


describe('--- Movie Repository ---', () => {
  const testMovie = {
    name: faker.name.findName() 
  }


  describe('>> Add One movie', () => {
    let mockModel = sinon.stub(Movie,"create");
    mockModel.onCall(0).returns(testMovie);
    mockModel.onCall(1).throws();

    it('should add movie' ,async () => {
      const movie = await MovieRepository.addOne({name: testMovie.name});
      expect(movie).to.not.undefined;
      expect(mockModel.calledOnce).to.be.true;
      expect(movie.name).to.be.equal(testMovie.name);
    })

    it('throw error if movie name is undefined' ,async() => {
      try {
        const movie = await MovieRepository.addOne({});
      }catch(err) {
        expect(err.message).to.not.undefined;
      }
    })
  })


  describe('>> Fetch Single Movie', () => {
    let mockModel = sinon.stub(Movie,"findById");
    mockModel.onCall(0).returns(testMovie);
    mockModel.onCall(1).returns(testMovie);
    it('should fetch single movie' , async () => {
      let movie = await MovieRepository.getOne(new ObjectID().toHexString());
      expect(movie).to.be.not.undefined;

    })

    it('should throw if movie id is not valid' , async () => {
      try {
        let movie = await MovieRepository.getOne('SomeInvalidstring');
      }catch(err) {
        expect(err).to.be.not.undefined;
      }
    })

  })


  describe('>> Fetch All Movies ', () => {
    let mockModel = sinon.stub(Movie,"find").returns([testMovie,testMovie])

    it('should return array of movies' ,async () => {
      let movies = await MovieRepository.getAll();
      expect(movies).to.length(2);
    })
  })
  
  
})






