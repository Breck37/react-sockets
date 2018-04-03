import React, { Component } from 'react';
import './components.css';
import axios from 'axios';
import '../App.css';

//There is no need to add or install the socket.io-client library,
//it comes included in the original socket.io package and is used on the browser-side of the socket connection
import io from 'socket.io-client';

// There is no specific direction when creating the global socket, it defaults to trying to connect to the host that serves the page AKA the server


export default class Chat extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            roomNumber: 1,
            messageBody: '',
            username: '',
            typers: [],
        }
        this.socket = io();
        this.typing = false;
        this.timer = null;
        // this.getMessages = () => {
        //     axios.get('/chat').then(res => {
        //         console.log('CDM res', res)
        //         this.setState(() => ({messages: res.data}))
        //     }).catch(err => console.log(err))
        // }
        this.sendMessage = e => {
            e.preventDefault();
            if(this.state.username === ''){
                alert('Please Enter your name')
            } else if (this.state.messageBody === ''){
                alert('Please Enter a message')
            } else {

                this.socket.emit('SEND_MESSAGE',{
                    username: this.state.username,
                    messageBody: this.state.messageBody,
                    room: this.state.roomNumber
                });
            }

            // console.log('post state', this.state)
            // const {username, messageBody, roomNumber} = this.state;
            this.setState({messageBody: '', messages: []});
            // axios.post('/chat', {username, messageBody, roomNumber}).then(response => {
            //     console.log('post', response)
            //     this.setState({messages: response.data})
            // }).catch(err => console.log(err))
            // setTimeout(() => {
            //     this.getMessages();
            // }, 500)
        }



    this.socket.on('RECEIVE_MESSAGE', data => {
            console.log('Hey', data)
            addMessage(data);
            // this.setState({messages: [...this.state.messages, data]})
            // this.getMessages();
        // this.setState(prevState => ({
        //     messages
        // }))
    })

    // this.socket.on('previousTyping')

    const addMessage = data => {
        console.log('add', data)
        this.setState({messages: data})
        setTimeout(() => console.log(this.state.messages))
    }

    this.isTyping = () => {
        console.log('typing')
        this.typing = true;
        this.socket.emit('isTyping', this.state.username)
        setTimeout(() => {
            this.typing = false;
            this.socket.emit('stopTyping', this.state.username)
        },1000)
    }

    this.socket.on('currentTyper', name => {
        let currentTypers = this.state.typers;
        console.log(name, currentTypers)
       if(currentTypers.indexOf(name) == -1){
            currentTypers.push(name)
       }
        this.setState({
            typers: currentTypers
        })
    })

    this.socket.on('previousTyper', name => {
        let previousTypers = this.state.typers;
        previousTypers.forEach((e, i, a) => {
            if( e === name){
                console.log('splice')
                a.splice(i, 1)
            }
        })
        this.setState({
            typers: previousTypers
        })
    })
}

//////////NEEDED IF USING DATABASE//////////////
// componentDidMount(){
//    // Get messages from server on connection
//     setInterval(() => {axios.get('/chat').then(res => {
//         console.log('Chat room messages', res.data)
//         this.setState({messages: res.data})
//     }).catch(err => console.log(err))}, 1000);
//     axios.get('/chat').then(res => {
//             console.log('Chat room messages', res.data)
//             this.setState({messages: res.data})
//         }).catch(err => console.log(err))
// }

deleteMessage(){
    axios.delete('/chat/delete').then(response => {
        this.setState({
            messages: response.data
        })
    })
}


render(){
    // console.log(this.state.messages)
    return (
        <div className='grand-dad'>
        <div id='messages'>
            {this.state.messages.length ? this.state.messages.map((message,i) => {
                // console.log(message.username, message.messageBody)
                return (
                    <span key={i}>
                    <strong style={{color: 'purple', marginLeft: '0', textAlign: 'left'}}>{message.username}:</strong>
                    {' '}{message.messageBody}<br/>
                    {/* <button onClick={() => this.deleteMessage()}>Delete Message</button> */}
                    </span>
                )
            }) : null}
            
        </div>
        {this.state.typers.length < 4? this.state.typers.map((typer, i) => {
                return (

                    <span key={i} style={{color: 'black', marginRight: '10px'}}>{typer + ' is typing...'}</span>
                )
            }) : this.state.length >=4 ? <p>There are multiple users typing...</p> : null}
            <br/>
            <br/>
        Name:<br/>
        <input className='input-name' type="text" placeholder='Enter name here' onChange={e => this.setState({username: e.target.value})}/><br/>

        Message: <br/>
        <textarea className='input-message' placeholder='Enter message here' type="text" value={this.state.messageBody} onKeyPress={() => this.isTyping()} onChange={e => this.setState({messageBody: e.target.value})}/><br/>
        <button className='btn' onClick={this.sendMessage}>Send Message</button>
        </div>
    )
}


}