import React, { Component } from 'react'
import io from 'socket.io-client'

const socket = io();

class White extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.drawing = false;
        //eslint-disable-next-line
        this.canvas;
        //eslint-disable-next-line
        this.ctx;
        //eslint-disable-next-line
        this.current;

        //Both are affected by headers, footers and sidebars. This adjusts so that the pointer stays with the mouse but this takes time to find the right adjustment.
        this.offset = window.innerWidth < 767 ? -250 : 0;
        this.side = window.innerHeight < 767 ? -250 : 0;
    }

    componentDidMount(){
        this.updateCanvas();
    }

    componentDidUpdate(){
        this.updateCanvas();
    }

    updateCanvas(){
        this.canvas = this.refs.canvas
        this.ctx = this.canvas.getContext('2d');
        this.current = {
            color: 'white',
        };
        // canvas.addEventListener('mousedown', onMouseDown, false);
        // canvas.addEventListener('mouseup', onMouseUp, false);
        // canvas.addEventListener('mouseout', onMouseUp, false);
        // canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

        socket.on('drawing', data => this.onDrawingEvent(data));
    }


    //Register all mouse movents 
    onMouseMove(e){
        console.log('1 On Mouse Move')
        if (!this.drawing) {
            return;
          }
          this.drawLine(this.current.x, this.current.y, e.clientX - this.side, e.clientY - this.offset, this.current.color, true);
          this.current.x = e.clientX - this.side;
          this.current.y = e.clientY - this.offset;
    }

    //Register mouse click to begin drawing
    onMouseDown(e){
        console.log('3 On Mouse Down')
        this.drawing = true;
        this.current.x = e.clientX - this.side;
        this.current.y = e.clientY - this.offset;
        console.log('4 Registering Client Coordinates', e.clientY, e.clientX)
    }


    //Register when drawing ends
    onMouseUp(e){
        console.log('6 Mouse has left the building')
        if(!this.drawing){
            return 
        }
        this.drawing = false;
        this.drawLine(this.current.x, this.current.y, e.clientX - this.ide, e.clientY - this.offset, this.current.color, true);
    }
    
    //Draw along coordinates of mouse movement to create line
    drawLine(x0, y0, x1, y1, color, emit){
        console.log('5 Drawing Line')
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
        this.ctx.closePath();

        if(!emit){
            return
        }
        var w = this.canvas.width;
        var h = this.canvas.height;

        socket.emit("draw", {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color
          });
    }

    onDrawingEvent(data){
        var w = this.canvas.width;
        var h = this.canvas.height;
        this.drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }


    //Catch multiple movements before re-rendering to facilitate smoothness
    throttle(callback, delay) {
        console.log('2 Throttling Moves')
        var previousCall = new Date().getTime();
        return function() {
          var time = new Date().getTime();
    
          if (time - previousCall >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
          }
        };
      }

      onResize(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    render() {
        console.log(this.canvas, window.innerWidth)
        return (
            <div>
                <p id='white-intro'>Please scroll down to view the Whiteboard canvas in full-view for accuracy.</p>
                <br/>
                <br/>
                <canvas style={{border: 'solid black 2px', backgroundColor: 'rgb(223, 123, 248)'}} ref='canvas' width={window.innerWidth} height={window.innerHeight} onMouseDown={(e) => this.onMouseDown(e)} onMouseUp={e => this.onMouseUp(e)} onMouseMove={(e) => this.throttle(this.onMouseMove(e), 10)}/>
            </div>
        )
    }
}

export default White;