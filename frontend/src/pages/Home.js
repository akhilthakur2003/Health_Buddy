import { useEffect } from "react";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutDetails from '../components/WorkoutDetails'
import { useAuthContext } from "../hooks/useAuthContext";

import { useWorkoutsContext } from "../hooks/useWorkoutsContext";


const Home= ()=>{
    // const [workouts,setWorkouts]= useState(null)
    const {workouts,dispatch} = useWorkoutsContext()
    const {user}= useAuthContext()


    useEffect(()=>{
        const fetchWorkouts = async ()=>{
            const response= await fetch('/api/workouts',{
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json() // will conver string to array of objects

            if(response.ok)
            {
                // setWorkouts(json)
                dispatch({type: 'SET_WORKOUTS',payload: json})
            }
        }
        if(user)
        {

            fetchWorkouts()
        }
    },[dispatch, user])// will fire only once when component render

    return (
        <div className="home">
        <div className="workouts">
            {
                workouts && workouts.map((workout)=>(
                    <WorkoutDetails key={workout._id} workout={workout}/>
                ))
            }
        </div>
        <div>
            {
                <WorkoutForm/>
            }
        </div>
        </div>
    )
}

export default Home;