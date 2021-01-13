import React from 'react';
import { render } from 'react-native-testing-library';
import SignIn from '../../pages/SignIn';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
  };
});

describe('SignIn Page', () => {
  it('should contains email/password input', () => {
    const { getByPlaceholder } = render(<SignIn />);

    const emailField = getByPlaceholder('E-mail');
    const passwordField = getByPlaceholder('Senha');

    expect(emailField).toBeTruthy();
    expect(passwordField).toBeTruthy();
  });
});
