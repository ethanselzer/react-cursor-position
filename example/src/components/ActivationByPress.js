import React from 'react';
import ReactCursorPosition, { INTERACTIONS } from '../pkg-lnk/ReactCursorPosition';
import PositionLabel from './PositionLabel';

export default () => (
    <ReactCursorPosition
        className="example__target"
        activationInteractionTouch={INTERACTIONS.PRESS} // default
        pressDuration={500} //default
        pressMoveThreshold={5} //default
    >
        <PositionLabel />
        <div className="example__instructions">
            Press and hold to activate, then drag
        </div>
    </ReactCursorPosition>
);

