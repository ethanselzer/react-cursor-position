import React from 'react';
import ReactCursorPosition from '../pkg-lnk/ReactCursorPosition';

import PositionLabel from './PositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    render() {
        return (
            <ReactCursorPosition {...{
                className: 'example__target example__target--basic'
            }}>
                {(cursorProps) => (
                    <div>
                        <PositionLabel {...cursorProps} />
                        <InstructionsLabel className="example__instructions" />
                    </div>
                )}
            </ReactCursorPosition>
        );
    }
}
