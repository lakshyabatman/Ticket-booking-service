const cluster = require('cluster');
const dotenv = require('dotenv').config();

const setupWorkers = () => {
  let noOfCPUs = process.env.NO_OF_CPU
  console.log( `Ruuning ${noOfCPUs} workers.`);

  for(let i =0;i<noOfCPUs;i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died with ${code}`);
    console.log("--- Starting new Clister ---");
    cluster.fork();
  });
  
  
  
}


module.exports = setupWorkers;