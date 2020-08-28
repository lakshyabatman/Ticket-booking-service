const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let movieSchema = new Schema({
  
  name: {
    type: String,
    required: 'Name is required'
  }
})


const Movie = mongoose.model('Movie',movieSchema);


module.exports = {
  Movie
} 
