import { Store } from '@ngrx/store';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { RouterSelectors } from 'src/app/core/router/router.selectors';
import { AppState } from 'src/app/core';

@Component({
  selector: 'rtu-reporting',
  templateUrl: 'reporting.component.html',
  styles: [':host { overflow-y: auto; display: flex; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportingComponent extends OnDestroyBase implements OnDestroy {
  showAvailableActions$ = this.store.select(
    RouterSelectors.selectRouterDoesNotHaveNavigationToParent
  );

  constructor(private store: Store<AppState>) {
    super();
  }
}
