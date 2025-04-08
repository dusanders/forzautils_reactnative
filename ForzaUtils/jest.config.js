// jest.config.js
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    `node_modules/(?!(@react-native|@react-navigation|react-native|react-redux|react-native-chart-kit|react-native-vector-icons|react-native-udp|react-native-permissions)/)`,
  ],
  // Mock out font loading
  moduleNameMapper: {
    '\\.(ttf)$': '<rootDir>/__mocks__/file-mock.js',
  },
  setupFiles: [
    '<rootDir>/jest.setup.js',
  ]
};
