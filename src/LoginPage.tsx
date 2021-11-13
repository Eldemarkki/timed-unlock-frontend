import axios from "axios"
import { useState } from "react"
import { useCookies } from "react-cookie"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CenteredTextH1, ColoredLink } from "./components/styled/text";
import { AuthDialogContainer, FlexWidthHeight100Centered } from "./components/styled/containers";
import { AuthEmailField, AuthPasswordField } from "./components/styled/authComponents";
import { setUserData } from "./store/actionCreators";
import { LoginToken } from "./type";
import { Button } from "./components/Button";

export interface LoginPageProps {
    showNotification: (message: string, level: "success" | "error" | "warning" | "info" | undefined) => void;
}

export const LoginPage = ({ showNotification }: LoginPageProps) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [, setCookie] = useCookies(['timed-unlock-token']);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const onLogin = async () => {
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
            <AuthEmailField type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
            <AuthPasswordField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
            <Button colorUsage="primary" onClick={onLogin}>Login</Button>
            <p>Don't have an account yet? <ColoredLink to="/register">Register now!</ColoredLink></p>
        </AuthDialogContainer>
    </FlexWidthHeight100Centered>
}