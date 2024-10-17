import { createAction, props } from '@ngrx/store';
import { AnyTypeEvent } from '../models/ft30/any-type-event';

const addEvent = createAction('[AnyTypeEvents] Add Event', props<{ newEvent: AnyTypeEvent }>());
const removeEvent = createAction(
  '[AnyTypeEvents] Remove Event',
  props<{ removeEvent: AnyTypeEvent }>()
);

export const AnyTypeEventsActions = {
  addEvent,
  removeEvent
};
