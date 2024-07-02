import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, OtausActions, OtausSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { RouterSelectors } from 'src/app/core/router/router.selectors';

export class RouterSelectedOtauUtils {
  static restoreSelectionOrNaviagteToDefault(
    store: Store<AppState>,
    router: Router,
    route: ActivatedRoute
  ) {
    const ocmPortIndex = CoreUtils.getCurrentState(store, RouterSelectors.selectOcmPortIndexParam);
    const otau = CoreUtils.getCurrentState(
      store,
      OtausSelectors.selectOtauByOcmPortIndex(ocmPortIndex!)
    );

    if (otau) {
      store.dispatch(
        OtausActions.setRouterSelectedOtauOcmPortIndex({ ocmPortIndex: ocmPortIndex! })
      );
    } else {
      router.navigate(['../'], { relativeTo: route });
    }
  }
}
