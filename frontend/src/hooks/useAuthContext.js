import { AuthContext } from "../context/AuthContext";
//this is actual context not the provider

import {useContext} from 'react'


export const useAuthContext = ()=>{
    const context = useContext(AuthContext)
    //object with the state and dispatch function

    if(!context)
    {
        throw Error("useAuthContext must be used inside an AuthContextProvider")
    }
    return context
}