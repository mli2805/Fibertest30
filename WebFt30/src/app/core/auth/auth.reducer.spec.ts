import { TestUtils } from 'src/app/test/test.utils';
import { AuthActions } from './auth.actions';
import { authReducer, initialState } from './auth.reducer';
import { AuthState } from './auth.state';
import { MapUtils } from '../map.utils';

describe('AuthReducer', () => {
  const TEST_INITIAL_STATE: AuthState = {
    loading: false,
    error: null,
    token: null,
    user: null
  };

  const TEST_LOGGED_STATE: AuthState = {
    loading: false,
    error: null,
    token: TestUtils.ValidToken,
    user: MapUtils.toUser(TestUtils.ValidUser)
  };

  it('should return default state', () => {
    const action = {} as any;
    const state = authReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it('should loading on login', () => {
    const action = AuthActions.login({ username: 'username', password: 'password' });
    const state = authReducer(TEST_INITIAL_STATE, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should set user and token on loginSuccess', () => {
    const user = MapUtils.toUser(TestUtils.ValidUser);
    const settings = MapUtils.toUserSettings(TestUtils.ValidUserSettings);
    const action = AuthActions.loginSuccess({
      token: TestUtils.ValidToken,
      user,
      settings: settings
    });
    const state = authReducer(TEST_INITIAL_STATE, action);

    expect(state.token).toBe(TestUtils.ValidToken);
    expect(state.user).toBe(user);
  });

  it('should clear token on logout', () => {
    const action = AuthActions.logout();
    const state = authReducer(TEST_LOGGED_STATE, action);

    expect(state.token).toBe(null);
    expect(state.user).toBe(null);
  });
});
