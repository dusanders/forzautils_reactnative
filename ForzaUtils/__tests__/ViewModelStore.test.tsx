import 'react-native';
import React from 'react';
import { act, render } from '@testing-library/react-native';
// Note: import explicitly to use the types shipped with jest.
import { describe, expect, it, jest } from '@jest/globals';
import { useViewModelStore, ViewModelStore_Hoc } from '../src/context/viewModels/ViewModelStore';
import { Text } from 'react-native';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('Forza Context Tests', () => {
  it('should render the Context Provider without crashing', () => {
    render(
      <ViewModelStore_Hoc>
        <></>
      </ViewModelStore_Hoc>
    );
    expect(true).toBe(true); // Just a placeholder to ensure the test runs
  });
  it('should verify the Grip view model is defined', () => {
    const GripTest = () => {
      const vm = useViewModelStore().grip;
      const isDefined = vm !== undefined;
      return <Text>{isDefined ? 'Grip is defined' : 'Grip is not defined'}</Text>;
    }
    const component = render(
      <ViewModelStore_Hoc>
        <GripTest />
      </ViewModelStore_Hoc>
    );
    expect(component.queryByText('Grip is defined')).toBeTruthy();
  });
  it('should verify the Suspension Graph view model is defined', () => {
    const SuspensionGraphTest = () => {
      const vm = useViewModelStore().suspensionGraph;
      const isDefined = vm !== undefined;
      return <Text>{isDefined ? 'Suspension Graph is defined' : 'Suspension Graph is not defined'}</Text>;
    }
    const component = render(
      <ViewModelStore_Hoc>
        <SuspensionGraphTest />
      </ViewModelStore_Hoc>
    );
    expect(component.queryByText('Suspension Graph is defined')).toBeTruthy();
  });
  it('should verify the Tire Temps view model is defined', () => {
    const TireTempsTest = () => {
      const vm = useViewModelStore().tireTemps;
      const isDefined = vm !== undefined;
      return <Text>{isDefined ? 'Tire Temps are defined' : 'Tire Temps are not defined'}</Text>;
    }
    const component = render(
      <ViewModelStore_Hoc>
        <TireTempsTest />
      </ViewModelStore_Hoc>
    );
    expect(component.queryByText('Tire Temps are defined')).toBeTruthy();
  });
  it('should verify the HP/TQ Graph view model is defined', () => {
    const HpTqGraphTest = () => {
      const vm = useViewModelStore().hpTqGraph;
      const isDefined = vm !== undefined;
      return <Text>{isDefined ? 'HP/TQ Graph is defined' : 'HP/TQ Graph is not defined'}</Text>;
    }
    const component = render(
      <ViewModelStore_Hoc>
        <HpTqGraphTest />
      </ViewModelStore_Hoc>
    );
    expect(component.queryByText('HP/TQ Graph is defined')).toBeTruthy();
  });
  it('should verify the Map view model is defined', () => {
    const MapTest = () => {
      const vm = useViewModelStore().map;
      const isDefined = vm !== undefined;
      return <Text>{isDefined ? 'Map is defined' : 'Map is not defined'}</Text>;
    }
    const component = render(
      <ViewModelStore_Hoc>
        <MapTest />
      </ViewModelStore_Hoc>
    );
    expect(component.queryByText('Map is defined')).toBeTruthy();
  });
});