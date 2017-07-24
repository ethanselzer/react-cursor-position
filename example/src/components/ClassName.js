import React from 'react';
import ReactCursorPosition from '../pkg-lnk/ReactCursorPosition';
import PositionLabel from './PositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default () => (
    <ReactCursorPosition className="example__target" >
        <PositionLabel />
        <InstructionsLabel />
    </ReactCursorPosition>
);

