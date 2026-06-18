import { useAuthContext } from "./useAuthContext"
import {useWorkoutsContext} from './useWorkoutsContext'

export const useLogout = ()=>{

    const {dispatch} = useAuthContext()
    const {dispatch: workoutsDispatch} = useWorkoutsContext()
    const logout = ()=>{
        // we are able to login
        // just because of two things
        //1 the global state and the jwt in the local storage
        // then we delete both things
        // we don't need to send request to backend

        //remove user from storage
        localStorage.removeItem('user')

        // remove global state of user
        dispatch({type: 'LOGOUT'})

        // remove the workouts from front end when the user is logged out
        workoutsDispatch({type: 'SET_WORKOUTS',payload: null})
    }
    return {logout}
    
}