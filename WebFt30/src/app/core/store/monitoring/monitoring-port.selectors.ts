import { createSelector } from '@ngrx/store';
import { MonitoringPortState } from './monitoring-port.state';
import { selectMonitoringPortState } from '../../core.state';
import {
  CombinedMonitoringTimeSlot,
  MonitoringPort,
  MonitoringTimeSlot,
  Otau,
  OtauPort,
  CombinedPort,
  ExpandedMonitoringTimeSlot
} from '../models';
import { MonitoringPortStateAdapter } from './monitoring-port.reducer';
import { Dictionary } from '@ngrx/entity';
import { OtausSelectors } from '../otaus/otaus.selectors';
import { RouterSelectors } from '../../router/router.selectors';

const { selectIds, selectEntities, selectAll, selectTotal } =
  MonitoringPortStateAdapter.getSelectors();

const selectMonitoringPort = createSelector(
  selectMonitoringPortState,
  (state: MonitoringPortState) => state
);

const selectMonitoringPortEntities = createSelector(selectMonitoringPort, selectEntities);

const selectLoading = createSelector(
  selectMonitoringPort,
  (state: MonitoringPortState) => state.loading
);
const selectErrorMessageId = createSelector(
  selectMonitoringPort,
  (state: MonitoringPortState) => state.errorMessageId
);

const selectMonitoringTimeSlots = createSelector(
  selectMonitoringPort,
  (state: MonitoringPortState) => state.timeSlots
);

const selectMonitoringPortById = (monitoringPortId: number) =>
  createSelector(selectMonitoringPort, (state: MonitoringPortState) => {
    return state.entities[monitoringPortId] || null;
  });

const selectMonitoringPortByRouteMonitoringPortId = createSelector(
  RouterSelectors.selectMonitoringPortIdParam,
  selectMonitoringPortEntities,
  (monitoringPortId: number | null, entities: Dictionary<MonitoringPort>) => {
    if (!monitoringPortId) {
      return null;
    }
    return entities[monitoringPortId] || null;
  }
);

const selectCombinedOtauPorts = (otau: Otau) =>
  createSelector(
    OtausSelectors.selectOtauMapByOcmPortIndex,
    selectMonitoringPortEntities,
    (otausByOcmIndex: Dictionary<Otau>, entities: Dictionary<MonitoringPort>) => {
      return otau.ports.map((otauPort) => {
        const cascadeOtau =
          otau.ocmPortIndex == 0 ? otausByOcmIndex[otauPort.portIndex] || null : null;
        const monitoringPort = entities[otauPort.monitoringPortId] || null;
        const combinedPort: CombinedPort = { otauPort, monitoringPort, cascadeOtau };
        return combinedPort;
      });
    }
  );

const selectAllUsedTimeSlotIds = createSelector(
  selectMonitoringPortEntities,
  (entities: Dictionary<MonitoringPort>) => {
    return new Set(
      Object.values(entities).flatMap(
        (monitoringPort) => monitoringPort!.schedule.timeSlotIds ?? []
      )
    );
  }
);

const selectExpandedTimeSlots = createSelector(
  selectMonitoringTimeSlots,
  selectMonitoringPortEntities,
  (timeSlots: MonitoringTimeSlot[], entities: Dictionary<MonitoringPort>) => {
    const timeSlotPortMap: Dictionary<MonitoringPort> = {};
    Object.values(entities).forEach((monitoringPort) => {
      monitoringPort!.schedule.timeSlotIds?.forEach((id) => {
        timeSlotPortMap[id] = monitoringPort;
      });
    });

    return timeSlots.map((timeSlot) => {
      return new ExpandedMonitoringTimeSlot(timeSlot, timeSlotPortMap[timeSlot.id]?.id || -1);
    });
  }
);

// const selectCombinedMonitoringTimeSlots = createSelector(
//   selectMonitoringTimeSlots,
//   selectAllUsedTimeSlotIds,
//   (timeSlots: MonitoringTimeSlot[], used: Set<number>) => {
//     return timeSlots.map((timeSlot) => {
//       const combined: CombinedMonitoringTimeSlot = {
//         timeSlot: timeSlot,
//         used: used.has(timeSlot.id)
//       };
//       return combined;
//     });
//   }
// );

export const MonitoringPortSelectors = {
  selectMonitoringPort,
  selectMonitoringPortEntities,
  selectLoading,
  selectErrorMessageId,
  selectMonitoringPortById,
  selectMonitoringPortByRouteMonitoringPortId,
  selectCombinedOtauPorts,
  selectExpandedTimeSlots
};
