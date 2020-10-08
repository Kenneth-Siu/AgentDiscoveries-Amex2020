import React from 'react';
import {apiGet} from './utilities/request-helper';

const Home = () => (
    <div>
        <Welcome/>
        <TimeZones/>
    </div>
);

const Welcome = () => (
    <div>
        <h1>Hello P.A.T.R.I.O.T. agents</h1>
    </div>
);

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

const TimeZone = ({timeZone}) => (
    <div>
        <span><strong>Time Zone:</strong> {timeZone}</span>
        <span><strong>Time:</strong> {new Date().toLocaleString('en-US', {timeZone})}</span>
    </div>
);

export default Home;