import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { TestUtils } from 'src/app/test/test.utils';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
    service = TestBed.inject<LocalStorageService>(LocalStorageService);
  });

  afterEach(() => service.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get, set, and remove the item', () => {
    service.setItem('TEST', 'item');
    expect(service.getItem('TEST')).toBe('item');
    service.removeItem('TEST');
    expect(service.getItem('TEST')).toBeNull();
  });

  it('should load initial auth state', () => {
    const testToken = TestUtils.ValidToken;

    service.setAuth(testToken);
    let authState = LocalStorageService.loadInitialAuthState(false);

    expect(authState.token).toBe(testToken);

    authState = LocalStorageService.loadInitialAuthState(true);
    expect(authState).toEqual({}); // should be empty because the token is expired

    service.removeAuth(); // clear the local storage
    authState = LocalStorageService.loadInitialAuthState(false);
    expect(authState).toEqual({}); // should be empty because the token was removed
  });
});
