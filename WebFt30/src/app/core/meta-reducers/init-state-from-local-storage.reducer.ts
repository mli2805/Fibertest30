import { ActionReducer, INIT, UPDATE } from '@ngrx/store';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { AppState } from '../core.state';

export function initStateFromLocalStorage(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return function (state, action) {
    const newState = reducer(state, action);
    if (action.type === INIT.toString() /*|| action.type === UPDATE.toString() */) {
      const initialAuthState = LocalStorageService.loadInitialAuthState();
      const auth = { ...newState.auth, ...initialAuthState };

      const initialSettingsState = LocalStorageService.loadInitialSettingsState();
      const settings = { ...newState.settings, ...initialSettingsState };

      return { ...newState, auth, settings };
    }
    return newState;
  };
}
