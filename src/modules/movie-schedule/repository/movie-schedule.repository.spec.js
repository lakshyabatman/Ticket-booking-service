


const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const {MovieSchedule}  = require('../model');
const MovieScheduleRepository = require('./index');
var ObjectID = require('mongodb').ObjectID;


describe('--- MovieSchedule Repository ---', () => {
  const testMovieSchedule = {
    movie: new ObjectID().toHexString(),
    startTime: new Date().toISOString(),
    endTime: new Date(new Date()+ 3600).toISOString()
  }

  const mockQuery = {
    populate: () => {
      return {
          execPopulate : () => testMovieSchedule
      } 
    }
  }



  describe('>> Add One movieSchedule', () => {
    
    let mockModel = sinon.stub(MovieSchedule,"create");
    mockModel.onCall(0).returns(mockQuery);
    mockModel.onCall(1).throws();
    

    it('should add movieSchedule' ,async () => {
      const movieSchedule = await MovieScheduleRepository.addOne({
        movie: new ObjectID().toHexString(),
        startTime: new Date().toISOString(),
        endTime: new Date(new Date()+ 3600).toISOString()
      });
      expect(movieSchedule).to.not.undefined;
      expect(mockModel.calledOnce).to.be.true;
    })

    it('throw error if movieSchedule name is undefined' ,async() => {
      try {
        const movieSchedule = await MovieScheduleRepository.addOne({});
      }catch(err) {
        expect(err.message).to.not.undefined;
      }
    })
  })


  describe('>> Fetch Single MovieSchedule', () => {
    let mockModel = sinon.stub(MovieSchedule,"findById");
    mockModel.onCall(0).returns(mockQuery);
    mockModel.onCall(1).returns(mockQuery);
    it('should fetch single movieSchedule' , async () => {
      let movieSchedule = await MovieScheduleRepository.getOne(new ObjectID().toHexString());
      expect(movieSchedule).to.be.not.undefined;

    })

    it('should throw if movieSchedule id is not valid' , async () => {
      try {
        let movieSchedule = await MovieScheduleRepository.getOne('SomeInvalidstring');
      }catch(err) {
        expect(err).to.be.not.undefined;
      }
    })

    })


  describe('>> Fetch All MovieSchedules ', () => {
    let mockModel = sinon.stub(MovieSchedule,"find").returns({ populate: () => { return [testMovieSchedule,testMovieSchedule] }})

    it('should return array of movieSchedules' ,async () => {
      let movieSchedules = await MovieScheduleRepository.getAll();
      expect(movieSchedules).to.length(2);
      expect(mockModel.calledOnce).to.be.true
    })
  })
  
  
})




