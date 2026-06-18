import {createContext, useReducer} from 'react'

// create a context
export const WorkoutsContext = createContext()

// state is the prev state
export const workoutReducer = (state, action)=>{
    switch(action.type){
        case 'SET_WORKOUTS':
            return {
                workouts: action.payload
            }
        case 'CREATE_WORKOUT':
            return{
                workouts: [action.payload, ...state.workouts]
            }
        case 'DELETE_WORKOUT':
            return {
                workouts: state.workouts.filter((w) => (w._id !== action.payload._id))
            }
        case 'UPDATE_WORKOUT':
            return {
                workouts: state.workouts.map((w) => w._id === action.payload._id ? action.payload : w)
            }
        default:
            return state
    }
}

//provide this context to our components in the app
export const WorkoutsContextProvider = ({children})=>{
    const [state,dispatch]= useReducer(workoutReducer,{
        workouts: null
    })

    // whenever the dispatch fun is called
    // it invokes the workoutReducer function
    // with type and payload as parameters

    return (
        //        value which will we available to component through context
        <WorkoutsContext.Provider value={{...state, dispatch}}>
             {children}
             {/* the component where context is accessible */}
        </WorkoutsContext.Provider>
    )
} 