/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import {render} from '@testing-library/react-native';

// Note: import explicitly to use the types shipped with jest.
import {describe, it, test} from '@jest/globals';

describe('App Component Tests', () => {
  it('renders the App component', () => {
    render(<App />);
  })
});
