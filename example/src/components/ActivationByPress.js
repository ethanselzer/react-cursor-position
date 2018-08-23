import React from 'react';
import ReactCursorPosition, { INTERACTIONS } from '../pkg-lnk/ReactCursorPosition';
import PositionLabel from './PositionLabel';

export default () => (
    <ReactCursorPosition
        className="example__target"
        activationInteractionTouch={INTERACTIONS.TAP}
    >
        <PositionLabel />
        <div className="example__instructions">
            Press and hold to activate, then drag
        </div>
    </ReactCursorPosition>
);

