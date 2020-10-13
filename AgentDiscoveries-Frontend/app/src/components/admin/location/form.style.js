import styled from 'styled-components';
import {FormGroup} from "react-bootstrap";

export const FormRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: ${props => props.alignCenter ? 'center' : 'start'};
`;

export const StyledFormGroup = styled(FormGroup)`
    flex: 1;
    
    &:first-child {
        margin-right: 15px;
    }
`;