import React from 'react';
import ReactCursorPosition from '../../../dist/ReactCursorPosition';
import PointPositionLabel from './PointPositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default () => (
    <ReactCursorPosition
        className="example__target"
        mapChildProps={({ elementDimensions, isActive, isPositionOutside, position }) => {
            return {
                elementDimensions,
                isActive,
                isOutside: isPositionOutside,
                point: position
            };
        }}
    >
        <PointPositionLabel />
        <InstructionsLabel />
    </ReactCursorPosition>
);
