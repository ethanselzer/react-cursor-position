import React from 'react';

export default (props) => {
    const {
        point: {
            x = 0,
            y = 0,
            isOutside = true
        } = {}
    } = props;

    return (
        <div>
            {`x: ${x}`}<br />
            {`y: ${y}`}<br />
            {`isOutside: ${isOutside ? 'true' : 'false'}`}<br />
        </div>
    );
}
