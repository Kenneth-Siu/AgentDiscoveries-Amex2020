import React, { useState, useEffect } from 'react';
import {Button, ControlLabel, Form, FormControl, FormGroup} from 'react-bootstrap';
import {StyledDegreeDirection, DegreeWrapper, FormRow, StyledFormGroup} from "./location-form.style";
import {apiGet, apiPost, apiPut} from '../utilities/request-helper';
import Message from '../message';

const DegreeDirection = ({ isNorth }) => (
    <StyledDegreeDirection>
        <DegreeWrapper>&deg;</DegreeWrapper>
        <span>{isNorth ? 'N' : 'W'}</span>
    </StyledDegreeDirection>
);

const LocationForm = ({ id }) => {
    const [values, setValues] = useState({
        siteName: '',
        location: '',
        timeZone: '',
        regionId: ''
    });

    const { siteName, location, timeZone, regionId } = values;

    const [message, setMessage] = useState({});

    useEffect(() => {
        (async () => {
            if (id) await loadLocation(id)
        })();
    }, []);


    const handleTextChange = event => {
        const { name, value } = event;
        setValues({ ...values, [name]: value });
    }

    const handleNumberChange = event => {
        const { name, value } = event;
        setValues({ ...values, [name]: parseInt(value) });
    }

    const handleSubmit = async event => {
        event.preventDefault();

        const body = { siteName, location, timeZone, regionId };

        try {
            if (id) {
                await apiPut('locations', body, id);
            } else {
                await apiPost('locations', body);
            }

            window.location.hash = '#/admin/locations';
        } catch (error) {
            setMessage({ message: error.message, type: 'danger' })
        }
    }


    const loadLocation = async () => {
        try {
            setValues(await apiGet('locations', id));
        } catch (error) {
            setMessage({ message: error.message, type: 'danger' });
        }
    };

    return (
        <div className='col-md-8 col-md-offset-2'>
            <Message message={message} />
            <div className='col-md-12'>
                <Form onSubmit={handleSubmit}>
                    <h3>{id ? 'Edit' : 'Create'} Location</h3>

                    <FormGroup>
                        <ControlLabel>Site Name</ControlLabel>
                        <FormControl type='text' required
                                     placeholder='Enter site name'
                                     value={siteName}
                                     onChange={handleTextChange}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Location Name</ControlLabel>
                        <FormControl type='text' required
                                     placeholder='Enter location name'
                                     value={location}
                                     onChange={handleTextChange}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Time Zone</ControlLabel>
                        <FormControl type='text' required
                                     placeholder='Enter time zone (e.g. "Europe/London")'
                                     value={timeZone}
                                     onChange={handleTextChange}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Region</ControlLabel>
                        <FormControl type='number'
                                     placeholder='Enter region ID (optional)'
                                     value={regionId}
                                     onChange={handleNumberChange}/>
                    </FormGroup>
                    <FormRow>
                        <StyledFormGroup>
                            <ControlLabel>Latitude</ControlLabel>
                            <FormRow alignCenter>
                                <FormControl type='number'
                                             placeholder='00.000'/>
                                <DegreeDirection isNorth />
                            </FormRow>
                        </StyledFormGroup>
                        <StyledFormGroup>
                            <ControlLabel>Longitude</ControlLabel>
                            <FormRow alignCenter>
                                <FormControl type='number'
                                             placeholder='00.000'/>
                                <DegreeDirection />
                            </FormRow>
                        </StyledFormGroup>
                    </FormRow>
                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        </div>
    );
}

export default LocationForm;

