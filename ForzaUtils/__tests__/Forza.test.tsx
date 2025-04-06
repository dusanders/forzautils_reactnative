import 'react-native';
import React, { useEffect } from 'react';
import { act, render } from '@testing-library/react-native';
// Note: import explicitly to use the types shipped with jest.
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ForzaContextProvider, useForzaData } from '../src/context/Forza';
import { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import { Text } from 'react-native';
import { mockSocket } from '../__mocks__/udp.mock';

jest.mock('react-native-udp', () => ({
  createSocket: jest.fn(() => mockSocket),
}));

jest.mock('ForzaTelemetryApi', () => ({
  ForzaTelemetryApi: jest.fn((size, buffer) => ({
    isRaceOn: true, // Mocked property
    size,
    buffer,
  })),
}));

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

describe('Forza Context Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  jest.useFakeTimers();
  it('should render the Context Provider without crashing', () => {
    render(
      <ForzaContextProvider netInfo={mockNetInfo}>
        <></>
      </ForzaContextProvider>
    );
    expect(true).toBe(true); // Just a placeholder to ensure the test runs
  });
  
  it('should update the data in the context', async () => {
    const TestComponent = () => {
      const forza = useForzaData();
      return (
          <Text testID='raceOn'>{forza.packet?.isRaceOn?.toString()}</Text>
      )
    }

    const { getByTestId, getByText } = render(
      <ForzaContextProvider netInfo={mockNetInfo}>
        <TestComponent />
      </ForzaContextProvider>
    );

    // Since the packet is initially undefined, we expect it to be falsy
    expect(getByTestId('raceOn')).toBeEmptyElement(); // Check that the initial value is undefined

    await act( async () => {
      const listeningHandler = mockSocket.once.mock.calls.find(
        ([event]) => event === 'listening'
      )?.[1];
      if (listeningHandler) {
        listeningHandler(); // Call the listening handler to simulate the socket being ready
      }
    });

    await act(async () => {
      jest.advanceTimersByTime(10); // Ensure the flush interval has run to update the packet
    });

    await act(async () => {
      const mockBytes = Buffer.from([0x01, 0x02, 0x03, 0x04]); // Mock byte array for the packet
      const mockRInfo = {
        size: 1024, // Mock size of the packet
      }
      // Trigger the dataHandler via the 'message' event
      const dataHandler = mockSocket.addListener.mock.calls.find(
        ([event]) => event === 'message'
      )?.[1];
      if (dataHandler) {
        dataHandler(mockBytes, mockRInfo);
      }
    });

    await act(async () => {
      jest.advanceTimersByTime(10); // Ensure the flush interval has run to update the packet
    });

    // Now we expect the updated value to be reflected in the Text component
    expect(getByText('true')).toBeTruthy(); // Check that the updated value is true
  });
});