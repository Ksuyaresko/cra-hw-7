import React from 'react';
import './App.css';
import {Provider, connect}   from 'react-redux';
import { store, actionSend } from "./store";

function App() {
    const HistoryView = ({history}) => (
        <div className='history'>
            { history ? history.map( item => (
                <div key={item.timestamp} className='history__message'>
                    <div className='history__message-text'>{item.message}</div>
                    <div className='history__message-nick'>{item.nick}</div>
                </div>
            )) : 'loading chat history'}
        </div>
    )

    const History = connect(state => ({history: state.history }))(HistoryView)

    const MessageView = ({onSend}) => {
        const [message, setMessage] = React.useState('...')
        const [author, setAuthor] = React.useState('Author')

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
                <textarea onChange={messageChange} />
                <input onChange={authorChange} />
                <span className='message__btn' onClick={handleSend}>Send</span>
            </div>
        )
    }

    const Message = connect(null, {onSend: actionSend})(MessageView)

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
