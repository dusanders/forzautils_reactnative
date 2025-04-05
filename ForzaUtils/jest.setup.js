import mock from 'react-native-permissions/mock.js'; // Import the mock for react-native-permissions
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
jest.mock('react-native-permissions', () => mock);
jest.mock('@react-native-vector-icons/common', () => {
  // Mock the entire common library so there are no native module loading errors
  return {
    createIconSet: () => "icon"
  }
});