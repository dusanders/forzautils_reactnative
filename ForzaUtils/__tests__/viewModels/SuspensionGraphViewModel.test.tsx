import 'react-native'
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { useForzaData } from '../../src/context/Forza';
import { useSuspensionGraphViewModel } from '../../src/context/viewModels/SuspensionGraphViewModel';

jest.mock('../../src/context/Forza', () => ({
  useForzaData: jest.fn(),
}));

describe('test SuspensionGraphViewModel', () => {
  const mockUseForzaData = useForzaData as jest.Mock;
  const TestComponent = () => {
    const vm = useSuspensionGraphViewModel();
    return (
      <>
        <Text testID="leftFront">{vm.leftFront}</Text>
        <Text testID="leftRear">{vm.leftRear}</Text>
        <Text testID="rightFront">{vm.rightFront}</Text>
        <Text testID="rightRear">{vm.rightRear}</Text>
      </>
    );
  }

  it('should return default values when forza.packet is undefined', () => {
    // Mock `useForzaData` to return undefined packet
    mockUseForzaData.mockReturnValue({ packet: undefined });

    render(<TestComponent />);

    expect(screen.getByTestId('leftFront').props.children).toBe(0);
    expect(screen.getByTestId('leftRear').props.children).toBe(0);
    expect(screen.getByTestId('rightFront').props.children).toBe(0);
    expect(screen.getByTestId('rightRear').props.children).toBe(0);
  });

  it('should return correct values when forza.packet is defined', () => {
    // Mock `useForzaData` to return a valid packet
    mockUseForzaData.mockReturnValue({
      packet: {
        normalizedSuspensionTravel: {
          leftFront: 0.1,
          rightFront: 0.2,
          leftRear: 0.3,
          rightRear: 0.4,
        },
      },
    });

    render(<TestComponent />);

    expect(screen.getByTestId('leftFront').props.children).toBe(0.1);
    expect(screen.getByTestId('leftRear').props.children).toBe(0.3);
    expect(screen.getByTestId('rightFront').props.children).toBe(0.2);
    expect(screen.getByTestId('rightRear').props.children).toBe(0.4);
  });

  it('should handle updates correctly', () => {
    // Mock `useForzaData` to return a valid packet with initial values
    mockUseForzaData.mockReturnValue({
      packet: {
        normalizedSuspensionTravel: {
          leftFront: 0.1,
          rightFront: 0.2,
          leftRear: 0.3,
          rightRear: 0.4,
        },
      },
    });

    const { rerender } = render(<TestComponent />);

    // Update the mock to simulate a change in the packet
    mockUseForzaData.mockReturnValue({
      packet: {
        normalizedSuspensionTravel: {
          leftFront: 0.5,
          rightFront: 0.6,
          leftRear: 0.7,
          rightRear: 0.8,
        },
      },
    });

    // Rerender the component to reflect the changes
    rerender(<TestComponent />);

    expect(screen.getByTestId('leftFront').props.children).toBe(0.5);
    expect(screen.getByTestId('leftRear').props.children).toBe(0.7);
    expect(screen.getByTestId('rightFront').props.children).toBe(0.6);
    expect(screen.getByTestId('rightRear').props.children).toBe(0.8);
  });
});