import React from 'react';
import ReactCursorPosition from '../../../dist/ReactCursorPosition';
import PositionChangedLabel from './PositionChangedLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPositionOutside: true,
            position: {
                x: 0,
                y: 0,
            }
        };
    }

    render() {
        return (
            <div className="example">
                <ReactCursorPosition  {...{
                    className: 'example__target',
                    onPositionChanged: props => this.setState(props)
                }}>
                    <InstructionsLabel />
                </ReactCursorPosition>
                <PositionChangedLabel {...this.state} />
            </div>
        );
    }
}
