import React from 'react';
import ReactCursorPosition from 'react-cursor-position';

import CursorPositionLabel from './CursorPositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    render() {
        const style = {
            height: '350px',
            position: 'relative',
            border: '1px solid #ccc',
            borderRadius: '4px',
            textAlign: 'center'
        };

        return (
            <ReactCursorPosition {...{ style }}>
                <CursorPositionLabel />
                <InstructionsLabel />
            </ReactCursorPosition>
        );
    }
}
