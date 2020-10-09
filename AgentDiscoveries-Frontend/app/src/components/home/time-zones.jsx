import React from 'react';
import {apiGet} from '../utilities/request-helper';

import TimeZone from './time-zone';

const TimeZones = () => {
    const [timeZones, setTimeZones] = React.useState({});

    React.useEffect(() => {
        apiGet('locations').then(locations => setTimeZones(locations.reduce((timeZones, location) => {
            timeZones[location.timeZone] = true;
            return timeZones;
        }, {}))
        );
    }, []);

    return (
        <div>
            {Object.keys(timeZones).map((timeZone, index) => <TimeZone key={index} timeZone={timeZone}/>) }
        </div>
    );
};

export default TimeZones;