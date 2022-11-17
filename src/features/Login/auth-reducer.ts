 import { Dispatch } from 'redux'
import {
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType,
    setIsInitializedAC,
    SetIsInitializedActionType
} from '../../app/app-reducer'
 import {LoginDataType} from "./Login";
 import {authAPI, Result_Code} from "../../api/todolists-api";
 import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))

    try {const response = await authAPI.login(data)

        if (response.data.resultCode === Result_Code.OK) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(response.data,dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as {message:string},dispatch)
    }
}

 export const initializeAppTC = () => async (dispatch: Dispatch<ActionsType>) => {
     dispatch(setAppStatusAC('loading'))

     try {const response = await authAPI.me()

         if (response.data.resultCode === Result_Code.OK) {
             dispatch(setIsLoggedInAC(true))
             dispatch(setAppStatusAC('succeeded'))
         } else {
             handleServerAppError(response.data,dispatch)
         }
     } catch (e) {
         handleServerNetworkError(e as {message:string},dispatch)
     }
     finally {
         dispatch(setIsInitializedAC(true))
     }

 }

 export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
     dispatch(setAppStatusAC('loading'))

     try {const response = await authAPI.logOut()

         if (response.data.resultCode === Result_Code.OK) {
             dispatch(setIsLoggedInAC(false))
             dispatch(setAppStatusAC('succeeded'))
         } else {
             handleServerAppError(response.data,dispatch)
         }
     } catch (e) {
         handleServerNetworkError(e as {message:string},dispatch)
     }

 }

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType | SetIsInitializedActionType
