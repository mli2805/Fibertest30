import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { QuickAnalysisSelectors } from 'src/app/core/store/quick-analysis/quick-analysis.selectors';

@Component({
  selector: 'rtu-quick-analysis',
  templateUrl: 'quick-analysis.component.html',
  styles: [':host { display: flex; flex-grow: 1; }'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickAnalysisComponent {
  loading$ = this.store.select(QuickAnalysisSelectors.selectLoading);

  constructor(private store: Store<AppState>) {
  }
}
