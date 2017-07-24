import React from 'react';
import ReactCursorPosition from '../pkg-lnk/ReactCursorPosition';
import PositionLabel from './PositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default () => (
    <ReactCursorPosition
        className="example__target"
        hoverDelayInMs={1000}
        hoverOffDelayInMs={500}
    >
        <PositionLabel />
        <div className="example__instructions">
            <InstructionsLabel />
        </div>
    </ReactCursorPosition>
);

