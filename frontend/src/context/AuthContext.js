import { createContext, useReducer, useEffect } from "react";


export const AuthContext = createContext()

export const authReducer = (state, action ) =>{
    switch(action.type)
    {
        case 'LOGIN':
            return {user: action.payload }
        case 'LOGOUT':
            return {user: null}
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })


    // to solve the problem of gettting logged out on refreshing the page
    // while we are having the jwt on local storage
    
    useEffect(()=>{
        //check for the jwt token
        const user= JSON.parse(localStorage.getItem('user'))
        // parse to convert string to json object
        if(user)
        {
            dispatch({type: 'LOGIN', payload: user})
        }
    },[])
    console.log('AuthContext state' , state)
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}