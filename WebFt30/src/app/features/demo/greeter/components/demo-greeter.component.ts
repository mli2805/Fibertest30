import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { GreeterState, GreeterActions, GreeterSelectors } from '../';
import { Observable } from 'rxjs';
import { State } from '../../demo.state';

@Component({
  selector: 'rtu-demo-greeter',
  templateUrl: 'demo-greeter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoGreeterComponent {
  private store: Store<State> = inject(Store<State>);

  // TODO: should we create so much one-property selectors, or better to use single selectGreeterState ?
  loading$: Observable<boolean> | undefined;
  message$: Observable<string | null> | undefined;
  error$: Observable<string | null> | undefined;

  greeter$: Observable<GreeterState> | undefined;

  constructor() {
    this.message$ = this.store.select(GreeterSelectors.selectMessage);
    this.error$ = this.store.select(GreeterSelectors.selectError);
    this.loading$ = this.store.select(GreeterSelectors.selectLoading);

    this.greeter$ = this.store.select(GreeterSelectors.selectGreeterState);
  }

  sayHello() {
    this.store.dispatch(GreeterActions.sayHello({ name: Math.random().toString() }));
  }

  streamHello() {
    this.store.dispatch(GreeterActions.streamHello({ name: 'Stream: ' }));
  }
}
