import 'react-native'
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { useForzaData } from '../../src/context/Forza';
import { useGripViewModel } from '../../src/context/viewModels/GripViewModel';

jest.mock('../../src/context/Forza', () => ({
  useForzaData: jest.fn(),
}));

describe('useGripViewModel', () => {
  const mockUseForzaData = useForzaData as jest.Mock;

  // Helper component to test the hook
  const TestComponent = () => {
    const { steering, throttle, brake, slipRatio } = useGripViewModel();
    return (
      <>
        <Text testID="steering">{steering}</Text>
        <Text testID="throttle">{throttle}</Text>
        <Text testID="brake">{brake}</Text>
        <Text testID="slipRatio">
          {JSON.stringify(slipRatio)}
        </Text>
      </>
    );
  };

  it('should return default values when forza.packet is undefined', () => {
    // Mock `useForzaData` to return undefined packet
    mockUseForzaData.mockReturnValue({ packet: undefined });

    render(<TestComponent />);

    expect(screen.getByTestId('steering').props.children).toBe(0);
    expect(screen.getByTestId('throttle').props.children).toBe(0);
    expect(screen.getByTestId('brake').props.children).toBe(0);
    expect(screen.getByTestId('slipRatio').props.children).toBe(
      JSON.stringify({
        leftFront: 0,
        rightFront: 0,
        leftRear: 0,
        rightRear: 0,
      })
    );
  });

  it('should return correct values when forza.packet is defined', () => {
    // Mock `useForzaData` to return a valid packet
    mockUseForzaData.mockReturnValue({
      packet: {
        steer: 0.5,
        throttle: 0.8,
        brake: 0.2,
        tireSlipRatio: {
          leftFront: 0.12345,
          rightFront: 0.23456,
          leftRear: 0.34567,
          rightRear: 0.45678,
        },
      },
    });

    render(<TestComponent />);

    expect(screen.getByTestId('steering').props.children).toBe(0.5);
    expect(screen.getByTestId('throttle').props.children).toBe(0.8);
    expect(screen.getByTestId('brake').props.children).toBe(0.2);
    expect(screen.getByTestId('slipRatio').props.children).toBe(
      JSON.stringify({
        leftFront: 0.12,
        rightFront: 0.23,
        leftRear: 0.35,
        rightRear: 0.46,
      })
    );
  });
});