import { NetworkType } from 'src/grpc-generated';

export class MeasurementSettings {
  isValid!: boolean;
  autoMode!: boolean;

  networkType!: NetworkType;

  backscatteringCoeff!: string | null;
  refractiveIndex!: string | null;

  laser!: string;
  distanceRange!: string | null;
  averagingTime!: string | null;
  pulse!: string | null;
  samplingResolution!: string | null;

  fastMeasurement!: boolean;
  frontPanelCheck!: boolean;

  eventLossThreshold!: string | null;
  eventReflectanceThreshold!: string | null;
  endOfFiberThreshold!: string | null;

  splitter1dB!: number;
  splitter2dB!: number;
  mux!: number;
}
