import { createSlice } from "@reduxjs/toolkit";
import service from './theme.service';
import { Default } from './helper'

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    loading: false,
    error: null,
    success: null,
    themes: [],
    theme: Default,
    previewTheme: Default,
    fontFamily: localStorage.getItem("font-family") ? JSON.parse(localStorage.getItem("font-family")) : 0,
    fontSize: (localStorage.getItem("font-size") && JSON.parse(localStorage.getItem("font-size"))) || 92,
    globalTheme: localStorage.getItem("themeJson") ? { ...JSON.parse(localStorage.getItem("themeJson")), fontSize: JSON.parse(localStorage.getItem("font-size")) || 92 } : { ...Default, fontSize: JSON.parse(localStorage.getItem("font-size")) || 92, dark: Number(localStorage.getItem("dark") || 0) }
  },
  reducers: {
    loading: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    success: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.success = payload;
    },
    error: (state, { payload }) => {
      let message = " "
      if (typeof payload === 'string')
        message = payload;
      else if (typeof payload === 'object') {
        for (const property in payload) {
          message = `${message}
${payload[property][0]}`;
        }
      }

      state.loading = null;
      state.error = message !== ' ' ? message : 'Unable to connect to the server, please check your internet connection.';
      state.success = null;
    },
    clear: (state) => {
      state.error = null;
      state.success = null;
    },
    themes: (state, { payload }) => {
      state.themes = payload.map(({ id, name, theme_json }, index) => ({
        id, name, data: JSON.parse(theme_json), index: index + 1
      }));
      state.loading = null;
    },
    theme: (state, { payload }) => {
      state.theme = payload[0];
      state.loading = null;
    },
    fontFamily: (state, { payload }) => {
      state.fontFamily = payload
    },
    fontFamilySize: (state, { payload = 92 }) => {
      state.fontSize = payload;
      state.globalTheme = { ...state.globalTheme, fontSize: payload }
    },
    previewTheme: (state, { payload }) => {
      state.previewTheme = payload
    },
    clearTheme: (state) => {
      state.theme = Default
    },
    themeUpdate: (state, { payload }) => {
      const Data = { ...payload, dark: Number(localStorage.getItem("dark") || 0) }
      localStorage.setItem('themeJson', JSON.stringify(Data))
      state.globalTheme = Data
    },
    darkTheme: (state, { payload }) => {
      localStorage.setItem('dark', payload)
      state.globalTheme = { ...state.globalTheme, dark: payload }
    }
  }
});

export const {
  loading, success, error, clear,
  themes, theme, clearTheme,
  themeUpdate, darkTheme, previewTheme,
  fontFamily, fontFamilySize
} = themeSlice.actions;


// Action creator

// load Themes
export const loadThemes = (flag, theme_id) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.loadThemes();
      if (data.data) {
        dispatch(themes(data.data));
        const themeDefault = localStorage.getItem("theme");
        if (theme_id) {
          localStorage.setItem('dark', 0)
          // eslint-disable-next-line eqeqeq
          dispatch(themeUpdate({ ...JSON.parse(data.data.find(({ id }) => id == theme_id).theme_json) }));
          localStorage.setItem('theme', theme_id)
        }
        else if (!themeDefault && flag) {
          dispatch(themeUpdate({ id: data.data[0].id, ...JSON.parse(data.data[0].theme_json) }));
          localStorage.setItem('theme', data.data[0].id)
        } else {
          const filterTheme = data.data.find(({ id }) => id === Number(themeDefault));
          dispatch(themeUpdate(({
            id: filterTheme?.id || data.data[0].id,
            ...JSON.parse(filterTheme?.id ? filterTheme.theme_json : data.data[0].theme_json)
          })));
        }
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};


// store Theme
export const storeTheme = (data) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { message, errors, success: status } = await service.storeTheme(data);
      if (status) {
        dispatch(success(message));
        dispatch(loadThemes());
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// load Theme
export const loadTheme = (id) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.loadTheme(id);
      if (data.data) {
        dispatch(theme(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// delete Themes
export const removeTheme = (id) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.removeTheme(id);
      if (data.status) {
        dispatch(success(message));
        dispatch(loadThemes());
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};

// update Themes
export const updateTheme = (payload, id) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateTheme(payload, id);
      if (data.status) {
        dispatch(success(message));
        dispatch(loadThemes());
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
};


export default themeSlice.reducer;
