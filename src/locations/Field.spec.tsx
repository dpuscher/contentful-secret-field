// SecretField.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCma, mockSdk } from '../../test/mocks';
import SecretField from './Field';

// Mock the Contentful React Apps Toolkit to return our mockSdk and mockCma
jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}));

describe('SecretField component', () => {
  beforeEach(() => {
    // Reset all mocks between tests
    jest.clearAllMocks();

    // Default mocks for sdk.field / sdk.parameters / sdk.window
    mockSdk.field.getValue.mockReturnValue(''); // By default, no secret is set
    mockSdk.field.setValue.mockResolvedValue(undefined);
    mockSdk.parameters.instance = { secretLength: 16 };
    mockSdk.window.startAutoResizer.mockReturnValue(undefined);
  });

  it('generates a secret if none exists on mount', () => {
    // Render component
    render(<SecretField />);

    // We expect that a new secret was generated and setValue was called
    expect(mockSdk.field.setValue).toHaveBeenCalledTimes(1);

    // Since secret is generated randomly, we can't know the exact string,
    // but we can verify the input is rendered with some value
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value.length).toBe(mockSdk.parameters.instance.secretLength);
    expect(input.value).toMatch(/^[A-Za-z0-9-_.]+$/);
  });

  it("sets the secret's length to 32 if not passed in parameters", () => {
    // Remove secretLength from parameters
    mockSdk.parameters.instance = {};

    render(<SecretField />);

    // We expect that a new secret was generated and setValue was called
    expect(mockSdk.field.setValue).toHaveBeenCalledTimes(1);

    // Since secret is generated randomly, we can't know the exact string,
    // but we can verify the input is rendered with some value
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value.length).toBe(32);
  });

  it('uses an existing secret if one is already set', () => {
    // Suppose an existing secret is returned
    mockSdk.field.getValue.mockReturnValue('my-existing-secret');

    render(<SecretField />);

    // The component should not regenerate a secret in this case
    expect(mockSdk.field.setValue).not.toHaveBeenCalled();

    // Check that the input displays the existing secret
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('my-existing-secret');
  });

  it('toggles edit mode and allows editing the secret only when in edit mode', async () => {
    render(<SecretField />);

    const user = userEvent.setup();
    const editButton = screen.getByLabelText('Toggle Edit Mode');
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Initially not editable
    expect(input).toBeDisabled();

    // Click edit button, enabling edit mode
    await user.click(editButton);
    expect(input).not.toBeDisabled();

    input.value = '';
    await user.type(input, 'new-secret');
    expect(input.value).toBe('new-secret');

    // Clicking edit button again should disable input
    await user.click(editButton);
    expect(input).toBeDisabled();
  });

  it('shows the refresh button only in edit mode', async () => {
    render(<SecretField />);

    const user = userEvent.setup();
    const refreshButton = screen.queryByLabelText('Refresh Secret');
    const editButton = screen.getByLabelText('Toggle Edit Mode');

    // Initially, refresh button should not exist
    expect(refreshButton).not.toBeInTheDocument();

    // After toggling edit mode on
    await user.click(editButton);
    expect(screen.getByLabelText('Refresh Secret')).toBeInTheDocument();
  });

  it('refreshes the secret when clicking the refresh button', async () => {
    // Suppose an existing secret is returned
    mockSdk.field.getValue.mockReturnValue('my-existing-secret');

    render(<SecretField />);

    const user = userEvent.setup();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const originalSecret = input.value;
    const editButton = screen.getByLabelText('Toggle Edit Mode');

    await user.click(editButton);

    const refreshButton = screen.getByLabelText('Refresh Secret');

    // Clicking the refresh button should generate a new secret
    await user.click(refreshButton);
    expect(mockSdk.field.setValue).toHaveBeenCalledTimes(1);

    // The input should now contain the new secret
    expect(input.value).not.toBe(originalSecret);
  });
});
