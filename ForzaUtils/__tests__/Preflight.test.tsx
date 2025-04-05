/**
 * @format
 */

import 'react-native';
import React from 'react';
import {act, render} from '@testing-library/react-native';
// Note: import explicitly to use the types shipped with jest.
import {describe, it, jest} from '@jest/globals';
import { Preflight } from '../src/pages/Preflight';
import { mockDarkColors } from '../__mocks__/Theme.mock';
import { mockStrings_enUS } from '../__mocks__/Locale.mock';

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

describe('Test Preflight Logic', () => {
  it('should render preflight', async () => {
    jest.useFakeTimers();
    let component: ReturnType<typeof render>;
    component = render(<Preflight />);
    await act(async () => {
      jest.runAllTimers();
    }); // Ensure the splash screen is rendered
  })
});
