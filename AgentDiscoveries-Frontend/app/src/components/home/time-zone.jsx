import React from 'react';

const TimeZone = ({timeZone}) => (
    <div>
        <span><strong>Time Zone:</strong> {timeZone}</span>
        <p></p>
        <span><strong>Time:</strong> {new Date().toLocaleString('en-US', {timeZone})}</span>
        <p></p>
    </div>
);

export default TimeZone;