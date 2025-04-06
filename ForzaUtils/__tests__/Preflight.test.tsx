/**
 * @format
 */

import 'react-native';
import React from 'react';
import { act, render } from '@testing-library/react-native';
// Note: import explicitly to use the types shipped with jest.
import { describe, expect, it, jest } from '@jest/globals';
import { Preflight } from '../src/pages/Preflight';
import { mockDarkColors } from '../__mocks__/Theme.mock';
import { mockStrings_enUS } from '../__mocks__/Locale.mock';
import { Splash } from '../src/pages/Splash';
import { ForzaContextProvider } from '../src/context/Forza';
import { addEventListener, NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import { mockSocket } from '../__mocks__/udp.mock';

jest.mock('../src/context/Locale', () => ({
  useLocale: jest.fn(() => ({
    strings: new mockStrings_enUS(),
  })),
}))
jest.mock('../src/context/Theme', () => ({
  useTheme: jest.fn(() => ({
    theme: mockDarkColors,
  })),
}));
jest.mock('react-native-udp', () => {
  return {
    createSocket: jest.fn(() => {
      return mockSocket;
    }),
  };
})

describe('Test Preflight Logic', () => {
  jest.useFakeTimers();
  it('should render preflight', async () => {
    render(<Preflight />);
    await act(async () => {
      jest.runAllTimers(); // Ensure all timers are run to completion
    })
    // Ensure the Preflight component renders without crashing
    expect(true).toBe(true); // Just a placeholder to ensure the test runs
  })
  it('should render splash', async () => {
    const component = render(<Preflight />);
    expect(component.UNSAFE_queryByType(Splash)).toBeTruthy(); // Ensure the splash screen is rendered
    await act(async () => {
      jest.runAllTimers(); // Ensure all timers are run to completion
    });
    expect(component.UNSAFE_queryByType(ForzaContextProvider)).toBeFalsy(); // Ensure ForzaContextProvider is not rendered yet
  });
  it('should render ForzaContextProvider after loading', async () => {
    const mockNetInfoListener = jest.fn();
    (addEventListener as jest.Mock).mockImplementation((callback) => {
      mockNetInfoListener.mockImplementation(callback as any);
      return jest.fn();
    })
    let component = render(<Preflight />);
    expect(component.UNSAFE_queryByType(Splash)).toBeTruthy()// Ensure the splash screen is rendered
    expect(component.UNSAFE_queryByType(ForzaContextProvider)).toBeFalsy(); // Ensure ForzaContextProvider is not rendered yet
    await act(async () => {
      const mockNetInfo: NetInfoState = {
        type: NetInfoStateType.wifi,
        isConnected: true,
        isInternetReachable: true,
        details: {
          ssid: 'TestNetwork',
          bssid: null,
          strength: null,
          ipAddress: null,
          subnet: null,
          frequency: null,
          linkSpeed: null,
          rxLinkSpeed: null,
          txLinkSpeed: null,
          isConnectionExpensive: false,
        }
      };
      mockNetInfoListener(mockNetInfo)
      jest.runAllTimers();
    }); // Ensure the splash screen is rendered
    expect(component.UNSAFE_queryByType(ForzaContextProvider)).toBeTruthy();
    expect(component.UNSAFE_queryByType(Splash)).toBeFalsy(); // Ensure the splash screen is no longer rendered
  });
});
