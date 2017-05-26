import React from 'react';

export default (props) => {
    const {
        elementDimensions: {
            width = 0,
            height = 0
        } = {},
        isActive = false,
        isOutside = true,
        point: {
            x = 0,
            y = 0
        } = {}
    } = props;

    return (
        <div>
            {`x: ${x}`}<br />
            {`y: ${y}`}<br />
            {`isActive: ${isActive}`}<br />
            {`Element Width: ${width}`}<br />
            {`Element Height: ${height}`}<br />
            {`isOutside: ${isOutside ? 'true' : 'false'}`}<br />
        </div>
    );
}
