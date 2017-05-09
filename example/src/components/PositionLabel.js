import React from 'react';

export default (props) => {
    const {
        position: {
            x = 0,
            y = 0
        } = {},
        isActive = false,
        isPositionOutside = false
    } = props;

    return (
        <div>
            {`x: ${x}`}<br />
            {`y: ${y}`}<br />
            {`isActive: ${isActive}`}<br />
            {`isOutside: ${isPositionOutside ? 'true' : 'false'}`}
        </div>
    );
}
