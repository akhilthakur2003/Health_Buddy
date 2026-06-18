import { useState, useEffect } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const WorkoutForm =({defaultDay})=>{
    const {dispatch} = useWorkoutsContext()
    const [title, setTitle] =useState('')
    const [load, setLoad] =useState('')
    const [reps, setReps] =useState('')
    const [dayOfWeek, setDayOfWeek] = useState('Monday')
    const [error, setError] =useState(null)
    const [emptyFields,setEmptyFields]=useState([])
    
    const {user}= useAuthContext()

    useEffect(() => {
        if (defaultDay) {
            setDayOfWeek(defaultDay)
        }
    }, [defaultDay])

    const handleSubmit = async (e)=>{
        e.preventDefault()
        if(!user){
            setError('You must be logged in')
            return 
        }
        const workout= {title, load, reps, dayOfWeek}

        const response = await fetch('/api/workouts',{
            method: 'POST',
            body: JSON.stringify(workout),// changes to json string
            headers:  {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()
        if(!response.ok)
        {
            setError(json.error) 
            setEmptyFields(json.emptyFields)
        }
        if(response.ok)
        {
            setTitle('')
            setLoad('')
            setReps('')
            setError(null)
            setEmptyFields([])
            console.log('new workout added',json)
            dispatch({type: 'CREATE_WORKOUT',payload: json})
        }

    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>
        Adda a new Workout
            </h3>
            <label>
        Exercise Title:
            </label>
            <input
                type="text"
                onChange={(e)=> setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : '' }
            />
            <label>
        Load (in Kg):
            </label>
            <input
                type="number"
                onChange={(e)=> setLoad(e.target.value)}
                value={load}
                className={emptyFields.includes('load') ? 'error' : '' }

            />
            <label>
        Reps:
            </label>
            <input
                type="number"
                onChange={(e)=> setReps(e.target.value)}
                value={reps}
                className={emptyFields.includes('reps') ? 'error' : '' }

            />

            <label>Day of the Week:</label>
            <select 
                value={dayOfWeek} 
                onChange={(e) => setDayOfWeek(e.target.value)}
                className={emptyFields.includes('dayOfWeek') ? 'error' : ''}
            >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
            </select>
            <button>Add Workout</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default WorkoutForm