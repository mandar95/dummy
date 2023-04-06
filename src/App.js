import React from "react";
import { ThemeProvider } from 'styled-components';
import ReactGA from 'react-ga';

import 'bootstrap/dist/css/bootstrap.min.css';

import Router from "./routes";
import { useSelector } from "react-redux";
// import './theme/CssVariables.css';
import ErrorBoundary from './utils/ErrorBoundary'
import { /*BroadCastTab*/ useIsMainWindow } from "./utils";

const TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;
if (TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID);
}


const App = () => {
  const { globalTheme } = useSelector(state => state.theme)
  const isMain = useIsMainWindow();

  // Won't render the application if WebApp is under Clickjacking attack (iframe)
  if (window.self !== window.top) {

    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={globalTheme}>
        {/* <BroadCastTab flagReset={false} shouldTrigger={false} isMain={undefined} /> */}
        <Router isMain={isMain} />
      </ThemeProvider>
    </ErrorBoundary>
  )
};

export default App;
