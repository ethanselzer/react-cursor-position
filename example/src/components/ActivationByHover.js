import React from 'react';
import ReactCursorPosition, { INTERACTIONS } from '../pkg-lnk/ReactCursorPosition';
import PositionLabel from './PositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default () => (
    <ReactCursorPosition
        className="example__target"
        activationInteractionMouse={INTERACTIONS.HOVER} //default
        hoverDelayInMs={250} //default 0
        hoverOffDelayInMs={150} //default 0
    >
        <PositionLabel />
        <div className="example__instructions">
            <InstructionsLabel />
        </div>
    </ReactCursorPosition>
);

