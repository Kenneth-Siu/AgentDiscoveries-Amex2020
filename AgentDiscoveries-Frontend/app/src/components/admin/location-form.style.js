import styled from "styled-components";
import { FormGroup } from "react-bootstrap";

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

export const StyledDegreeDirection = styled.div`
    display: flex;
    font-size: 16px;
`;

export const DegreeWrapper = styled.span`
    margin: 0 4px 0 2px;
`;

