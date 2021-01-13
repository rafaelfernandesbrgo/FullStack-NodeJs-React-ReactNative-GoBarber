import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/Auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear;
  });

  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const passwordField = getByPlaceholderText('Senha');
    const emailField = getByPlaceholderText('E-email');
    const buttonElement = getByText('Entrar');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(emailField, { target: { value: 'jonhdoe@example.com' } });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const passwordField = getByPlaceholderText('Senha');
    const emailField = getByPlaceholderText('E-email');
    const buttonElement = getByText('Entrar');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled;
    });
  });

  it('should display an error if login fails ', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const passwordField = getByPlaceholderText('Senha');
    const emailField = getByPlaceholderText('E-email');
    const buttonElement = getByText('Entrar');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(emailField, { target: { value: 'jonhdoe@example.com' } });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
