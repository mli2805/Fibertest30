import { ApplyMonitoringSettingsDto } from 'src/app/core/store/models/ft30/apply-monitorig-settings-dto';
import { PortWithTraceDto } from 'src/app/core/store/models/ft30/port-with-trace-dto';
import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { Trace } from 'src/app/core/store/models/ft30/trace';

export class SecUtil {
  static secToString(sec: number): string {
    let result = '';

    const totalMinutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    result = seconds.toString().padStart(2, '0');

    let hours = 0;
    if (totalMinutes > 0) {
      hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      result = minutes.toString().padStart(2, '0') + ':' + result;
    } else {
      return '0:00:' + result;
    }

    if (hours > 0) {
      result = hours + ':' + result;
    } else {
      return '0:' + result;
    }

    return result;
  }

  // для перевода в Автоматический режим без выбора настроек
  static buildAutoModeDto(rtu: Rtu): ApplyMonitoringSettingsDto {
    const dto = new ApplyMonitoringSettingsDto();
    dto.rtuId = rtu.rtuId;
    dto.rtuMaker = rtu.rtuMaker;
    dto.isMonitoringOn = true;

    dto.fastSave = rtu.fastSave;
    dto.preciseMeas = rtu.preciseMeas;
    dto.preciseSave = rtu.preciseSave;

    const bopTraces = rtu.bops.map((b) => b.traces).flat();
    const traces = rtu.traces.concat(bopTraces);

    dto.ports = traces
      .filter((t) => t && t.isIncludedInMonitoringCycle)
      .map((a) => this.toPortWithTraceDto(a!));

    return dto;
  }

  static toPortWithTraceDto(trace: Trace): PortWithTraceDto {
    const port = new PortWithTraceDto();
    port.traceId = trace.traceId;
    port.portOfOtau = trace.port!;
    port.lastTraceState = trace.state;
    port.lastRtuAccidentOnTrace = ReturnCode.MeasurementEndedNormally;
    return port;
  }
}
