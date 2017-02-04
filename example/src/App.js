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
                    mapChildProps: props => {
                        const {
                            cursorPosition: {
                                x,
                                y,
                                isOutside
                            }
                        } = props;

                        return {
                            point: {
                                x,
                                y
                            },
                            isPointOutside: isOutside
                        };
                    },
                    onCursorPositionChanged: cursorPosition => {
                        this.setState({ cursorPosition });
                    }
                }}>
                    <Label {...{
                        mapPropsToContet: props => `x: ${props.point.x}`
                    }} />

                    <Label {...{
                        mapPropsToContet: props => `y: ${props.point.y}`
                    }} />

                    <Label {...{
                        mapPropsToContet: props => `isOutside: ${ props.isPointOutside ? 'true' : 'false'}`
                    }} />
                </ReactCursorPosition>

                <Label {...this.state} {...{
                    mapPropsToContet: props => `x: ${props.cursorPosition.x}`
                }} />

                <Label {...this.state} {...{
                    mapPropsToContet: props => `y: ${props.cursorPosition.y}`
                }} />

                <Label {...this.state} {...{
                    mapPropsToContet: props => `isOutside: ${props.cursorPosition.isOutside ? 'true' : 'false'}`
                }} />
            </div>
        );
    }
}

export default App;

const Label = props => (
    <div>
        {props.mapPropsToContet(props)}
    </div>
);
