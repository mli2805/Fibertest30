import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, OtausSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-router-otau-title',
  templateUrl: 'router-otau-title.component.html'
})
export class RouterOtauTitleComponent {
  private store = inject(Store<AppState>);

  routedSelectedOtau$ = this.store.select(OtausSelectors.selectRouterSelectedOtauOrDefault);

  @Input() titleId!: string;
}
