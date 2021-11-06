import React from 'react';
import { LoginDialog } from './LoginDialog';
import NotificationSystem from 'react-notification-system';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ProjectList } from './ProjectList';
import { ProjectView } from "./ProjectView";
import { ProjectViewEditor } from './ProjectViewEditor';

const App = (): JSX.Element => {
  const location = useLocation();
  let state = location.state as { backgroundLocation?: Location }

  const [cookies, setCookie, removeCookie] = useCookies(['timed-unlock-token']);

  if (cookies["timed-unlock-token"]) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${cookies["timed-unlock-token"]}`
  }

  const notificationSystem: React.RefObject<NotificationSystem.System> = React.createRef();

  return (
    <div>
      <div>
        <h1>Timed-unlock</h1>
        <button onClick={(e) => { e.preventDefault(); removeCookie("timed-unlock-token") }}>Log out</button>
        {!cookies["timed-unlock-token"] && <LoginDialog
          addNotification={(message, level) => notificationSystem.current?.addNotification({ message, level })}
          onSuccessfulLogin={token => setCookie("timed-unlock-token", token, { maxAge: 4 * 60 * 60 - 20 })} />}
      </div>

      <NotificationSystem ref={notificationSystem} />
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={cookies["timed-unlock-token"] ? <ProjectList /> : null} />
        <Route path="/projects/:projectId" element={<ProjectView />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/projects/:projectId/edit" element={<ProjectViewEditor />} />
        </Routes>
      )}
    </div >
  );
}

export default App;
