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
      return await (await this.TicketRepository.addOne({movieSchedule: movieScheduleID,user: user._id})).populate("movieSchedule").populate("User").execPopulate();
    }catch(err) {
      throw new Error(err);
    }
  }

  async updateTiming(userID, ticketID, newMovieScheduleID) {
    // Check if user exist or not
    let user = await this.UserRepository.getOne(userID);
    if(!user) throw new Error("User doesn't exist");

    // Check if provided ticker exist and created by same user
    let ticket = await this.getOne(ticketID);
    if(ticket== undefined  || ticket.user._id != userID) throw new Error("Invalid Ticket ID");

    // Check if the provide movie slot exist and available 
    let newMovieSchedule = await this.MovieScheduleRepository.getOne(newMovieScheduleID);
    if(newMovieSchedule == undefined ||  newMovieSchedule.ticketsBooked>=20) throw new Error("Slot is full or invalid");

    // Updated new movie slot tickets booked
    newMovieSchedule.ticketsBooked++;
    await newMovieSchedule.save();

    // Update old movie slot tickets booked
    let oldMovieSchedule = await this.MovieScheduleRepository.getOne(ticket.movieSchedule._id);
    oldMovieSchedule.ticketsBooked--;
    await oldMovieSchedule.save();

    // Delete old ticket
    await this.deleteOne(ticket._id);

    // Add new Ticket with new movie slot!
    let newTicket = await this.addOne({email: user.email},newMovieSchedule._id);
    return newTicket;



  }

  async getAllBetweenRange(startTime, endTime) {
    let tickets = await this.TicketRepository.getAll()
    return tickets
    .filter(ticket => new Date(ticket.movieSchedule.startTime)>= new Date(startTime) && new Date(ticket.movieSchedule.endTime)<= new Date(endTime))
    .map(ticket => ticket.toObject())
    
  }

  async getUserDetails(ticketID) {
    return ( await ((await this.TicketRepository.getOne(ticketID)).populate('user').execPopulate())).user
  }
  

}

module.exports = new TicketService();