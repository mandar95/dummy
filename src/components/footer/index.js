import { lazy } from 'react';

const Footer = lazy(() => import(/* webpackChunkName: "versionUpdate", webpackPrefetch: true */'./footer'));

export default Footer
