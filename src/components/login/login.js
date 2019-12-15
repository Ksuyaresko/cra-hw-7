import React from 'react';
import { connect }   from 'react-redux';
import { actionLogin, actionSignin } from "../../store";
import './login.css'

function LoginView({loginProp, authorize, signin}) {
  const [login, setLogin] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfPassword] = React.useState('')

  const handleLoginChange = (e) => {
    setLogin(e.target.value)
  }
  const handlePassChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = () => {
      loginProp ? authorize({login, password}) : signin({login, password})
  }

  const handleConfPassChange = () => {

    }

  return (
      <div className="login">
        <header className="login__header">
            <span>Please, {loginProp ? 'Log In' : 'Sign In'}</span>
        </header>
        <div className="login__input-box">
          <input
              name="login"
              type="text"
              placeholder='login'
              value={login}
              onChange={handleLoginChange}/>
        </div>
        <div className="login__input-box">
          <input
              name="password"
              type="password"
              placeholder='password'
              value={password}
              onChange={handlePassChange}/>
        </div>
          {!loginProp && <div className="login__input-box">
              <input
                  name="confirm-password"
                  type="password"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={handleConfPassChange}/>
          </div>}
        <div className="login__input-box">
          <div className="login__btn" onClick={handleSubmit}>
              {loginProp ? 'Log In' : 'Sign In'}
          </div>
        </div>
      </div>
  );
}

export const Login = connect(
        (state, own) => ({loginProp: own.login}),
        {authorize: actionLogin, signin: actionSignin}
    )(LoginView)
