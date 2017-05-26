import React from 'react';
import ReactCursorPosition from '../../../dist/ReactCursorPosition';

import PositionLabel from './PositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    render() {
        return (
            <div className="example">
                <ReactCursorPosition {...{
                    className: 'example__target example__target--basic'
                }}>
                    <PositionLabel />
                    <InstructionsLabel className="example__instructions--low" />
                </ReactCursorPosition>
            </div>
        );
    }
}
