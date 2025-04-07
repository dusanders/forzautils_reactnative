import 'react-native'
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { useForzaData } from '../../src/context/Forza';
import { useTireTempsViewModel } from '../../src/context/viewModels/TireTempViewModel';

jest.mock('../../src/context/Forza', () => ({
  useForzaData: jest.fn(),
}));

describe('test TireTempViewModel', () => {
  const mockUseForzaData = useForzaData as jest.Mock;
  const TestComponent = () => {
    const vm = useTireTempsViewModel();
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

  it( 'should return correct values when forza.packet is defined', () => {
    // Mock `useForzaData` to return a valid packet
    mockUseForzaData.mockReturnValue({
      packet: {
        tireTemp: {
          leftFront: 75,
          rightFront: 80,
          leftRear: 70,
          rightRear: 78,
        },
      },
    });

    render(<TestComponent />);

    expect(screen.getByTestId('leftFront').props.children).toBe(75);
    expect(screen.getByTestId('leftRear').props.children).toBe(70);
    expect(screen.getByTestId('rightFront').props.children).toBe(80);
    expect(screen.getByTestId('rightRear').props.children).toBe(78);
  });

  it( 'should handle updates correctly', () => {
    // Mock `useForzaData` to return a valid packet with initial values
    mockUseForzaData.mockReturnValue({
      packet: {
        tireTemp: {
          leftFront: 75,
          rightFront: 80,
          leftRear: 70,
          rightRear: 78,
        },
      },
    });

    render(<TestComponent />);

    // Verify initial values
    expect(screen.getByTestId('leftFront').props.children).toBe(75);
    expect(screen.getByTestId('leftRear').props.children).toBe(70);
    expect(screen.getByTestId('rightFront').props.children).toBe(80);
    expect(screen.getByTestId('rightRear').props.children).toBe(78);

    // Update the mock to simulate new data
    mockUseForzaData.mockReturnValue({
      packet: {
        tireTemp: {
          leftFront: 76,
          rightFront: 82,
          leftRear: 72,
          rightRear: 79,
        },
      },
    });

    // Re-render the component to reflect the new values
    render(<TestComponent />);

    expect(screen.getByTestId('leftFront').props.children).toBe(76);
    expect(screen.getByTestId('leftRear').props.children).toBe(72);
    expect(screen.getByTestId('rightFront').props.children).toBe(82);
    expect(screen.getByTestId('rightRear').props.children).toBe(79);
  });
});