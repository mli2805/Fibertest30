import { TreeOfAcceptableMeasurementParameters } from './acceptable-measurement-parameters';
import { Bop } from './bop';
import { RtuPartState, MonitoringState, RtuMaker } from './ft-enums';
import { NetAddress } from './net-address';
import { Trace } from './trace';

export class Rtu {
  rtuId!: string;
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

  bops!: Bop[];
  traces!: Trace[];

  acceptableParams!: TreeOfAcceptableMeasurementParameters;

  public isRtuAvailableNow(): boolean {
    return (
      this.mainChannelState === RtuPartState.Ok || this.reserveChannelState === RtuPartState.Ok
    );
  }
}
