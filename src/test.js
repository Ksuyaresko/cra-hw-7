import React, {useState, useMemo} from 'react';
import logo from './logo.svg';
import './App.css';
import {Provider, connect}   from 'react-redux';
import {createStore, combineReducers} from 'redux';

const store = createStore((state, action) =>{
    if (state === undefined){ //redux запускает редьюсер хотя бы раз, что бы инициализировать хранилище
        return {counter: 0};  //обязательно вернуть новый объект, а не изменить текущий state
    }
    if (action.type === 'COUNTER_INC'){ //в каждом action должен быть type
        return {counter: state.counter +1} //создаем новый объект базируясь на данных из предыдущего состояния
    }
    if (action.type === 'COUNTER_DEC'){
        return {counter: state.counter -1}
    }

    if (action.type === 'COUNTER_ADD'){
        return {counter: state.counter +action.amount}
    }
    return state;
})

store.subscribe(()=> console.log(store.getState())) // подписка на обновления store

const actionInc = () => ({type: 'COUNTER_INC'})
const actionDec = () => ({type: 'COUNTER_DEC'})
const actionAdd = (amount) => ({type: 'COUNTER_ADD', amount})

store.dispatch(actionInc())
store.dispatch(actionDec())
store.dispatch(actionAdd(50))

setInterval(() => store.dispatch(actionAdd(10)), 2000)

const CounterView = ({value, inc, dec}) =>
<div>
    <button onClick={dec}>-</button>
        {value}
    <button onClick={inc}>+</button>
</div>

const CounterContainer = ({value:initialValue}) => {
    const [value, setValue] = useState(initialValue)
    useMemo(() => (setValue(initialValue)), [initialValue])

    return (
        <CounterView value={value} 
                     inc={() => setValue(value +1)} 
                     dec={() => setValue(value - 1)}/>
    )
}

let connector = connect(state =>({value: state.counter}), 
                                {inc: actionInc, dec: actionDec})
const Counter = connector(CounterView)
const BolshoeTablo = connector(({value}) => <h1>{value}</h1>)


function App() {
  return (
    <Provider store={store}>
        <div className="App">
          <CounterView value={5} />
          <CounterContainer value={10}/>
          <CounterContainer value={10}/>
          <Counter />
          <Counter />
          <BolshoeTablo />
        </div>
    </Provider>
  );
}

export default App;
