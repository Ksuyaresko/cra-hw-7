import React from 'react';
import './App.css';
import {Provider, connect}   from 'react-redux';
import { store, actionSend, actionLogout } from "./store";
import { Login } from "./components/login/login";
import Chat from "./components/chat/chat";

function App() {

    const MainView = ({userLogin, logout}) => {
        const [login, setLogin] = React.useState(false)

        const switchLogin = () => {
            setLogin(!login)
        }

        const handleLogout = () => {
            logout();
        }
        return (
            <div className="wrapper">
                <header className="header">
                    Wellcome to Chat
                    {userLogin ? (
                        <span>, <b>{userLogin}</b>
                        <span
                            className={'header__btn'}
                            onClick={handleLogout}>Logout</span>
                        </span>) :
                        <span className={'header__btn'} onClick={switchLogin}>
                            Go To { login ? 'Sign In' : 'Log In'}
                        </span>
                    }
                </header>
                {userLogin ?
                    <Chat /> :
                    <Login login={login} />
                }
            </div>
        )
    }

    const Main = connect(
        state => ({userLogin: state.user.decoded ? state.user.decoded.sub.login : null}),
        {logout: actionLogout})(MainView)

  return (
      <Provider store={store}>
          <Main />
      </Provider>
  );
}

export default App;
