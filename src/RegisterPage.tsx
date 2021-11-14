import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CenteredTextH1, ColoredLink } from './components/styled/text'
import { AuthDialogContainer, FlexWidthHeight100Centered } from './components/styled/containers'
import { User } from './type'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Form, Formik } from 'formik'
import * as Yup from "yup";
import styled from 'styled-components'
import { FormErrorNotification } from './components/forms/FormErrorNotification'

const RegistrationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string().required("Password is required")
})

const FormField = styled.div`
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
`

export const InputLabel = styled.span`
    display: inline-block;
    min-width: 90px;
`

export const FormFieldContainer = styled.div`
    margin-bottom: 15px;
`

export interface RegisterPageProps {
    showNotification: (message: string, level: "success" | "error" | "warning" | "info" | undefined) => void;
}

export const RegisterPage = (props: RegisterPageProps) => {
    const navigate = useNavigate();

    const onRegister = async (email: string, password: string) => {
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
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={RegistrationSchema}
                onSubmit={values => onRegister(values.email, values.password)} >
                {({ errors, values, setFieldValue, isValid }) =>
                    <Form>
                        <FormFieldContainer>
                            <FormField>
                                <InputLabel>Email: </InputLabel>
                                <Input type="email" placeholder="Email" value={values.email} onChange={(e) => setFieldValue("email", e.currentTarget.value)} hasErrors={Boolean(errors.email)} />
                            </FormField>
                            <FormErrorNotification error={errors.email} />
                        </FormFieldContainer>
                        <FormFieldContainer>
                            <FormField>
                                <InputLabel>Password: </InputLabel>
                                <Input required name="password" type="password" placeholder="Password" value={values.password} onChange={(e) => setFieldValue("password", e.currentTarget.value)} hasErrors={Boolean(errors.password)} />
                            </FormField>
                            <FormErrorNotification error={errors.password} />
                        </FormFieldContainer>
                        <Button type="submit" colorUsage="primary" disabled={!isValid}>Register</Button>
                    </Form>
                }
            </Formik>
            <p>Already have an account? <ColoredLink to="/login">Log in!</ColoredLink></p>
        </AuthDialogContainer>
    </FlexWidthHeight100Centered>
}
