import React from 'react';
import ReactCursorPosition from '../../../dist/ReactCursorPosition';
import InstructionsLabel from './InstructionsLabel';
import PositionLabel from './PositionLabel';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elementDimensions: {
                width: 0,
                height: 0
            },
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
                    <InstructionsLabel className="example__instructions--center" />
                </ReactCursorPosition>
                <PositionLabel
                    {...this.state}
                    {...{
                        className: 'example__external-label',
                        shouldShowIsActive: false
                    }}
                />
            </div>
        );
    }
}
