import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';

import {
  TabWrapper, Tab, Loader
} from "components";
import { CreateTheme } from './create-theme/CreateTheme';
import { ThemeTable } from './theme-table/ThemeTable';
import { SelectTheme } from './select-theme/SelectTheme';

import { useDispatch, useSelector } from 'react-redux';
import {
  loadThemes, loadTheme, storeTheme,
  updateTheme, clear, clearTheme, themeUpdate,
  darkTheme
} from './theme.slice';
import { useHistory, useParams } from 'react-router';
import { Decrypt } from '../../utils';

export const Theme = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(state => state.theme);
  const { userType, currentUser: { has_saas } } = useSelector(state => state.login);
  const [tab, setTab] = useState("Themes");
  let { id } = useParams();
  id = Decrypt(id);
  const history = useHistory();

  useEffect(() => {
    if (id) {
      dispatch(loadTheme(id))
    } else {
      dispatch(loadThemes());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!['Super Admin', 'Broker'].includes(userType) && !has_saas) {
      history.replace('/home')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success").then(() => {
        id ? history.replace('/themes') :
          setTab('Themes')
      });
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);

  if (!['Super Admin', 'Broker'].includes(userType)) {
    return (<SelectTheme darkTheme={darkTheme} dispatch={dispatch} themeUpdate={themeUpdate} />)
  }


  if (id) return (
    <>
      <CreateTheme
        dispatch={dispatch}
        updateTheme={updateTheme}
        storeTheme={storeTheme}
        clearTheme={clearTheme}
        id={id}
      />

      {loading && <Loader />}
    </>
  )

  return (
    <>
      <TabWrapper width='max-content'>
        <Tab isActive={Boolean(tab === "Themes")} onClick={() => setTab("Themes")}>Themes</Tab>
        <Tab isActive={Boolean(tab === "Create")} onClick={() => setTab("Create")}>Create Themes</Tab>
        <Tab isActive={Boolean(tab === "Select")} onClick={() => setTab("Select")}>Select Themes</Tab>
      </TabWrapper>

      {(tab === "Themes") && <ThemeTable />}
      {(tab === "Create") && <CreateTheme
        dispatch={dispatch}
        updateTheme={updateTheme}
        storeTheme={storeTheme}
        clearTheme={clearTheme}
        id={id}
      />}
      {(tab === "Select") && <SelectTheme admin={userType === 'Super Admin'} darkTheme={darkTheme} dispatch={dispatch} themeUpdate={themeUpdate} />}


      {loading && <Loader />}
    </>
  )
}
