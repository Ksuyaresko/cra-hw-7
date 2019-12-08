import {createStore} from 'redux';

export const store = createStore( (state, action) => {
    if (state === undefined){
        return {history: null};
    }
    if(action.type === 'HISTORY') {
        return {history: action.history}
    }
    return state
});

const actionHistory = history => ({type: 'HISTORY', history});

export const actionSend = ({nick, message}) => {
    getDate(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({func: "addMessage", nick: nick, message: message})})
        .then( response => console.log(response))

    return {type: 'SEND', nick, message}
    // action doesnt work without return ??
}

const url = 'https://cors-anywhere.herokuapp.com/http://students.a-level.com.ua:10012/'
// const url = 'http://students.a-level.com.ua:10012/'

const getDate = async (url, options) => {
    return (
        await fetch(url, options)
    ).json()
};

const optionsHistory = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({func: 'getMessages', messageId: 0})
}

const refreshData = () => {
    getDate(url, optionsHistory)
        .then( response => {
            store.dispatch(actionHistory(response.data.slice(-10)))
            setTimeout(refreshData, 2000)
        })
}
refreshData();

//  function jsonPost(url, data) {
//    return new Promise((resolve, reject) => {
//      var x = new XMLHttpRequest();
//      x.onerror = () => reject(new Error('jsonPost failed'))
//      x.open("POST", url);
//      x.send(JSON.stringify(data))
//
//      x.onreadystatechange = () => {
//        if (x.readyState == XMLHttpRequest.DONE && x.status == 200){
//          resolve(JSON.parse(x.responseText))
//        }
//        else if (x.status != 200){
//          reject(new Error('status is not 200'))
//        }
//      }
//    })
// }
// jsonPost(url, {func: "getMessages", messageId: 0}).then( resp => console.log(resp))

// XMLHttpRequest works fine without proxy, fetch doesnt ???