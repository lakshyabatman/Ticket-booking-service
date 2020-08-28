const TicketRepository = require('../repository');
const { UserRepository } = require('../../user/provider');
const { MovieScheduleRepository } = require('../../movie-schedule/provider');

/**
 * @description Provider class which wires up repository layer wtih controller layer.
 */
class TicketService {
  constructor() {
    this.TicketRepository = TicketRepository;
    this.MovieScheduleRepository = MovieScheduleRepository;
    this.UserRepository = UserRepository;
  }

  async getOne(ticketID) {
    let ticket = await this.TicketRepository.getOne(ticketID);
    if(!ticket) throw new Error("Ticket doesn't exist");
    return (await ticket.populate('movie').execPopulate()).toObject();
  }

  async getAll() {
    let tickets = await this.TicketRepository.getAll();
    return tickets.map(ticket => ticket.toObject());
  }

  async addOne(ticketDto) {
    if(await this.MovieScheduleRepository.getOne(ticketDto.movieSchedule) == undefined) throw new Error("Movie Schedule not found")
    if(await this.UserRepository.getOne(ticketDto.user) === undefined) throw new Error("User not found")
    return await (await this.TicketRepository.addOne(ticketDto)).toObject();
  }

  async deleteOne(ticketID) {
    let deletedTicket = await this.TicketRepository.deleteOne(ticketID);
    if(!deletedTicket) throw new Error("Ticket doesn't exist");
    return deletedTicket.toObject();
  }

  async deleteAll() {
    return await this.TicketRepository.deleteAll();
  }

}

module.exports = new TicketService();