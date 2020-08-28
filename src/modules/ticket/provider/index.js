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

  
  async deleteOne(ticketID) {
    let deletedTicket = await this.TicketRepository.deleteOne(ticketID);
    if(!deletedTicket) throw new Error("Ticket doesn't exist");
    return deletedTicket.toObject();
  }

  async deleteAll() {
    return await this.TicketRepository.deleteAll();
  }


  async addOne(userDto, movieScheduleID) {
    let user;
    try {
      user = await this.UserRepository.addOne(userDto);
    } catch (err) {
      user = await this.UserRepository.getUserDetails({email: userDto.email})
    }

    try {
      let movieSchedule = await this.MovieScheduleRepository.getOne(movieScheduleID)
      if(movieSchedule.ticketsBooked >=20) throw new Error("Movie slot is full");
      movieSchedule.ticketsBooked++;
      await movieSchedule.save();
      console.log(user)
      return await (await this.TicketRepository.addOne({movieSchedule: movieScheduleID,user: user._id})).populate("movieSchedule").populate("User").execPopulate();
    }catch(err) {
      throw new Error(err);
    }
  }

}

module.exports = new TicketService();