import { createAction, props } from '@ngrx/store';

const sayHello = createAction('[Greeter] Say Hello', props<{ name: string }>());

const sayHelloSuccess = createAction('[Greeter] Say Hello Success', props<{ message: string }>());

const sayHelloFailure = createAction('[Greeter] Say Hello Failure', props<{ error: string }>());

const streamHello = createAction('[Greeter] Stream Hello', props<{ name: string }>());

const streamHelloNext = createAction('[Greeter] Stream Hello Next', props<{ message: string }>());

const streamHelloComplete = createAction('[Greeter] Stream Hello Complete');

export const GreeterActions = {
  sayHello,
  sayHelloSuccess,
  sayHelloFailure,
  streamHello,
  streamHelloNext,
  streamHelloComplete
};
