import React from 'react';

import {StyledDegreeDirection, DegreeWrapper} from './degree-direction.style';

export default ({ isNorth }) => (
    <StyledDegreeDirection>
        <DegreeWrapper>&deg;</DegreeWrapper>
        <span>{isNorth ? 'N' : 'W'}</span>
    </StyledDegreeDirection>
);
