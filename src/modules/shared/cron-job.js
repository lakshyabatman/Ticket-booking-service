const cron = require("node-cron");

const ticketService = require('../ticket/provider')

let cleanUpTicketsCron = cron.schedule("*/30 * * * *" , function() {
  console.log("------- Running Cron Job -------" );
  let currentTime = new Date().toISOString()
   console.log(`${currentTime}`)
  ticketService.expireOldTickets()
  //TODO  Add a service method which deletes tickets if there is difference of 8 hours 
  // Todo Might need to update movieschedule of that ticket
},false)

/**
 * @description Wrapper method which will wrap all cron jobs
 */
const cronTasks = () => {
  cleanUpTicketsCron.start()
}

module.exports = cronTasks