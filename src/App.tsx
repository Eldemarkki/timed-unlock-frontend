import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ProjectView } from "./ProjectView";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "./store/reducer";
import { setUserData } from "./store/actionCreators";
import { User } from "./type";
import { TopBar } from "./TopBar";
import styled, { ThemeProvider } from "styled-components";
import { DashboardPage } from "./components/DashboardPage";
import { Redirect } from "./utils/Redirect";
import { LightTheme } from "./themes";
import { NotificationsProvider } from "@mantine/notifications";
import { useIsLoggedIn } from "./hooks/useIsLoggedIn";

const ApplicationContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
`;

const PageContainer = styled.div`
  display: flex;
  padding: 10px;
  min-height: 100%;
  flex: 1;
`;

const Index = () => {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  return <Redirect to="/dashboard" />;
};

const App = (): JSX.Element => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["timed-unlock-token"]);

  if (cookies["timed-unlock-token"]) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${cookies["timed-unlock-token"]}`;
  }

  const isLoggedIn = Boolean(cookies["timed-unlock-token"]);
  const dispatch = useDispatch();
  const username = useSelector<AppState>(state => state.user.username);

  useEffect(() => {
    if (isLoggedIn && !username) {
      axios.get<User>("user").then(response => {
        dispatch(setUserData({ ...response.data }));
      }).catch(error => {
        if (error.response.status === 401) navigate("/login");
      });
    }
  }, [dispatch, isLoggedIn, username, navigate]);

  return (
    <ThemeProvider theme={LightTheme}>
      <NotificationsProvider>

        <ApplicationContainer>
          <TopBar />
          <PageContainer>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects/:projectId" element={<ProjectView />} />

              {/* If not page was found for the URL, it should go to the dashboard */}
              <Route path="*" element={<Redirect to="/dashboard" />} />
            </Routes>
          </PageContainer>
        </ApplicationContainer >
      </NotificationsProvider>
    </ThemeProvider>
  );
};

export default App;
