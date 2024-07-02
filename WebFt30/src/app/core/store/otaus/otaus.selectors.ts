import { createSelector } from '@ngrx/store';
import { selectOtausState } from '../../core.state';
import { OtausState } from './otaus.state';
import { OtausStateAdapter } from './otaus.reducer';
import { Otau, OtauPortPath } from '../models';
import { Dictionary } from '@ngrx/entity';
import { MonitoringPortStatus } from 'src/grpc-generated';
import { MonitoringPort } from '../models';
import { MonitoringPortSelectors } from '../monitoring/monitoring-port.selectors';
import { RouterSelectors } from '../../router/router.selectors';

export const OcmOtauPortIndex = 0;
export const OcmOtauOtauId = 1;

const { selectIds, selectEntities, selectAll, selectTotal } = OtausStateAdapter.getSelectors();
const selectOtaus = createSelector(selectOtausState, (state: OtausState) => state);

const selectLoading = createSelector(selectOtaus, (state: OtausState) => state.loading);
const selectErrorMessageId = createSelector(
  selectOtaus,
  (state: OtausState) => state.errorMessageId
);

const selectOtauEntities = createSelector(selectOtaus, selectEntities);
const selectOtausOtausNotSorted = createSelector(selectOtaus, selectAll);
const selectOtausOtaus = createSelector(selectOtausOtausNotSorted, (otaus: Otau[]) => {
  return otaus.sort((a, b) => a.ocmPortIndex - b.ocmPortIndex);
});

export const selectOtauById = (otauId: number) =>
  createSelector(selectOtaus, (state: OtausState) => {
    return state.entities[otauId] || null;
  });

const selectOtauMapByOcmPortIndex = createSelector(
  selectOtauEntities,
  (otaus: Dictionary<Otau>) => {
    const map: Dictionary<Otau> = {};

    for (const otau of Object.values(otaus)) {
      map[otau!.ocmPortIndex] = otau;
    }

    return map;
  }
);

const selectOcmOtau = createSelector(
  selectOtauMapByOcmPortIndex,
  (otauMapByOcmPortIndex: Dictionary<Otau>) => {
    const ocmOtau = otauMapByOcmPortIndex[OcmOtauPortIndex];
    if (!ocmOtau) {
      console.error('OCM OTAU not found');
      throw new Error('OCM OTAU not found');
    }

    return ocmOtau;
  }
);

const selectRouterSelectedOtauOcmPortIndex = createSelector(
  selectOtaus,
  (state: OtausState) => state.routerSelectedOtauOcmPortIndex
);

const selectRouterSelectedOtauOrDefault = createSelector(
  selectOtauMapByOcmPortIndex,
  selectRouterSelectedOtauOcmPortIndex,
  selectOcmOtau,
  (otauMapByOcmPortIndex: Dictionary<Otau>, selectedOtauOcmPortIndex, ocmOtau) => {
    if (selectedOtauOcmPortIndex != null) {
      const otau = otauMapByOcmPortIndex[selectedOtauOcmPortIndex];
      if (otau) {
        return otau;
      }
    }

    return ocmOtau;
  }
);

const selectOtauByOcmPortIndex = (ocmPortIndex: number) =>
  createSelector(selectOtauMapByOcmPortIndex, (otaus: Dictionary<Otau>) => {
    return otaus[ocmPortIndex] || null;
  });

const selectOtauPathsByMonitoringPortId = createSelector(
  selectOcmOtau,
  selectOtauMapByOcmPortIndex,
  (ocmOtau: Otau, otauMap: Dictionary<Otau>) => {
    const monitoringPortMap = new Map<number, OtauPortPath>();

    for (const port of ocmOtau.ports) {
      const cascadeOtau = otauMap[port.portIndex];
      if (!cascadeOtau) {
        monitoringPortMap.set(port.monitoringPortId, {
          monitoringPortId: port.monitoringPortId,
          ocmPort: port,
          cascadePort: null
        });
      } else {
        for (const cascadePort of cascadeOtau.ports) {
          monitoringPortMap.set(cascadePort.monitoringPortId, {
            monitoringPortId: cascadePort.monitoringPortId,
            ocmPort: port,
            cascadePort: cascadePort
          });
        }
      }
    }

    return monitoringPortMap;
  }
);

