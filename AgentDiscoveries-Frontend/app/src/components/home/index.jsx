import React from 'react';

import Welcome from './welcome';
import TimeZones from './time-zones';

const Home = () => (
    <div className='col-md-8 col-md-offset-2'>
        <Welcome/>
        <TimeZones/>
    </div>
);

export default Home;