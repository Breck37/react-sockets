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
        }
        this.socket = io();

        this.getMessages = () => {
            axios.get('/chat').then(res => {
                console.log('CDM res', res)
                this.setState(() => ({messages: res.data}))
            }).catch(err => console.log(err))
        }
        this.sendMessage = e => {
            this.socket.emit('SEND_MESSAGE',{
                username: this.state.username,
                message: this.state.messageBody,
                room: this.state.roomNumber
            });
            // console.log('post state', this.state)
            const {username, messageBody, roomNumber} = this.state;
            this.setState({messageBody: '', messages: []});
            axios.post('/chat', {username, messageBody, roomNumber}).then(response => {
                this.setState({messages: [...this.state.messages, response.data]})
            }).catch(err => console.log(err))
            this.getMessages();
        }



    this.socket.on('RECIEVE_MESSAGE', data => {
        console.log(data)
        if(data.roomNumber === this.state.roomNumber){
            addMessage(data);
        }
        // this.setState(prevState => ({
        //     messages
        // }))
    })

    const addMessage = data => {
        this.setState({messages: [...this.state.messages, data]})
    }
}

componentDidMount(){
    //Get messages from server on connection
    axios.get('/chat').then(res => {
        console.log('Chat room messages', res.data)
        this.setState({messages: res.data})
    }).catch(err => console.log(err))
}

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
                return (
                    <span key={i}>
                    <strong style={{color: 'purple', marginLeft: '0', textAlign: 'left'}}>{message.author}:</strong>
                    {' '}{message.message}<br/>
                    {/* <button onClick={() => this.deleteMessage()}>Delete Message</button> */}
                    </span>
                )
            }) : null}
        </div>
        Name:<br/>
        <input className='input-name' type="text" placeholder='Enter name here' onChange={e => this.setState({username: e.target.value})}/><br/>

        Message: <br/>
        <textarea className='input-message' placeholder='Enter message here' type="text" onChange={e => this.setState({messageBody: e.target.value})}/><br/>
        <button className='btn' onClick={this.sendMessage}>Send Message</button>
        </div>
    )
}



}