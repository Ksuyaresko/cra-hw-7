import React from 'react';
import './App.css';
import {Provider, connect}   from 'react-redux';
import { store, actionSend } from "./store";

function App() {

    const HistoryView = ({history}) => {
        const lastHistory = history && history.data ? history.data.slice(-15) : null
        return (
        <div className='history'>
            { lastHistory ? lastHistory.map( item => (
                <div key={item.timestamp} className='history__message'>
                    <div className='history__message-text'>{item.message}</div>
                    <div className='history__message-nick'>{item.nick} </div>
                    <div className='history__message-date'>{new Date(item.timestamp).toLocaleString()}</div>
                </div>
            )) : 'loading chat history'}
        </div>
    )}

    const History = connect(state => ({history: state.history ? state.history.payload : null }))(HistoryView)

    const MessageView = ({sendingStatus, onSend}) => {
        const [message, setMessage] = React.useState('')
        const [author, setAuthor] = React.useState('user')
        const [disabledBtn, setDisabledBtn] = React.useState(false)

        React.useMemo(() => {
            if(sendingStatus === 'RESOLVED') {
                setMessage('');
                setDisabledBtn(false)
            } else if(sendingStatus === 'PENDING') {
                setDisabledBtn(true)
            }
        }, [sendingStatus])

        const messageChange = (e) => {
            setMessage(e.target.value)
        }

        const authorChange = (e) => {
            setAuthor(e.target.value)
        }

        const handleSend = (e) => {
            onSend({nick: author, message})
        }

        return (
            <div className='message'>
                <textarea onChange={messageChange} value={message}/>
                <input onChange={authorChange} value={author}/>
                <span className={disabledBtn ? 'message__btn disabled' : 'message__btn'} onClick={handleSend}>Send</span>
            </div>
        )
    }

    const Message = connect(state => ({sendingStatus: state.send && state.send.status? state.send.status : null}), {onSend: actionSend})(MessageView)

  return (
      <Provider store={store}>
          <div className="wrapper">
              <History />
              <Message />
          </div>
      </Provider>
  );
}

export default App;
