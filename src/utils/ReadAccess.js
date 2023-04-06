import React, { useEffect, useState } from 'react'
import { Route } from 'react-router'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader } from 'components'
import { ModuleControl } from '../config/module-control';

export const AuthRoute = ({
  component: Component,
  ...rest
}) => {

  // module access routing
  const history = useHistory();
  const [myModule, setMyModule] = useState(null);
  const { modules } = useSelector(state => state.login);
  const pathname = history?.location?.pathname;
  useEffect(() => {
    if (modules) {
      const thisModule = modules?.find((elem) => elem.url === pathname)
      if (!thisModule?.canread && !ModuleControl.isDevelopment /* No ReadAccess */) {
        history.replace('/home')
      }
      setMyModule(thisModule)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules, pathname])

  return (
    modules ?
      <Route
        {...rest}
        render={props =>
          (<Component {...props} {...rest} myModule={myModule || {}} />)
        }
      /> :
      <Loader />
  )
}
