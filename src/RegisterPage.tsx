import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CenteredTextH1, ColoredLink } from './components/styled/text'
import { AuthDialogContainer, FlexWidthHeight100Centered } from './components/styled/containers'
import { AuthEmailField, AuthPasswordField } from './components/styled/authComponents'
import { User } from './type'
import { Button } from './components/Button'

export interface RegisterPageProps {
    showNotification: (message: string, level: "success" | "error" | "warning" | "info" | undefined) => void;
}

export const RegisterPage = (props: RegisterPageProps) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const onRegister = async () => {
        axios.post<User>("user/register", { email, password })
            .then(response => {
                props.showNotification("Registered successfully!", "success");
                navigate("/login");
            }).catch((error) => {
                console.log(error)
                if (error.response.status === 409) {
                    props.showNotification("A user with that email already exists. Did you mean to log in?", "error");
                } else {
                    props.showNotification("An error occurred", "error");
                }
            })
    }

    return <FlexWidthHeight100Centered>
        <AuthDialogContainer>
            <CenteredTextH1>Register</CenteredTextH1>
            <AuthEmailField type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
            <AuthPasswordField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
            <Button colorUsage="primary" onClick={onRegister}>Register</Button>
            <p>Already have an account? <ColoredLink to="/login">Log in!</ColoredLink></p>
        </AuthDialogContainer>
    </FlexWidthHeight100Centered>
}
