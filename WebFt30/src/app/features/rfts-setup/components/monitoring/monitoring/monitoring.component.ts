import { Component, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, OtausActions, OtausSelectors } from 'src/app/core';
import { RouterSelectors } from 'src/app/core/router/router.selectors';
import { Otau } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-monitoring-component',
  templateUrl: 'monitoring.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class MonitoringComponent {
  otaus$ = this.store.select(OtausSelectors.selectOtausOtaus);
  routedSelectedOtau$ = this.store.select(OtausSelectors.selectRouterSelectedOtauOrDefault);
  hasOcmPortIndex$ = this.store.select(RouterSelectors.selectHasOcmPortIndexParam);
  hideMonitoringsAvailableActions$ = this.store.select(
    RouterSelectors.selectHideMonitoringsAvailableActions
  );

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  setSelectedOtau(otau: Otau) {
    this.store.dispatch(
      OtausActions.setRouterSelectedOtauOcmPortIndex({ ocmPortIndex: otau.ocmPortIndex })
    );
    this.router.navigate(['../', otau.ocmPortIndex], {
      relativeTo: this.route.firstChild
    });
  }
}
