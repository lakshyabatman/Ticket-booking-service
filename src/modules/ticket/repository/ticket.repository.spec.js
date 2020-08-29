


const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const {Ticket}  = require('../model');
const TicketRepository = require('./index');
var ObjectID = require('mongodb').ObjectID;


describe('--- Ticket Repository ---', () => {
  const testTicket = {
    user: new ObjectID().toHexString(),
    movieSchedule: new ObjectID().toHexString(),
    bookingTime: new Date().toISOString() 
  }

  const mockQuery = {
    populate: () => {
      return {
        populate : () => {
          return { execPopulate : () => testTicket}
        }
      } 
    }
  }



  describe('>> Add One ticket', () => {
    
    let mockModel = sinon.stub(Ticket,"create");
    mockModel.onCall(0).returns(mockQuery);
    mockModel.onCall(1).throws();
    

    it('should add ticket' ,async () => {
      const ticket = await TicketRepository.addOne({user: new ObjectID().toHexString(),movieSchedule: new ObjectID().toHexString()});
      expect(ticket).to.not.undefined;
      expect(mockModel.calledOnce).to.be.true;
    })

    it('throw error if ticket name is undefined' ,async() => {
      try {
        const ticket = await TicketRepository.addOne({});
      }catch(err) {
        expect(err.message).to.not.undefined;
      }
    })
  })


  describe('>> Fetch Single Ticket', () => {
    let mockModel = sinon.stub(Ticket,"findById");
    mockModel.onCall(0).returns(mockQuery);
    mockModel.onCall(1).returns(mockQuery);
    it('should fetch single ticket' , async () => {
      let ticket = await TicketRepository.getOne(new ObjectID().toHexString());
      expect(ticket).to.be.not.undefined;

    })

    it('should throw if ticket id is not valid' , async () => {
      try {
        let ticket = await TicketRepository.getOne('SomeInvalidstring');
      }catch(err) {
        expect(err).to.be.not.undefined;
      }
    })

    })


  describe('>> Fetch All Tickets ', () => {
    let mockModel = sinon.stub(Ticket,"find").returns({ populate: () => { return {populate: () => [testTicket,testTicket]} }})

    it('should return array of tickets' ,async () => {
      let tickets = await TicketRepository.getAll();
      expect(tickets).to.length(2);
      expect(mockModel.calledOnce).to.be.true
    })
  })
  
  
})




