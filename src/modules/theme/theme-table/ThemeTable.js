import React from 'react';

import { Card } from 'components';
import { DataTable } from 'modules/user-management';

import { useSelector } from 'react-redux';
import { ThemesColumn } from '../helper'
import { removeTheme } from '../theme.slice';

export const ThemeTable = () => {
  const { themes } = useSelector(state => state.theme);

  return (
    <Card title='Themes'>
      <DataTable
        noStatus
        columns={ThemesColumn()}
        data={themes}
        editLink={'/edit-theme'}
        deleteFlag={'custom_delete'}
        removeAction={removeTheme}
        rowStyle
      />
    </Card>
  )
}
