import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WindowRefService {
  isPageUnloading = false;

  constructor(private localStorageService: LocalStorageService) {
    fromEvent(window, 'beforeunload').subscribe((event) => {
      this.isPageUnloading = true;
    });
  }

  get nativeWindow(): Window {
    return window;
  }

  reload(): void {
    this.nativeWindow.location.href = '/';
  }

  removeAuthAndReload() {
    if (!this.isPageUnloading) {
      // page refresh can make ongoing grpc call fail
      // let's not remove the token in this case
      // can happen for example when user hitting F5 a lot of times
      this.localStorageService.removeAuth();
    }

    // After logout (or after we realised server reject our token) we need to reset all the reducers state to initial
    // The simple way to do it is to just refresh the page
    this.reload();
  }
}
