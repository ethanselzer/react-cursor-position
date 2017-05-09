import React from 'react';
import ReactCursorPosition from '../../../dist/ReactCursorPosition';
import PositionLabel from './PositionLabel';

export default () => (
    <ReactCursorPosition
        className="example__target"
        isActivatedOnTouch
    >
        <PositionLabel />
        <div className="example__instructions">
            Touch and Drag In This Area
        </div>
    </ReactCursorPosition>
);

