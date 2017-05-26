import React from 'react';
import ReactCursorPosition from '../../../dist/ReactCursorPosition';
import ActivationChangedLabel from './ActivationChangedLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        };
    }

    render() {
        return (
            <div className="example">
                <ReactCursorPosition  {...{
                    className: 'example__target',
                    onActivationChanged: ({ isActive }) => {
                        this.setState({ isActive });
                    }
                }}>
                    <InstructionsLabel className="example__instructions--center"/>
                </ReactCursorPosition>
                <ActivationChangedLabel {...this.state} />
            </div>
        );
    }
}
