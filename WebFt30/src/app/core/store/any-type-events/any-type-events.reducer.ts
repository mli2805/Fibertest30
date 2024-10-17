import { createReducer, on } from '@ngrx/store';
import { AnyTypeEventsState } from './any-type-events.state';
import { AnyTypeEventsActions } from './any-type-events.actions';

export const initialState: AnyTypeEventsState = {
  anyTypeEvents: []
};

const reducer = createReducer(
  initialState,
  on(AnyTypeEventsActions.addEvent, (state, { newEvent }) => ({
    ...state,
    anyTypeEvents: [...state.anyTypeEvents, newEvent]
  })),
  on(AnyTypeEventsActions.removeEvent, (state, { removeEvent }) => ({
    ...state,
    anyTypeEvents: state.anyTypeEvents.filter(
      (ate) => ate.eventId !== removeEvent.eventId || ate.eventType !== removeEvent.eventType
    )
  }))
);

export function anyTypeEventsReducer(
  state: AnyTypeEventsState | undefined,
  action: any
): AnyTypeEventsState {
  return reducer(state, action);
}
