import { Injectable, ErrorHandler, Injector, NgZone, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { GlobalUiActions } from '../store/global-ui/global-ui.actions';
import { CoreUtils } from '../core.utils';
import { AppState } from '../core.state';
import { WindowRefService } from '../services';

@Injectable()
export class AppErrorHandler extends ErrorHandler {
  constructor(private injector: Injector, private zone: NgZone) {
    super();
  }
  override handleError(error: any) {
    const isPageUnloading = this.injector.get<WindowRefService>(WindowRefService).isPageUnloading;
    if (isPageUnloading) {
      return;
    }

    const errorMessage = CoreUtils.errorToMessage(error);
    const store = this.injector.get<Store<AppState>>(Store);
    this.zone.run(() => {
      store.dispatch(GlobalUiActions.showError({ error: errorMessage }));
    });

    super.handleError(error);
  }
}
