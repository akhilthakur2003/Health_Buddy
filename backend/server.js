require('dotenv').config()
const express = require('express')
const app= express()
const workoutRoutes= require('./routes/workouts')
const userRoutes = require('./routes/user')
const mongoose =require('mongoose')

//middleware
app.use(express.json())

app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

//routes
// the base endpoint is /api/workouts/
app.use('/api/workouts',workoutRoutes)
app.use('/api/user',userRoutes)


// app.get('/',(req,res)=>{
//     res.json({mssg: 'Welcome akhil '})
// })

//database  connect
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{  
    app.listen(process.env.PORT, ()=>{console.log("Connected to db and listening on port 4000")})
    })
    .catch((err)=>{
        console.log(err)
    })

