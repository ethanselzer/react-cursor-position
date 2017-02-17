import React from 'react';
import ReactCursorPosition from 'react-cursor-position';

import CursorPositionLabel from './CursorPositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default () => (
    <ReactCursorPosition className="example__target">
        <CursorPositionLabel />
        <InstructionsLabel />
    </ReactCursorPosition>
);

