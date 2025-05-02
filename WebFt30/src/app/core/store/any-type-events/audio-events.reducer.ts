import { createReducer, on } from '@ngrx/store';
import { AudioEventsState } from './audio-events.state';
import { AudioEventsActions } from './audio-events.actions';

export const initialState: AudioEventsState = {
  audioEvents: []
};

const reducer = createReducer(
  initialState,
  on(AudioEventsActions.addEvent, (state, { newEvent }) => ({
    ...state,
    audioEvents: [...state.audioEvents, newEvent]
  })),
  on(AudioEventsActions.removeEvent, (state, { removeEvent }) => ({
    ...state,
    audioEvents: state.audioEvents.filter(
      (ate) => ate.eventId !== removeEvent.eventId || ate.eventType !== removeEvent.eventType
    )
  }))
);

export function audioEventsReducer(
  state: AudioEventsState | undefined,
  action: any
): AudioEventsState {
  return reducer(state, action);
}
