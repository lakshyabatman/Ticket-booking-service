const MovieScheduleRepository = require('../repository');
const MovieRepository = require('../../movie/repository')

/**
 * @description Provider class which wires up repository layer wtih controller layer.
 */
class MovieScheduleService {
  constructor() {
    this.MovieScheduleRepository = MovieScheduleRepository;
    this.MovieRepository = MovieRepository;
  }

  async getOne(movieScheduleID) {
    let movieSchedule = await this.MovieScheduleRepository.getOne(movieScheduleID);
    if(!movieSchedule) throw new Error("MovieSchedule doesn't exist");
    return (await movieSchedule.populate('movie').execPopulate()).toObject();
  }

  async getAll() {
    let movieSchedules = await this.MovieScheduleRepository.getAll();
    return movieSchedules.map(movieSchedule => movieSchedule.toObject());
  }

  async addOne(movieScheduleDto) {
    if(await this.MovieRepository.getOne(movieScheduleDto.movie) == undefined) throw new Error("Movie not found")
    return await (await this.MovieScheduleRepository.addOne(movieScheduleDto)).toObject();
  }

  async deleteOne(movieScheduleID) {
    let deletedMovieSchedule = await this.MovieScheduleRepository.deleteOne(movieScheduleID);
    if(!deletedMovieSchedule) throw new Error("MovieSchedule doesn't exist");
    return deletedMovieSchedule.toObject();
  }

  async deleteAll() {
    return await this.MovieScheduleRepository.deleteAll();
  }

}

module.exports = new MovieScheduleService();