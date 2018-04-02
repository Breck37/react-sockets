import React, { Component } from 'react';
import logo from './assets/socket-io.svg';
import './App.css';
import { Link } from 'react-router-dom';
import router from './components/router';
import axios from 'axios';

class App extends Component {
  constructor(){
    super();
    this.state = {

    }

    // this.initialize = () => {
    //   axios.get('/').then(response => {
    //     console.log(response, 'hey!')
    //   })}
  }


componentDidMount(){
  axios.get('/init').then(response => {
    console.log('Chat Room Created')
  })
}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
          <h1 className="App-title">Welcome to Socket.IO</h1>
          <h2 className="App-title">Integrated in React</h2>
          </div>
        </header>
        <p className="App-intro">
          "Featuring the fastest and most reliable 'Real-Time' engine"
        </p>
        <Link to='/chat' ><button className='btn'>Enter Chat Room</button></Link>
        <Link to='/white'><button className='btn'>Use Whiteboard</button></Link>
        { router }
      </div>
    );
  }
}

export default App;
// onClick={this.initialize()}