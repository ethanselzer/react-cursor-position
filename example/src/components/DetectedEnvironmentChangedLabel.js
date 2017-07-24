import React from 'react';

export default (props) => {
    const {
        detectedEnvironment: {
            isMouseDetected = false,
            isTouchDetected = false
        } = {}
    } = props;
    return (
        <div className="example__external-label">
            {`isMouseDetected: ${isMouseDetected ? 'true' : 'false'}`}<br />
            {`isTouchDetected: ${isTouchDetected ? 'true' : 'false'}`}
        </div>
    );
}
