import {createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

const url = 'http://students.a-level.com.ua:10012/'

const getDate = async (url, options) => {
    return (
        await fetch(url, options)
    ).json()
};

export const store = createStore( (state, action) => {
    if (state === undefined){
        return {};
    }
    if(action.type === 'PROMISE') {
        const { type, status, payload, name } = action
        return { ...state, [name]: { type, status, payload }}
    }
    return state
}, applyMiddleware(thunk));

store.subscribe(()=> {console.log(store.getState())});

const actionPromise = (promise,name) => {
    const actionPending     = () => ({ type: 'PROMISE', name, status: 'PENDING', payload: null, error: null })
    const actionResolved    = payload => ({ type: 'PROMISE', name, status: 'RESOLVED', payload, error: null })
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

export const actionSend = ({nick, message}) => {
    const sendPromise = getDate(url, {
        method: "POST",
        body: JSON.stringify({func: "addMessage", nick: nick, message: message})
    })
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