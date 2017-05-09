import React from 'react';
import ReactCursorPosition from '../../../dist/ReactCursorPosition';
import PositionLabel from './PositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default () => (
    <ReactCursorPosition
        className="example__target"
        pressDuration={1000}
    >
        <PositionLabel />
        <div className="example__instructions">
            <InstructionsLabel />
        </div>
    </ReactCursorPosition>
);

