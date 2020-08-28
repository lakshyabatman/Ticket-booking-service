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

  async updateTiming() {
    //TODO: Check user exist;
    //TODO Check ticket exist and booked by same suer
    //TODO check is time slot available and seats available
    //TODO if yes delete prev ticket and decrement tickets booked in prev schedule
    //TODO and increment in new shcedule slot
    //TODO return new ticket


  }

  async getAllBetweenRange(startTime, endTime) {
    let tickets = await this.TicketRepository.getAll()
    return tickets
    .filter(ticket => (new Date(ticket.startTime)>= new Date(startTime) && new Date(ticket.endTime)<= new Date(endTime)))
    .map(ticket => ticket.toObject())
    
  }

  async getUserDetails(ticketID) {
    return ( await ((await this.TicketRepository.getOne(ticketID)).populate('user').execPopulate())).user
  }
  

}

module.exports = new TicketService();