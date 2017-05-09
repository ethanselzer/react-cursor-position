import React from 'react';
import ReactCursorPosition from '../../../dist/ReactCursorPosition';
import PointPositionLabel from './PointPositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default () => (
    <ReactCursorPosition
        className="example__target"
        mapChildProps={({ isPositionOutside, position }) => {
            return {
                isOutside: isPositionOutside,
                point: position
            };
        }}
    >
        <PointPositionLabel />
        <InstructionsLabel />
    </ReactCursorPosition>
);
