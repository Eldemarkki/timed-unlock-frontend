import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from "axios";
import { API_URL } from "./config"

axios.defaults.baseURL = API_URL

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
