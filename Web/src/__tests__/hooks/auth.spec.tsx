import { act, renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider, useAuth } from '../../hooks/Auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('Should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user_id',
        name: 'John Doe',
        email: 'johndoe@example.com.br',
      },
      token: 'any_token',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com.br',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@Gobaber:Token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@Gobaber:user',
      JSON.stringify(apiResponse.user),
    );

    expect(result.current.user.email).toEqual('johndoe@example.com.br');
  });

  it('Should restore saved data from storage when auth inits', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@Gobaber:Token':
          return 'any_token';
        case '@Gobaber:user':
          return JSON.stringify({
            id: 'user_id',
            name: 'John Doe',
            email: 'johndoe@example.com.br',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com.br');
  });

  it('Should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@Gobaber:Token':
          return 'any_token';
        case '@Gobaber:user':
          return JSON.stringify({
            id: 'user_id',
            name: 'John Doe',
            email: 'johndoe@example.com.br',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('Should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user_id',
      name: 'John Doe',
      email: 'johndoe@example.com.br',
      avatar_url: 'any_image',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(result.current.user).toEqual(user);

    expect(setItemSpy).toHaveBeenCalledWith(
      '@Gobaber:user',
      JSON.stringify(user),
    );
  });
});
