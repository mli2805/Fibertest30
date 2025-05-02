import { selectAudioEventsState } from '../../core.state';
import { AudioEvent } from '../models/ft30/audio-event';
import { AudioEventsState } from './audio-events.state';
import { createSelector } from '@ngrx/store';

const selectAudioEvents = createSelector(
  selectAudioEventsState,
  (state: AudioEventsState) => state.audioEvents
);

const selectOrderedEvents = createSelector(selectAudioEventsState, (state: AudioEventsState) => {
  const cloned = state.audioEvents.map((x) => Object.assign({}, x));
  return cloned.sort((a, b) => (a.registeredAt > b.registeredAt ? -1 : 1));
});

const selectHasAny = createSelector(
  selectAudioEvents,
  (anyTypeEvents: AudioEvent[]) => anyTypeEvents.length > 0
);

export const AudioEventsSelectors = {
  selectAnyTypeEvents: selectAudioEvents,
  selectOrderedEvents,
  selectHasAny
};
