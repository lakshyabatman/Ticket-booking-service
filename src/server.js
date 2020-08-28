const Express = require('express');
const dotenv = require('dotenv').config();



const app = Express();


app.get("/health" ,(req,res) => {
  res.json({
    status: "API is running!"
  })
})

app.listen(process.env.PORT, () => {

  console.log(`Server is running on ${process.env.PORT}`)
})