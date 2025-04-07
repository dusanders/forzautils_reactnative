import 'react-native'
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AppBar, AppBarTestID } from '../../src/components/AppBar/AppBar';
import { mockDarkColors } from '../../__mocks__/Theme.mock';
import { Text } from 'react-native';

jest.mock('../../src/context/Theme', () => ({
  useTheme: jest.fn(() => ({
    theme: mockDarkColors,
  })),
}));

describe('test AppBar', () => {
  it('should render without crashing', () => {
    render(<AppBar title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeTruthy();
  });
  it('should apply theme styles correctly', () => {
    render(<AppBar title="Test Title" />);
    const appBar = screen.getByTestId(AppBarTestID.root);
    expect(appBar).toBeTruthy();
    expect(appBar?.props.style).toBeDefined();
    expect(appBar?.props.style).toMatchObject({
      backgroundColor: mockDarkColors.colors.background.primary,
    });
  });
  it('should handle title prop correctly', () => {
    const title = "New Test Title";
    render(<AppBar title={title} />);
    expect(screen.getByText(title)).toBeTruthy();
  });
  it('should handle title prop as empty string', () => {
    render(<AppBar title="" />);
    expect(screen.queryByText("")).toBeFalsy(); // Ensure no empty title is rendered
  });
  it('should handle title prop as undefined', () => {
    render(<AppBar title={undefined as any} />);
    expect(screen.queryByText("")).toBeFalsy(); // Ensure no empty title is rendered
  });
  it('should show/hide back button based on hideBack prop', () => {
    const { rerender } = render(<AppBar title="Test Title" hideBack={false} />);
    expect(screen.getByTestId(AppBarTestID.backIconView)).toBeTruthy(); // Back button should be visible

    rerender(<AppBar title="Test Title" hideBack={true} />);
    expect(screen.queryByTestId(AppBarTestID.backIconView)).toBeFalsy(); // Back button should not be visible
  });
  it('should show/hide settings button based on hideSettings prop', () => {
    const { rerender } = render(<AppBar title="Test Title" hideSettings={false} />);
    expect(screen.getByTestId(AppBarTestID.settingIconView)).toBeTruthy(); // Settings button should be visible

    rerender(<AppBar title="Test Title" hideSettings={true} />);
    expect(screen.queryByTestId(AppBarTestID.settingIconView)).toBeFalsy(); // Settings button should not be visible
  });
  it('should handle back button press', () => {
    const mockOnBack = jest.fn();
    render(<AppBar title="Test Title" onBack={mockOnBack} />);
    
    const backButton = screen.getByTestId(AppBarTestID.backIconView);
    expect(backButton).toBeTruthy(); // Ensure back button is rendered
    fireEvent.press(backButton); // Simulate back button press

    expect(mockOnBack).toHaveBeenCalled(); // Ensure onBack was called
  });
  it('should handle settings button press', async () => {
    render(<AppBar title="Test Title" hideSettings={false} />);

    const settingsButton = screen.getByTestId(AppBarTestID.settingIconView);
    let settingsFlyout = screen.queryByTestId(AppBarTestID.settingsFlyoutView);

    expect(settingsFlyout).toBeFalsy(); // Ensure settings flyout is not visible initially
    expect(settingsButton).toBeTruthy(); // Ensure settings button is rendered
    
    fireEvent.press(settingsButton); // Simulate settings button press

    settingsFlyout = screen.getByTestId(AppBarTestID.settingsFlyoutView);

    expect(settingsFlyout).toBeTruthy(); // Ensure settings flyout is now visible
  });

  it('should close settings flyout when outside is pressed', async () => {
    render(<AppBar title="Test Title" hideSettings={false} />);

    const settingsButton = screen.getByTestId(AppBarTestID.settingIconView);
    fireEvent.press(settingsButton); // Open settings flyout

    let settingsFlyout = screen.queryByTestId(AppBarTestID.settingsFlyoutView);
    expect(settingsFlyout).toBeTruthy(); // Ensure settings flyout is visible

    const outsideTouchable = screen.getByTestId(AppBarTestID.settingsFlyoutOutsideTouchable);
    expect(outsideTouchable).toBeTruthy(); // Ensure outside touchable is rendered

    fireEvent.press(outsideTouchable); // Simulate pressing outside to close the flyout

    settingsFlyout = screen.queryByTestId(AppBarTestID.settingsFlyoutView);
    expect(settingsFlyout).toBeFalsy(); // Ensure settings flyout is no longer visible
  });

  it('should handle injectElements prop', () => {
    const mockPress1 = jest.fn();
    const mockPress2 = jest.fn();
    const mockInjectElements = [
      { id: 'button1', renderItem: () => <Text key='button1' testID="button1">Button 1</Text>, onPress: mockPress1 },
      { id: 'button2', renderItem: () => <Text key='button2' testID="button2">Button 2</Text>, onPress: mockPress2 },
    ];

    render(<AppBar title="Test Title" injectElements={mockInjectElements} />);
    const settingsButton = screen.getByTestId(AppBarTestID.settingIconView);
    expect(settingsButton).toBeTruthy(); // Ensure settings button is rendered
    fireEvent.press(settingsButton); // Open settings flyout

    const button1 = screen.getByTestId("button1");
    const button2 = screen.getByTestId("button2");
    expect(button1).toBeTruthy(); // Ensure Button 1 is rendered
    expect(button2).toBeTruthy(); // Ensure Button 2 is rendered

    fireEvent.press(button1); // Simulate pressing Button 1
    expect(mockPress1).toHaveBeenCalled(); // Ensure onPress for Button 1 was called
    fireEvent.press(button2); // Simulate pressing Button 2
    expect(mockPress2).toHaveBeenCalled(); // Ensure onPress for Button 2 was called

  });
})