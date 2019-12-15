import {createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk'
import { request, GraphQLClient } from 'graphql-request'
import jwtDecode from 'jwt-decode'

const url = 'http://students.a-level.com.ua:10012/'

const getDate = async (url, options) => {
    return (
        await fetch(url, options)
    ).json()
};

const customRequest = (url, options) => {
    const headers = localStorage.auth ? {
        headers: {
            Authorization: `Bearer ${localStorage.auth}`,
        },
    } : {}

    return new GraphQLClient( url, Object.assign(headers, options))
}

const ReducerChat = (state, action) => {
    if (state === undefined){
        return {};
    }
    if(action.type === 'PROMISE') {
        const { type, status, payload, name } = action
        return { ...state, [name]: { type, status, payload }}
    }
    return state
}

const ReducerUser = (state, action) => {
    if (state === undefined){
        return {};
    }
    if(action.type === 'USER') {
        const { type, status, token, decoded } = action
        return { type, status, token, decoded }
    }
    return state
}

const reducers = combineReducers({
    chat: ReducerChat,
    user: ReducerUser
})

export const store = createStore( reducers, applyMiddleware(thunk));

store.subscribe(()=> {console.log(store.getState())});

const actionPromise = (promise,name) => {
    const actionPending     = () => ({ type: 'PROMISE', name, status: 'PENDING', payload: null, error: null })
    const actionResolved    = payload => ({type: 'PROMISE', name, status: 'RESOLVED', payload, error: null })
    const actionRejected    = error => ({ type: 'PROMISE', name, status: 'REJECTED', payload: null, error })
    return async dispatch => {
        dispatch(actionPending())
        try{
            dispatch(actionResolved(await promise))
        }
        catch(e){
            dispatch(actionRejected(e))
        }
    }
}

const actionResolvedUser = payload => {
    const token = payload.login ? payload.login : payload
    if(payload.login) {
        localStorage.auth = payload.login
    }
    return {
        type: 'USER',
        status: 'RESOLVED',
        token,
        decoded: jwtDecode(token),
        error: null
    }
}

export const actionLogout = () => {
    localStorage.removeItem('auth');
    return {type: 'USER'}
}

const actionUserPromise = (promise) => {
    const actionPending = () => ({ type: 'USER', status: 'PENDING', payload: null, error: null })
    const actionRejected = error => {
        console.log(error)
        return { type: 'USER', status: 'REJECTED', payload: null, error }
    }
    return async dispatch => {
        dispatch(actionPending())
        try{
            dispatch(actionResolvedUser(await promise))
        }
        catch(e){
            dispatch(actionRejected(e))
        }
    }
}

export const actionLogin = ({login, password}) => {
    const query = `query log($l:String, $p:String){
      login(login:$l, password:$p)
    }`

    const loginRequest = customRequest('http://shop-roles.asmer.fs.a-level.com.ua/graphql')
        .request( query,{
            l: login,
            p: password
        })

    return async dispatch => {
        dispatch(actionUserPromise( await loginRequest));
    }
}

if(localStorage.auth) {
    console.log(localStorage.auth)
    store.dispatch(actionResolvedUser(localStorage.auth))
}

export const actionSignin = ({login, password}) => {
    const query = `mutation reg($l:String, $p:String){
                      UserUpsert(user:{login:$l, password:$p}){
                        _id createdAt login
                      }
                    }`

    const loginRequest = request( 'http://shop-roles.asmer.fs.a-level.com.ua/graphql', query, {
        l: login,
        p: password
    })

    return async dispatch => {
        dispatch(actionUserPromise( await loginRequest));
    }
}

export const actionSend = ({nick, message}) => {
    const sendPromise = getDate(url, {
        method: "POST",
        body: JSON.stringify({func: "addMessage", nick: nick, message: message})
    })
    // const sendPromise = new Promise( resolve => {
    //     setTimeout(() => {resolve(message)}, 2000)
    // })
    return async dispatch => {
        dispatch(actionPromise( await sendPromise, 'send'));
        dispatch(actionHistory())
    }
}

const actionHistory = () => {
    const promiseHistory = getDate(url, {
        method: "POST",
        body: JSON.stringify({func: 'getMessages', messageId: 0})
    })
    return async dispatch => {
        dispatch(actionPromise( await promiseHistory, 'history'));
    }
}

store.dispatch(actionHistory());
// setInterval(() =>{
//     store.dispatch(actionHistory());
// }, 2000)