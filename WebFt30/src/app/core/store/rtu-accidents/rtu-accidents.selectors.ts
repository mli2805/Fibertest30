import { createSelector } from '@ngrx/store';
import { selectRtuAccidentsState } from '../../core.state';
import { RtuAccidentsState } from './rtu-accidents.state';
import { RtuAccident } from '../models/ft30/rtu-accident';
import { RtuAccidentsStateAdapter } from './rtu-accidents.reducer';

const { selectAll, selectEntities, selectTotal } = RtuAccidentsStateAdapter.getSelectors();

const selectRtuAccidents = createSelector(selectRtuAccidentsState, selectAll);

const selectLoading = createSelector(
  selectRtuAccidentsState,
  (state: RtuAccidentsState) => state.loading
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

export const selectSortedRtuAccidents = createSelector(
  selectRtuAccidents,
  (events): RtuAccident[] =>
    events
      .slice() // создаём копию массива, чтобы не мутировать оригинал
      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
);

export const RtuAccidentsSelectors = {
  selectRtuAccidents,
  selectLoading,
  selectErrorMessageId,

  selectRtuAccidentById,
  selectSortedRtuAccidents
};
