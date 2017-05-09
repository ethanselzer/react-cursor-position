import React from 'react';

export default (props) => {
    const {
        isActive = false
    } = props;
    return (
        <div className="example__external-label">
            {`isActive: ${isActive ? 'true' : 'false'}`}
        </div>
    );
}
