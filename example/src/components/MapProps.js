import React from 'react';
import ReactCursorPosition from 'react-cursor-position';

import PointPositionLabel from './PointPositionLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    render() {
        return (
            <ReactCursorPosition  {...{
                className: 'example__target',
                mapChildProps: props => {
                    const { cursorPosition } = props;
                    return { point: cursorPosition };
                }
            }}>
                <PointPositionLabel />
                <InstructionsLabel />
            </ReactCursorPosition>
        );
    }
}
