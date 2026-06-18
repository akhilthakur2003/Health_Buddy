import { WorkoutsContext } from "../context/WorkoutContext";
//this is actual context not the provider

import {useContext} from 'react'


export const useWorkoutsContext = ()=>{
    const context = useContext(WorkoutsContext)
    //object with the state and dispatch function

    if(!context)
    {
        throw Error("useWorkoutContext must be used inside an workoutContextProvider")
    }
    return context
}