import React, { useState, useEffect } from 'react';

import {apiGet, apiPost, apiPut} from "../../utilities/request-helper";
import Message from "../../message";
import {ControlLabel, Form, FormControl, FormGroup, Button} from "react-bootstrap";
import {FormRow, StyledFormGroup} from "./form.style";
import DegreeDirection from './degree-direction';
import GoogleMap from './google-map';

const VALUES_INITIAL_STATE = {
    siteName: '',
    location: '',
    timeZone: '',
    regionId: '',
    latitude: '',
    longitude: ''
}

export default ({ id }) => {
    const [values, setValues] = useState(VALUES_INITIAL_STATE);
    const {
        siteName,
        location,
        timeZone,
        regionId,
        latitude,
        longitude
    } = values;

    const [isLoaded, setIsLoaded] = useState(false);

    const [error, setError] = useState({});

    useEffect(() => {
        (async () => {
            if (id)
                await loadLocation();
            setIsLoaded(true);
        })();
    }, []);

    const loadLocation = async () => {
        try {
            const location = await apiGet('locations', id);
            setValues({ ...values, ...location });
        } catch (error) {
            handleError(error);
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();

        const body = {
            siteName,
            location,
            timeZone,
            regionId,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        }

        try {
            if (id)
                await apiPut('locations', body, id);
            else
                await apiPost('locations', body);

            window.location.hash = '#/admin/locations';
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = ({ message }) => setError({ message, type: 'danger' });

    const handleChange = ({ target }) => {
        const { name, value } = target;

        setValues({ ...values, [name]: value });
    };

    return (
        <React.Fragment>
            <Message message={error} />
            <Form onSubmit={handleSubmit}>
                <h3>{id ? 'Edit' : 'Create'} Location</h3>
                <FormGroup>
                    <ControlLabel>Site Name</ControlLabel>
                    <FormControl
                        placeholder='Enter site name'
                        name='siteName'
                        value={siteName}
                        required
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Location</ControlLabel>
                    <FormControl
                        placeholder='Enter location name'
                        name='location'
                        value={location}
                        required
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Time zone</ControlLabel>
                    <FormControl
                        placeholder='Enter time zone name'
                        name='timeZone'
                        value={timeZone}
                        required
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Region</ControlLabel>
                    <FormControl
                        type='number'
                        placeholder='Enter region ID (optional)'
                        name='regionId'
                        value={regionId}
                        required
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormRow>
                    <StyledFormGroup>
                        <ControlLabel>Latitude</ControlLabel>
                        <FormRow alignCenter>
                            <FormControl
                                type='number'
                                placeholder='00.000'
                                name='latitude'
                                value={latitude}
                                onChange={handleChange}
                            />
                            <DegreeDirection isNorth />
                        </FormRow>
                    </StyledFormGroup>
                    <StyledFormGroup>
                        <ControlLabel>Longitude</ControlLabel>
                        <FormRow alignCenter>
                            <FormControl
                                type='number'
                                placeholder='00.000'
                                name='longitude'
                                value={longitude}
                                onChange={handleChange}
                            />
                            <DegreeDirection />
                        </FormRow>
                    </StyledFormGroup>
                </FormRow>
                <GoogleMap lat={parseFloat(latitude)} lng={parseFloat(longitude)} title={siteName} isLoaded={isLoaded} />
                <Button type='submit'>Submit</Button>
            </Form>
        </React.Fragment>
    );
}
