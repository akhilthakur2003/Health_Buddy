const Workout =require('../models/workoutModel')
const mongoose =require('mongoose')


// get all workout
const getWorkouts = async (req,res) => {
    try{
        const user_id = req.user._id
        const workouts=await Workout.find({user_id}).sort({createdAt: -1})
        res.status(200).json(workouts)
    }catch(error){
         res.status(400).json({error: "error"+ error.message})
    }
}


// get a single workout

const getWorkout =async (req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: 'No such workout'})
    }
    const workout = await Workout.findById(id)
    if(!workout)
    {
        return res.status(404).json({error: "No such workout"})
    }
    else
    {
        res.status(200).json(workout)
    }
}


// create a new workout
const createWorkout = async (req, res)=>{
    const {title, load, reps} = req.body
    let emptyFields =[]

    if(!title)
    {
        emptyFields.push('title')
    }
     if(!load)
    {
        emptyFields.push('load')
    }
     if(!reps)
    {
        emptyFields.push('reps')
    }
    
    if(emptyFields.length >0)
    {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }


    try{
        const user_id = req.user._id

        // add doc to db
        const workout=await Workout.create({title,load,reps, user_id})
        res.status(200).json(workout)
    } catch(error){
        res.status(400).json({error: error.message})
    }
    res.json({mssg: 'POST a new workout'})
}

// delete a workout
const deleteWorkout = async (req,res)=>{
     const {id} = req.params
     console.log("delete api hit")
    if(!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: 'No such workout'})
    }
    const workout= await Workout.findByIdAndDelete({_id: id})
    console.log(workout)
    if(!workout)
    {
        return res.status(404).json({error: "No such workout"})
    }
    res.status(200).json(workout)
}

// update a workout
const updateWorkout = async (req,res)=>{
    const {id}= req.params
    if(!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status.json({error: "NO such workout"})
    }
    const workout = await Workout.findByIdAndUpdate({_id:id},{...req.body},{ new: true })
    if(!workout)
    {
        return res.status(404).json({error: "No such workout found"})
    }
    res.status(200).json(workout)
}

module.exports ={
    createWorkout,
    getWorkout,
    getWorkouts,
    deleteWorkout,
    updateWorkout,
}