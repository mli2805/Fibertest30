import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, OtausSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-router-baseline-title',
  templateUrl: 'router-baseline-title.component.html'
})
export class RouterBaselineTitleComponent {
  private store = inject(Store<AppState>);

  routedSelectedOtau$ = this.store.select(OtausSelectors.selectRouterSelectedOtauOrDefault);
  otauPortPath$ = this.store.select(OtausSelectors.selectOtauPathByRouterMonitoringPortId);

  @Input() titleId!: string;
}
