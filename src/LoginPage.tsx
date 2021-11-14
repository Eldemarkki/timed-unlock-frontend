import axios from "axios"
import { useCookies } from "react-cookie"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CenteredTextH1, ColoredLink } from "./components/styled/text";
import { AuthDialogContainer, FlexWidthHeight100Centered } from "./components/styled/containers";
import { setUserData } from "./store/actionCreators";
import { LoginToken } from "./type";
import { Button } from "./components/Button";
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import styled from "styled-components";
import { Input } from "./components/Input";
import { FormErrorNotification } from "./components/forms/FormErrorNotification";

export interface LoginPageProps {
    showNotification: (message: string, level: "success" | "error" | "warning" | "info" | undefined) => void;
}

const LoginSchema = Yup.object().shape({
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

export const LoginPage = ({ showNotification }: LoginPageProps) => {
    const [, setCookie] = useCookies(['timed-unlock-token']);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const onLogin = async (email: string, password: string) => {
        axios.post<LoginToken>("user/login", { email, password })
            .then(response => {
                const token = response.data.token
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
                setCookie("timed-unlock-token", token, { path: "/" });
                showNotification("Logged in successfully", "success");
                dispatch(setUserData({ email: response.data.email, _id: response.data.id }));
                navigate("/");
            }).catch((error) => {
                console.log(error)
                showNotification("Invalid email or password", "error");
            })
    }

    return <FlexWidthHeight100Centered>
        <AuthDialogContainer>
            <CenteredTextH1>Login</CenteredTextH1>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={values => onLogin(values.email, values.password)} >
                {({ errors, values, setFieldValue, isValid }) => <Form>
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
                    <Button colorUsage="primary" type="submit" disabled={!isValid}>Login</Button>
                </Form>}
            </Formik>

            <p>Don't have an account yet? <ColoredLink to="/register">Register now!</ColoredLink></p>
        </AuthDialogContainer>
    </FlexWidthHeight100Centered>
}