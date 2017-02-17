import React from 'react';
import ReactCursorPosition from 'react-cursor-position';

import CursorPositionLabel from './CursorPositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    render() {
        return (
            <div className="example">
                <ReactCursorPosition {...{
                    className: 'example__target example__target--basic'
                }}>
                    <CursorPositionLabel />
                    <InstructionsLabel />
                </ReactCursorPosition>
            </div>
        );
    }
}
