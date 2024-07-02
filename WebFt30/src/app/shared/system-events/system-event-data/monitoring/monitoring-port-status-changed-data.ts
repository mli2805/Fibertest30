import { MonitoringPortStatus } from 'src/grpc-generated';

export interface MonitoringPortStatusChangedData {
  MonitoringPortId: number;
  Status: MonitoringPortStatus;
}
