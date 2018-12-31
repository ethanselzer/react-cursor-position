import React from 'react';
import ReactCursorPosition, { INTERACTIONS } from '../pkg-lnk/ReactCursorPosition';
import PositionLabel from './PositionLabel';

export default () => (
    <ReactCursorPosition
        className="example__target"
        activationInteractionTouch={INTERACTIONS.PRESS} // default
        pressDurationInMs={500} //default
        pressMoveThreshold={5} //default
    >
        {(cursorProps) => (
            <div>
                <PositionLabel {...cursorProps} />
                <div className="example__instructions">
                    Press and hold to activate, then drag
                </div>
            </div>
        )}
    </ReactCursorPosition>
);

