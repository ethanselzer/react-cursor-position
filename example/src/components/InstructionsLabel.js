import React from 'react';

export default ({ className }) => (
    <div className={`${className ? className: ''} example__instructions`}>
         Long Touch and Drag Or Hover Here
    </div>
);
