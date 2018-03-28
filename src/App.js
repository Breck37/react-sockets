import React, { Component } from 'react';
import logo from './assets/socket-io.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Socket.IO</h1>
        </header>
        <p className="App-intro">
          Featuring the fastest and most reliable 'Real-Time' engine
        </p>
      </div>
    );
  }
}

export default App;
