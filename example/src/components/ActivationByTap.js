import React from 'react';
import ReactCursorPosition, { INTERACTIONS } from '../pkg-lnk/ReactCursorPosition';
import PositionLabel from './PositionLabel';

export default () => (
    <ReactCursorPosition
        className="example__target"
        activationInteractionTouch={INTERACTIONS.TAP}
    >
        {(cursorProps) => (
            <div>
                <PositionLabel {...cursorProps} />
                <div className="example__instructions">
                    Tap to activate. Drag. Tap again to deactivate.
                </div>
            </div>
        )}
    </ReactCursorPosition>
);

