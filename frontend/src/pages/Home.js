import { useEffect, useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import WorkoutDetails from "../components/WorkoutDetails"
import WorkoutForm from "../components/WorkoutForm"

const Home = () => {
    const { workouts, dispatch } = useWorkoutsContext()
    const { user } = useAuthContext()
    
    // Track the currently selected active dashboard day
    const [selectedDay, setSelectedDay] = useState('Monday')
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    useEffect(() => {
        const fetchWorkouts = async () => {
            const response = await fetch('/api/workouts', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: 'SET_WORKOUTS', payload: json })
            }
        }

        if (user) {
            fetchWorkouts()
        }
    }, [dispatch, user])

    // Filter workouts in local state memory by the chosen ribbon tab day
    const filteredWorkouts = workouts ? workouts.filter(w => w.dayOfWeek === selectedDay) : []

    return (
        <div className="home-container">
            {/* Weekly Selector Ribbon Bar */}
            <div className="days-ribbon">
                {days.map(day => (
                    <button 
                        key={day}
                        className={selectedDay === day ? 'day-btn active' : 'day-btn'}
                        onClick={() => setSelectedDay(day)}
                    >
                        {day.substring(0, 3)} {/* Displays 'Mon', 'Tue', etc. */}
                    </button>
                ))}
            </div>

            <div className="home">
                <div className="workouts-feed">
                    <h3>{selectedDay}'s Schedule</h3>
                    
                    {filteredWorkouts.length > 0 ? (
                        filteredWorkouts.map((workout) => (
                            <WorkoutDetails key={workout._id} workout={workout} />
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No exercises planned for {selectedDay} yet. Time to plan a routine!</p>
                        </div>
                    )}
                </div>
                {/* Pass the currently viewed day so the form can pre-select it */}
                <WorkoutForm defaultDay={selectedDay} />
            </div>
        </div>
    )
}

export default Home