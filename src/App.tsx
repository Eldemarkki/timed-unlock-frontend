import React, { useEffect } from 'react';
import NotificationSystem from 'react-notification-system';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProjectList } from './ProjectList';
import { ProjectView } from "./ProjectView";
import { ProjectViewEditor } from './ProjectViewEditor';
import { LoginPage } from './LoginPage';
import { PrivateRoute } from './PrivateRoute';
import { RegisterPage } from './RegisterPage';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from './store/reducer';
import { setUserData } from './store/actionCreators';
import { User } from './type';

const App = (): JSX.Element => {
  const location = useLocation();
  let state = location.state as { backgroundLocation?: Location }
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(['timed-unlock-token']);

  if (cookies["timed-unlock-token"]) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${cookies["timed-unlock-token"]}`
  }

  const notificationSystem: React.RefObject<NotificationSystem.System> = React.createRef();

  const showNotification = (message: string, level: "success" | "error" | "warning" | "info" | undefined) => {
    notificationSystem.current?.addNotification({ message, level })
  }

  const isLoggedIn = Boolean(cookies["timed-unlock-token"])
  const dispatch = useDispatch();
  const userEmail = useSelector<AppState>(state => state.user.email);

  useEffect(() => {
    if (isLoggedIn && !userEmail) {
      axios.get<User>("user").then(response => {
        dispatch(setUserData({ ...response.data }));
      }).catch(error => {
        if (error.response.status === 401) navigate("/login");
      })
    }
  }, [dispatch, isLoggedIn, userEmail, navigate])

  return (
    <div>
      <h1>Timed-unlock</h1>
      {isLoggedIn && <div>
        <p>Logged in as {userEmail}</p>
        <button onClick={(e) => { removeCookie("timed-unlock-token"); navigate("/login") }}>Log out</button>
      </div>}

      <NotificationSystem ref={notificationSystem} />
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/login" element={<LoginPage showNotification={showNotification} />} />
        <Route path="/register" element={<RegisterPage showNotification={showNotification} />} />
        <PrivateRoute path="/" element={<ProjectList />} />
        <PrivateRoute path="/projects" element={<ProjectList />} />
        <PrivateRoute path="/projects/:projectId" element={<ProjectView />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <PrivateRoute path="/projects/:projectId/edit" element={<ProjectViewEditor />} />
        </Routes>
      )}
    </div >
  );
}

export default App;
