import mock from 'react-native-permissions/mock.js'; // Import the mock for react-native-permissions
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

jest.mock('@op-engineering/op-sqlite', () => {
  const mockedConnection = {
    close: jest.fn(),
    delete: jest.fn(),
    attach: jest.fn(),
    detach: jest.fn(),
    transaction: jest.fn(),
    execute: jest.fn(),
    executeAsync: jest.fn(),
    executeBatch: jest.fn(),
    executeBatchAsync: jest.fn(),
    loadFile: jest.fn(),
    updateHook: jest.fn(),
    commitHook: jest.fn(),
    rollbackHook: jest.fn(),
    prepareStatement: jest.fn(),
    loadExtension: jest.fn(),
    executeRawAsync: jest.fn(),
    getDbPath: jest.fn(),
  };

  return {
    open: jest.fn(() => mockedConnection),
    isSQLCipher: jest.fn(),
    moveAssetsDatabase: jest.fn(),
  };
});
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
jest.mock('react-native-permissions', () => mock);
jest.mock('@react-native-vector-icons/common', () => {
  // Mock the entire common library so there are no native module loading errors
  return {
    createIconSet: () => "icon"
  }
});
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);