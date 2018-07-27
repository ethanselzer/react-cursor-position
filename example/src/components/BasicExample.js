import React from 'react';
import ReactCursorPosition from '../pkg-lnk/ReactCursorPosition';
import { INTERACTIONS } from '../pkg-lnk/es/constants';

import PositionLabel from './PositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    render() {
        return (
            <ReactCursorPosition {...{
                className: 'example__target example__target--basic',
                activationInteraction: INTERACTIONS.TAP
            }}>
                <PositionLabel />
                <InstructionsLabel className="example__instructions" />
            </ReactCursorPosition>
        );
    }
}
