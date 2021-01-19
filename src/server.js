const Express = require('express');
const dotenv = require('dotenv').config();
const {userController}  = require('./modules/user')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { movieController } = require('./modules/movie');
const { movieScheduleController } = require('./modules/movie-schedule');
const { ticketController } = require('./modules/ticket');
const cluster = require('cluster');
const {apiLimiter,cronTasks,setupWorkers} = require('./modules/shared')
const setupApp = () => {

  mongoose.connect(process.env.DB_URL, {useNewUrlParser:true,useUnifiedTopology:true}).then(() => {
    console.log("Database connected")
  }).catch((err) => {
    console.log(err);
    process.exit(1);
  })
  
  const app = Express();
  
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:false}))
  app.use(apiLimiter);
  //Cron Job
  cronTasks();
  
  
  app.get("/health" ,(req,res) => {
    res.json({
      status: "API is running!"
    })
  })
  
  
  // Child routes
  app.use('/users',userController);
  app.use('/movies',movieController)
  app.use('/movie-schedules',movieScheduleController);
  app.use('/tickets', ticketController );
  
  
  //Boostrap
  app.listen(process.env.PORT, () => {
  
    console.log(`Server is running on ${process.env.PORT}`)
  })
}


const startServer = () => {
  if(cluster.isMaster) {
    setupWorkers();
  }else {
    setupApp();
  }
}

startServer();