import React from 'react';
import ReactCursorPosition from '../pkg-lnk/ReactCursorPosition';
import PositionLabel from './PositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    render() {
        const style = {
            height: '250px',
            paddingTop: '10px',
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
