import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import './config/css/bootstrap.css';
// import './config/css/fontawesome-pro.css';
// import './config/css/fontawesome.css';
import './config/css/leaflet.css';
import './config/css/metis-menu.css';
import './config/css/themify-icons.css';
import './index.css';
import { unregister } from './registerServiceWorker';

// redux store
import store from "./app/store";

unregister();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
