const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let ticketSchema = new Schema({
  
  movieSchedule: {
    required:true,
    type: Schema.Types.ObjectId,
    ref:'MovieSchedule'
  },
  user: {
    required:true,
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  isActive: {
    type:Boolean,
    default:true
  },
  bookingTime: {
    type: Date,
    default: new Date().toISOString()
  }
})


const Ticket = mongoose.model('Ticket',ticketSchema);


module.exports = {
  Ticket
} 
