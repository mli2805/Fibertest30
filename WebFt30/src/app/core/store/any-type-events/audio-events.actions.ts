import { createAction, props } from '@ngrx/store';
import { AudioEvent } from '../models/ft30/audio-event';

const addEvent = createAction('[AudioEventsActions] Add Event', props<{ newEvent: AudioEvent }>());
const removeEvent = createAction(
  '[AudioEventsActions] Remove Event',
  props<{ removeEvent: AudioEvent }>()
);

export const AudioEventsActions = {
  addEvent,
  removeEvent
};
