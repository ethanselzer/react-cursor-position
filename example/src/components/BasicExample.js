import React from 'react';
import ReactCursorPosition, { INTERACTIONS } from '../pkg-lnk/ReactCursorPosition';

import PositionLabel from './PositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    render() {
        return (
            <ReactCursorPosition {...{
                className: 'example__target example__target--basic',
                activationInteractionTouch: INTERACTIONS.TAP,
                hoverDelayInMs: 250,
                hoverOffDelayInMs: 350
            }}>
                <PositionLabel />
                <InstructionsLabel className="example__instructions" />
            </ReactCursorPosition>
        );
    }
}
