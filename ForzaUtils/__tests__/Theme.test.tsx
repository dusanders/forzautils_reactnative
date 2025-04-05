import 'react-native';
import React, { useEffect } from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { describe, expect, it } from '@jest/globals';
import { ThemeProvider, useTheme } from '../src/context/Theme';
import { Button, Text } from 'react-native';
import { DarkColors, LightColors } from '../src/constants/Themes';

describe('Theme Tests', () => {
  it('should render ThemeProvider without crashing', () => {
    render(
      <ThemeProvider initialMode="dark">
        <></>
      </ThemeProvider>
    );
  });

  it('should change theme correctly', () => {
    const TestComponent = () => {
      const theme = useTheme();
      return (
        <Text testID='test-text'
          style={{
            backgroundColor: theme.theme.colors.background.primary
          }}>
          {theme.current}
        </Text>
      );
    };

    const { rerender, getByText, getByTestId } = render(
      <ThemeProvider initialMode="dark">
        <TestComponent />
      </ThemeProvider>
    );

    // Assert initial theme
    expect(getByText('dark')).toBeTruthy();

    expect(getByTestId('test-text').props.style.backgroundColor)
      .toBe(DarkColors.colors.background.primary);

    // Change theme to light
    rerender(
      <ThemeProvider initialMode="light">
        <TestComponent />
      </ThemeProvider>
    );

    // Assert updated theme
    expect(getByText('light')).toBeTruthy();
    expect(getByTestId('test-text').props.style.backgroundColor)
      .not.toBe(DarkColors.colors.background.primary); // Ensure it's not dark theme
  });

  it('should change theme with useTheme hook', async () => {
    const TestComponent = () => {
      const theme = useTheme();

      useEffect(() => {
        theme.changeTheme('light'); // Change theme to light
      }, [theme.current]);

      return (
        <>
          <Text testID='current-theme'>{theme.current}</Text>
          <Button onPress={() => { theme.changeTheme('light') }}
            testID='change-theme-button'
            title={'test theme'} />
        </>
      )
    }

    let { getByTestId } = render(
      <ThemeProvider initialMode={'dark'}>
        <TestComponent />
      </ThemeProvider>
    );

    // Assert initial theme
    expect(getByTestId('current-theme').props.children).toBe('dark');

    // Simulate button press to change theme
    await act(async () => {
      fireEvent.press(getByTestId('change-theme-button'));
    });

    // Assert updated theme
    expect(getByTestId('current-theme').props.children).toBe('light');
  });

  it('should handle invalid theme change gracefully', async () => {
    const TestComponent = () => {
      const theme = useTheme();

      useEffect(() => {
        // Attempt to change to an invalid theme
        theme.changeTheme('invalid-theme' as any); // TypeScript will warn about this
      }, []);

      return (
        <>
          <Text testID='current-theme'>{theme.current}</Text>
          <Button onPress={() => { theme.changeTheme('invalid-theme' as any) }}
            testID='change-theme-button'
            title={'test theme'} />
        </>
      );
    };

    const { getByTestId } = render(
      <ThemeProvider initialMode={'dark'}>
        <TestComponent />
      </ThemeProvider>
    );

    // Assert that the theme has not changed to an invalid value
    expect(getByTestId('current-theme').props.children).toBe('dark');
    await act(async () => {
      fireEvent.press(getByTestId('change-theme-button'));
    });
    expect(getByTestId('current-theme').props.children).toBe('dark');
  });

  it('should render the theme correctly in the ThemeProvider', () => {
    const TestComponent = () => {
      const theme = useTheme();
      return (
        <Text testID='theme-color' style={{ color: theme.theme.colors.text.primary.onPrimary }}>
          Theme Color Test
        </Text>
      );
    };

    const { getByTestId, rerender } = render(
      <ThemeProvider initialMode="dark">
        <TestComponent />
      </ThemeProvider>
    );

    // Verify that the text color matches the dark theme color
    expect(getByTestId('theme-color').props.style.color).toBe(DarkColors.colors.text.primary.onPrimary);

    rerender(
      <ThemeProvider initialMode="light">
        <TestComponent />
      </ThemeProvider>
    )

    // Verify that the text color has changed to light theme color
    expect(getByTestId('theme-color').props.style.color)
      .toBe(LightColors.colors.text.primary.onPrimary); // Ensure it's not dark theme color
  });

  it('should render the theme after changing the theme', async () => {
    const TestComponent = () => {
      const theme = useTheme();

      useEffect(() => {
        // Attempt to change to an invalid theme
        theme.changeTheme('invalid-theme' as any); // TypeScript will warn about this
      }, []);

      return (
        <>
          <Text testID='current-theme' style={{color: theme.theme.colors.text.primary.onPrimary}}>{theme.current}</Text>
          <Button onPress={() => { theme.changeTheme('light') }}
            testID='change-theme-button'
            title={'test theme'} />
        </>
      );
    };
    const {getByTestId} = render(
      <ThemeProvider initialMode={'dark'}>
        <TestComponent />
      </ThemeProvider>
    );
    expect(getByTestId('current-theme').props.style.color).toBe(DarkColors.colors.text.primary.onPrimary);
    await act(async () => {
      fireEvent.press(getByTestId('change-theme-button'));
    });
    expect(getByTestId('current-theme').props.style.color)
      .toBe(LightColors.colors.text.primary.onPrimary); // Ensure it's not dark theme color
  });
});