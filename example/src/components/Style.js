import React from 'react';
import ReactCursorPosition from '../../../dist/ReactCursorPosition';
import PositionLabel from './PositionLabel';
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
                <PositionLabel />
                <InstructionsLabel />
            </ReactCursorPosition>
        );
    }
}
