import React from 'react';

const PositionLabel = (props) => {
    const {
        elementDimensions: {
            width = 0,
            height = 0
        } = {},
        position: {
            x = 0,
            y = 0
        } = {},
        isActive = false,
        isPositionOutside = false
    } = props;

    return (
        <div className={props.className}>
            {`x: ${x}`}<br />
            {`y: ${y}`}<br />
            {props.shouldShowIsActive && [`isActive: ${isActive}`, <br key="line-break"/>]}
            {`Element Width: ${width}`}<br />
            {`Element Height: ${height}`}<br />
            {`isOutside: ${isPositionOutside ? 'true' : 'false'}`}
        </div>
    );
};

PositionLabel.defaultProps = {
    shouldShowIsActive: true
};

export default PositionLabel;
