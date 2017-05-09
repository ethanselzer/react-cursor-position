import React from 'react';

export default (props) => {
    const {
        isPositionOutside = true,
        position: {
            x = 0,
            y = 0,
        } = {}
    } = props;
    return (
        <div className="example__external-label">
            {`x: ${x}`}<br />
            {`y: ${y}`}<br />
            {`isPositionOutside: ${isPositionOutside ? 'true' : 'false'}`}
        </div>
    );
}
