import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GreeterActions } from './greeter.actions';
import { catchError, endWith, map, of, switchMap } from 'rxjs';
import { GreeterService } from 'src/app/core/grpc';

@Injectable()
export class GreeterEffects {
  sayHello = createEffect(() => {
    return this.action$.pipe(
      ofType(GreeterActions.sayHello),
      switchMap(({ name }) =>
        this.greeterService.sayHello(name).pipe(
          map((response) => GreeterActions.sayHelloSuccess({ message: response.message })),
          catchError((error) => of(GreeterActions.sayHelloFailure({ error })))
        )
      )
    );
  });

  streamHello = createEffect(() => {
    return this.action$.pipe(
      ofType(GreeterActions.streamHello),
      switchMap(({ name }) =>
        this.greeterService.streamHello(name).pipe(
          map((response) => GreeterActions.streamHelloNext({ message: response.message })),
          catchError((error) => of(GreeterActions.sayHelloFailure({ error }))),
          endWith(GreeterActions.streamHelloComplete())
        )
      )
    );
  });
  constructor(private action$: Actions, private greeterService: GreeterService) {}
}
