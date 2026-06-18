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

const path = require('path')

//Production deployment middleware
// Serve frontend build files in production
if (process.env.NODE_ENV === 'production') {
    // Point Express to your React build folder
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    // Any request that doesn't hit an API route gets redirected to index.html
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
    })
}




//database  connect
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{  
    app.listen(process.env.PORT, ()=>{console.log("Connected to db and listening on port 4000")})
    })
    .catch((err)=>{
        console.log(err)
    })

