const Express = require('express');
const dotenv = require('dotenv').config();
const {userController}  = require('./modules/user')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect(process.env.DB_URL, {useNewUrlParser:true,useUnifiedTopology:true}).then(() => {
  console.log("Database connected")
}).catch((err) => {
  console.log(err);
  process.exit(1);
})

const app = Express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))


app.get("/health" ,(req,res) => {
  res.json({
    status: "API is running!"
  })
})


// Child routes
app.use('/users',userController);

app.listen(process.env.PORT, () => {

  console.log(`Server is running on ${process.env.PORT}`)
})