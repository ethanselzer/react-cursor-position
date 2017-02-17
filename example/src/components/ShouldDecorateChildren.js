import React from 'react';
import ReactCursorPosition from 'react-cursor-position';

import CursorPositionLabel from './CursorPositionLabel';
import InstructionsLabel from './InstructionsLabel';


export default class extends React.Component {
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
            <div className="example">
                <ReactCursorPosition  {...{
                    className: 'example__target',
                    onCursorPositionChanged: cursorPosition => {
                        this.setState({ cursorPosition });
                    },
                    shouldDecorateChildren: false
                }}>
                    <CursorPositionLabel />
                    <InstructionsLabel />
                </ReactCursorPosition>
                <CursorPositionLabel {...this.state} />
            </div>
        );
    }
}
