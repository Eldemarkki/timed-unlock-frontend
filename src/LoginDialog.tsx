import axios from "axios"
import { useState } from "react"

export interface LoginDialogProps {
    addNotification: (message: string, level: "success" | "error" | "warning" | "info" | undefined) => void;
    onSuccessfulLogin: (token: string) => void;
}

export const LoginDialog = ({ addNotification, onSuccessfulLogin }: LoginDialogProps) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onLogin = async () => {
        axios.post("user/login", {
            email, password
        }).then(response => {
            const token = response.data.token
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            onSuccessfulLogin(token);
            addNotification("Logged in successfully", "success");
        }).catch(() => {
            addNotification("Invalid email or password", "error");
        })
    }

    return <div>
        <input type="text" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
        <button onClick={onLogin}>Login</button>
    </div>
}