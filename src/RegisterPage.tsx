import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User } from './type'

export interface RegisterPageProps {
    showNotification: (message: string, level: "success" | "error" | "warning" | "info" | undefined) => void;
}

export const RegisterPage = (props: RegisterPageProps) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const onLogin = async () => {
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

    return <div>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
        <button onClick={onLogin}>Login</button>
        <div>
            <p>Already have an account? Click here to <Link to="/login">log in</Link>!</p>
        </div>
    </div>
}
