const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let movieScheduleSchema = new Schema({
  
  movie : {
    type: Schema.Types.ObjectId,
    ref:'Movie'
  },
  ticketsBooked : {
    type: Number,
    default: 0
  },
  startTime: {
    type: String,
    required:'Start Time is required'
  },
  endTime: {
    type: String,
    required: 'End Time is required'
  }
})


const MovieSchedule = mongoose.model('MovieSchedule',movieScheduleSchema);


module.exports = {
  MovieSchedule
} 
