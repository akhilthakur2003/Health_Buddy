// // import userModel from "../../../backend/models/userModel"
// import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
// import { useAuthContext } from "../hooks/useAuthContext"


// const WorkoutDetails = ({workout})=>{
//     const {dispatch }= useWorkoutsContext()
//     const {user}= useAuthContext()

//     const handleClick = async ()=>{
//         if(!user)
//         {
//             return
//         }
//         const response= await fetch(('/api/workouts/'+ workout._id),{
//             method: 'DELETE',
//             headers: {
//                 'Authorization': `Bearer ${user.token}`
//             }
//         })
//         const json= await response.json()
//         console.log(json)
//         if(response.ok)
//         {
//             dispatch({type: 'DELETE_WORKOUT', payload: json})
//         }
//     }
//     return(
//         <div className="workout-details">
//             <h4>
//                 {workout.title}
//             </h4>
//             <p><strong>Load (kg): </strong>{workout.load}</p>
//             <p><strong>Reps: </strong>{workout.reps}</p>
//             <p  >{workout.createdAt}</p>
//             <span className="material-symbols-outlined" onClick={handleClick}>Delete</span>
//         </div>
//     )
// }

// export default WorkoutDetails




import { useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const WorkoutDetails = ({ workout }) => {
    const { dispatch } = useWorkoutsContext()
    const { user } = useAuthContext()

    // Setup toggles and local form states
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(workout.title)
    const [load, setLoad] = useState(workout.load)
    const [reps, setReps] = useState(workout.reps)
    const [error, setError] = useState(null)

    // Delete request handler
    const handleDeleteClick = async () => {
        if (!user) return

        const response = await fetch('/api/workouts/' + workout._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({ type: 'DELETE_WORKOUT', payload: json })
        }
    }

    // Patch request handler
    const handleUpdateSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const updatedFields = { title, load, reps }

        const response = await fetch('/api/workouts/' + workout._id, {
            method: 'PATCH',
            body: JSON.stringify(updatedFields),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setError(null)
            setIsEditing(false) // turn off edit view layout
            dispatch({ type: 'UPDATE_WORKOUT', payload: json }) // update core feed context
        }
    }

    return (
        <div className="workout-details">
            {!isEditing ? (
                // VIEW TEMPLATE
                <>
                    <h4>{workout.title}</h4>
                    <p><strong>Load (kg): </strong>{workout.load}</p>
                    <p><strong>Reps: </strong>{workout.reps}</p>
                    <p className="date-tag">{workout.createdAt}</p>
                    
                    {/* Positioned Action Controls */}
                    <div className="actions">
                        <span className="material-symbols-outlined edit-icon" onClick={() => setIsEditing(true)}>edit</span>
                        <span className="material-symbols-outlined delete-icon" onClick={handleDeleteClick}>delete</span>
                    </div>
                </>
            ) : (
                // EDIT LAYOUT TEMPLATE
                <form className="edit-form" onSubmit={handleUpdateSubmit}>
                    <h4>Edit Exercise Log</h4>
                    
                    <label>Exercise Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                    <label>Load (kg):</label>
                    <input type="number" value={load} onChange={(e) => setLoad(e.target.value)} required />

                    <label>Reps:</label>
                    <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} required />

                    <div className="edit-form-buttons">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>

                    {error && <div className="error">{error}</div>}
                </form>
            )}
        </div>
    )
}

export default WorkoutDetails