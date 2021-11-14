import styled from "styled-components";
import { ColorUsage } from "../themes";

export interface ButtonProps {
    colorUsage?: ColorUsage;
}

export const Button = styled.button<ButtonProps>`
    min-height: 25px;
    border: 1px solid ${props => props.theme.colors.button[props.colorUsage || "default"].outline};
    background: ${props => props.theme.colors.button[props.colorUsage || "default"].background.default};
    transition: 80ms;  
    :hover {
        background: ${props => props.theme.colors.button[props.colorUsage || "default"].background.hover};
    }
    :disabled {
        background: ${props => props.theme.colors.button[props.colorUsage || "default"].background.disabled};
    }
`