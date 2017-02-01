import React, { Component } from 'react';
import ReactCursorPosition from 'react-cursor-position';

import logo from './logo.svg';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cursorPosition: {
                x: 0,
                y: 0,
                isOutside: true
            }
        }
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                <ReactCursorPosition  {...{
                    style: {
                        width: '400px',
                        height: '400px',
                        margin: '0 auto',
                        border: 'solid 1px green'
                    },
                    onCursorPositionChanged: (cursorPosition) => {
                        this.setState({ cursorPosition });
                    }
                }}>
                    <Label />
                    <Label {...{
                        mapCursorPositionToContent: cp => `y: ${cp.y}`
                    }} />
                    <Label {...{
                        mapCursorPositionToContent: cp => `isOutside: ${ cp.isOutside ? 'true' : 'false'}`
                    }} />
                </ReactCursorPosition>
                <Label {...this.state} />
                <Label {...this.state} {...{
                    mapCursorPositionToContent: cp => `y: ${cp.y}`
                }} />
                <Label {...this.state} {...{
                    mapCursorPositionToContent: cp => `isOutside: ${ cp.isOutside ? 'true' : 'false'}`
                }} />
            </div>
        );
    }
}

export default App;

const Label = (props) => {
    return (
        <div>
            { props.mapCursorPositionToContent(props.cursorPosition) }
        </div>
    );
}

Label.defaultProps = {
    mapCursorPositionToContent: cp => `x: ${cp.x}`
}
