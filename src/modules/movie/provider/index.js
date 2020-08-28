const MovieRepository = require('../repository');


/**
 * @description Provider class which wires up repository layer wtih controller layer.
 */
class MovieService {
  constructor() {
    this.MovieRepository = MovieRepository;
  }

  async getOne(movieID) {
    let movie = await this.MovieRepository.getOne(movieID);
    if(!movie) throw new Error("Movie doesn't exist");
    return movie.toObject();
  }

  async getAll() {
    let movies = await this.MovieRepository.getAll();
    return movies.map(movie => movie.toObject());
  }

  async addOne(movieDto) {
    return await (await this.MovieRepository.addOne(movieDto)).toObject();
  }

  async deleteOne(movieID) {
    let deletedMovie = await this.MovieRepository.deleteOne(movieID);
    if(!deletedMovie) throw new Error("Movie doesn't exist");
    return deletedMovie.toObject();
  }

  async deleteAll() {
    return await this.MovieRepository.deleteAll();
  }

}

module.exports = new MovieService();