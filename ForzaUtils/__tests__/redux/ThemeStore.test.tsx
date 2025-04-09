import { themeReducer, setTheme, IThemeState, getTheme, getThemeType, useSetTheme } from '../../src/redux/ThemeStore';
import { mockDarkColors, mockLighColors } from '../../__mocks__/Theme.mock';
import { AppStoreState } from '../../src/redux/AppStore';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, renderHook } from '@testing-library/react-native';

describe('ThemeStore Reducer', () => {
  it('should return the initial state', () => {
    const initialState: IThemeState = {
      current: 'dark',
      theme: mockDarkColors,
    };

    expect(themeReducer(undefined, { type: undefined as any })).toEqual(initialState);
  });

  it('should handle setTheme action for dark theme', () => {
    const initialState: IThemeState = {
      current: 'light',
      theme: mockLighColors,
    };

    const action = setTheme('dark');
    const newState = themeReducer(initialState, action);

    expect(newState).toEqual({
      current: 'dark',
      theme: mockDarkColors,
    });
  });

  it('should handle setTheme action for light theme', () => {
    const initialState: IThemeState = {
      current: 'dark',
      theme: mockDarkColors,
    };

    const action = setTheme('light');
    const newState = themeReducer(initialState, action);

    expect(newState).toEqual({
      current: 'light',
      theme: mockLighColors,
    });
  });
});

describe('ThemeStore Selectors', () => {
  const mockState: AppStoreState = {
    theme: {
      current: 'dark',
      theme: mockDarkColors,
    },
    permissions: {} as any,
    wifi: {} as any,
    locale: {} as any
  };

  it('should return the current theme', () => {
    expect(getTheme(mockState)).toEqual(mockDarkColors);
  });

  it('should return the current theme type', () => {
    expect(getThemeType(mockState)).toEqual('dark');
  });
});

describe('useSetTheme Hook', () => {
  const store = configureStore({
    reducer: {
      theme: themeReducer
    }
  })
  it('should dispatch setTheme action', () => {

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSetTheme(), { wrapper });

    act(() => {
      result.current('light');
    });

    const state = store.getState();
    expect(state.theme.current).toBe('light');
  });
});