
import React from 'react'
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppState } from './store/reducer';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { Button } from './components/Button';

const Container = styled.div`
    background-color: ${props => props.theme.colors.background};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 30px;
`

const RightContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const LogOutButton = styled(Button)`
    margin-left: 20px;
    min-height: 30px;
    min-width: 70px;
`

const ProjectName = styled(Link)`
    margin-top: 15px;
    font-size: 2rem;
    text-decoration: none;
    color: inherit;
`

export const TopBar = () => {
    const [cookies, , removeCookie] = useCookies(['timed-unlock-token']);
    const navigate = useNavigate();

    const userEmail = useSelector<AppState>(state => state.user.email);
    const isLoggedIn = Boolean(cookies["timed-unlock-token"])

    return (
        <Container>
            <ProjectName to="/dashboard">Timed-unlock</ProjectName>
            {isLoggedIn && <RightContainer>
                <p>Logged in as {userEmail}</p>
                <LogOutButton onClick={(e) => { removeCookie("timed-unlock-token"); navigate("/login") }}>Log out</LogOutButton>
            </RightContainer>}
        </Container>
    )
}