const selectOtauPathByMonitoringPortId = (monitoringPortId: number) =>
  createSelector(
    selectOtauPathsByMonitoringPortId,
    (monitoringPortMap: Map<number, OtauPortPath>) => {
      return monitoringPortMap.get(monitoringPortId) || null;
    }
  );

const selectOtauPathByRouterMonitoringPortId = createSelector(
  RouterSelectors.selectMonitoringPortIdParam,
  selectOtauPathsByMonitoringPortId,
  (monitoringPortId: number | null, monitoringPortMap: Map<number, OtauPortPath>) => {
    if (!monitoringPortId) {
      return null;
    }
    return monitoringPortMap.get(monitoringPortId) || null;
  }
);

const selectAllOnlinePorts = createSelector(
  selectOtauEntities,
  MonitoringPortSelectors.selectMonitoringPortEntities,
  selectOtauPathsByMonitoringPortId,
  (
    otaus: Dictionary<Otau>,
    monitoringPorts: Dictionary<MonitoringPort>,
    monitoringPortMap: Map<number, OtauPortPath>
  ) => {
    const portList: OtauPortPath[] = [];

    for (const otauPortPath of monitoringPortMap.values()) {
      const ocmMonitoringPort = monitoringPorts[otauPortPath.ocmPort.monitoringPortId];

      if (
        otauPortPath.ocmPort.unavailable ||
        !ocmMonitoringPort ||
        ocmMonitoringPort.status == MonitoringPortStatus.Maintenance
      ) {
        continue;
      }

      if (otauPortPath.cascadePort) {
        const cascadeOtau = otaus[otauPortPath.cascadePort.otauId];
        if (!cascadeOtau || !cascadeOtau.isConnected) {
          continue;
        }

        const cascadeMonitoringPort = monitoringPorts[otauPortPath.cascadePort.monitoringPortId];
        if (
          otauPortPath.cascadePort.unavailable ||
          !cascadeMonitoringPort ||
          cascadeMonitoringPort.status == MonitoringPortStatus.Maintenance
        ) {
          continue;
        }
      }

      portList.push(otauPortPath);
    }

    return portList;
  }
);

const selectAllOnlineOnPorts = createSelector(
  selectOtauEntities,
  MonitoringPortSelectors.selectMonitoringPortEntities,
  selectOtauPathsByMonitoringPortId,
  (
    otaus: Dictionary<Otau>,
    monitoringPorts: Dictionary<MonitoringPort>,
    monitoringPortMap: Map<number, OtauPortPath>
  ) => {
    const portList: OtauPortPath[] = [];

    for (const otauPortPath of monitoringPortMap.values()) {
      const ocmMonitoringPort = monitoringPorts[otauPortPath.ocmPort.monitoringPortId];

      if (
        otauPortPath.ocmPort.unavailable ||
        !ocmMonitoringPort ||
        ocmMonitoringPort.status == MonitoringPortStatus.Maintenance
      ) {
        continue;
      }

      if (ocmMonitoringPort.status === MonitoringPortStatus.On) {
        portList.push(otauPortPath);
      }

      if (otauPortPath.cascadePort) {
        const cascadeOtau = otaus[otauPortPath.cascadePort.otauId];
        if (!cascadeOtau || !cascadeOtau.isConnected) {
          continue;
        }

        const cascadeMonitoringPort = monitoringPorts[otauPortPath.cascadePort.monitoringPortId];
        if (
          otauPortPath.cascadePort.unavailable ||
          !cascadeMonitoringPort ||
          cascadeMonitoringPort.status == MonitoringPortStatus.Maintenance
        ) {
          continue;
        }

        if (cascadeMonitoringPort.status === MonitoringPortStatus.On) {
          portList.push(otauPortPath);
        }
      }
    }

    return portList;
  }
);

export const OtausSelectors = {
  selectOtaus,
  selectOtausOtaus,
  selectOtauById,
  selectAllOnlinePorts,
  selectAllOnlineOnPorts,
  selectOcmOtau,
  selectLoading,
  selectErrorMessageId,
  selectOtauMapByOcmPortIndex,
  selectOtauByOcmPortIndex,
  selectOtauPathsByMonitoringPortId,
  selectOtauPathByMonitoringPortId,
  selectOtauPathByRouterMonitoringPortId,
  selectRouterSelectedOtauOcmPortIndex,
  selectRouterSelectedOtauOrDefault
};
