import React from 'react';
import { LoginDialog } from './LoginDialog';
import NotificationSystem from 'react-notification-system';
import { LoggedInView } from './LoggedInView';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const App = (): JSX.Element => {
  const [cookies, setCookie, removeCookie] = useCookies(['timed-unlock-token']);

  if (cookies["timed-unlock-token"]) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${cookies["timed-unlock-token"]}`
  }

  const notificationSystem: React.RefObject<NotificationSystem.System> = React.createRef();

  return (
    <div>
      <NotificationSystem ref={notificationSystem} />
      <h1>Timed-unlock</h1>
      <button onClick={(e) => {e.preventDefault(); removeCookie("timed-unlock-token")}}>Log out</button>
      {!cookies["timed-unlock-token"] && <LoginDialog
        addNotification={(message, level) => notificationSystem.current?.addNotification({ message, level })}
        onSuccessfulLogin={token => setCookie("timed-unlock-token", token, { maxAge: 4 * 60 * 60 - 20 })} />}
      {cookies["timed-unlock-token"] && <LoggedInView />}
    </div >
  );
}

export default App;
