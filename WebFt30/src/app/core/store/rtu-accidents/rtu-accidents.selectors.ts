import { createSelector } from '@ngrx/store';
import { selectRtuAccidentsState } from '../../core.state';
import { RtuAccidentsState } from './rtu-accidents.state';
import { RtuAccident } from '../models/ft30/rtu-accident';

const selectRtuAccidents = createSelector(
  selectRtuAccidentsState,
  (state: RtuAccidentsState) => state.rtuAccidents
);

const selectLoading = createSelector(
  selectRtuAccidentsState,
  (state: RtuAccidentsState) => state.loading
);

const selectLoadedTime = createSelector(
  selectRtuAccidentsState,
  (state: RtuAccidentsState) => state.loadedTime
);

const selectErrorMessageId = createSelector(selectRtuAccidentsState, (state: RtuAccidentsState) => {
  if (state.error === null) {
    return null;
  }

  return 'i18n.ft.cant-load-rtu-accidents';
});

const selectRtuAccidentById = (id: number) =>
  createSelector(selectRtuAccidents, (opAccidents: RtuAccident[] | null) => {
    return opAccidents?.find((o) => o.id === id) || null;
  });

export const RtuAccidentsSelectors = {
  selectRtuAccidents,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId,

  selectRtuAccidentById
};
