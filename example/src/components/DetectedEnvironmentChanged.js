import React from 'react';
import ReactCursorPosition from '../pkg-lnk/ReactCursorPosition';
import DetectedEnvironmentChangedLabel from './DetectedEnvironmentChangedLabel';
import InstructionsLabel from './InstructionsLabel';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detectedEnvironment: {}
        };
    }

    render() {
        return (
            <div className="example">
                <ReactCursorPosition  {...{
                    className: 'example__target',
                    onDetectedEnvironmentChanged: (detectedEnvironment) => {
                        this.setState({ detectedEnvironment });
                    }
                }}>
                    {() => (
                        <InstructionsLabel className="example__instructions example__instructions--solo"/>
                    )}
                </ReactCursorPosition>
                <DetectedEnvironmentChangedLabel {...this.state} />
            </div>
        );
    }
}
