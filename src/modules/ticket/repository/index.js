
const { Ticket } = require('../model');
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * 
 * @description Ticket repository is repository layer class which interacts with ticket documents to manipulate movieschedule collection.
 * 
 */
class TicketRepository {

  /**
   * @description Fetch ticket documents using ticket id
   * @param {string} ticketID 
   * @returns Document of ticket type
   */
  async getOne(ticketID) {
    if(!ObjectId.isValid(ticketID)) throw new Error('Ticket Id is invalid')
    return await Ticket.findById(ticketID).populate('movieSchedule').populate('user');
  }

  /**
   * @description Fetches all ticket
   * @returns Array of ticket document
   */
  async getAll() {
    return await Ticket.find().populate('movieSchedule').populate('user')
  }

  /**
   * @description Add ticket 
   * @param {{movieSchedule : string,user : string }} ticketDto 
   * @returns document of ticket type
   */
  async addOne(ticketDto) {
    return await (await Ticket.create(ticketDto)).populate('movieSchedule').populate('user').execPopulate();
  }

  /**
   * @description Deletes ticket if already exist
   * @param {string} ticketID 
   * @returns document of deleted ticket
   */
  async deleteOne(ticketID) {
    if(!ObjectId.isValid(ticketID)) throw new Error('Ticket Id is invalid')
    return await Ticket.findByIdAndDelete(ticketID);
  }

  /**
   * @description Deletes whole ticket collection
   */
  async deleteAll() {
    return await Ticket.deleteMany({});
  }

}

module.exports = new TicketRepository();