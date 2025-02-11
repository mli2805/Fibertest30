import { TreeOfAcceptableMeasurementParameters } from './acceptable-measurement-parameters';
import { Bop } from './bop';
import { RtuPartState, MonitoringState, RtuMaker, Frequency, FiberState } from './ft-enums';
import { NetAddress } from './net-address';
import { Trace } from './trace';

export class Rtu {
  rtuId!: string;
  nodeId!: string;
  rtuMaker!: RtuMaker;
  title!: string;

  mfid!: string | null;
  mfsn!: string | null;
  omid!: string | null;
  omsn!: string | null;
  serial!: string | null;
  version!: string | null;
  version2!: string | null;

  ownPortCount!: number;
  fullPortCount!: number;

  mainChannel!: NetAddress;
  mainChannelState!: RtuPartState;
  reserveChannel!: NetAddress;
  reserveChannelState!: RtuPartState;
  isReserveChannelSet!: boolean;
  otdrNetAddress!: NetAddress;
  monitoringMode!: MonitoringState;
  preciseMeas!: Frequency;
  preciseSave!: Frequency;
  fastSave!: Frequency;

  bops!: Bop[];
  traces!: Trace[];

  acceptableParams!: TreeOfAcceptableMeasurementParameters;

  // initialized during mapping
  isRtuAvailable!: boolean;
  isMonitoringOn!: boolean;
  bopsState!: RtuPartState;
  ownAttachedTraceCount!: number;
  fullAttachedTraceCount!: number;

  children!: any[];
  comment!: string | null;
}
