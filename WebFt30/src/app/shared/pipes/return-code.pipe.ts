import { Pipe, PipeTransform } from '@angular/core';
import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';

@Pipe({
  name: 'returnCodePipe'
})
export class ReturnCodePipe implements PipeTransform {
  transform(code: ReturnCode): string {
    switch (code) {
      case ReturnCode.Ok:
        return 'i18n.ft.ok';
      case ReturnCode.Error:
        return 'i18n.ft.error';
      case ReturnCode.InProgress:
        return 'i18n.ft.in-progress';
      case ReturnCode.TimeOutExpired:
        return 'i18n.ft.timeout-expired';
      case ReturnCode.NotFound:
        return 'i18n.ft.not-found';
      case ReturnCode.WrongDataCenter:
        return 'i18n.ft.wrong-data-center';

      case ReturnCode.RtuInitializationError:
        return 'i18n.ft.rtu-init-error';
      case ReturnCode.RtuInitializedSuccessfully:
        return 'i18n.ft.rtu-init-success';
      case ReturnCode.OtdrInitializationCannotLoadDll:
        return 'i18n.ft.otdr-load-dll-failed';
      case ReturnCode.OtdrInitializationCannotInitializeDll:
        return 'i18n.ft.otdr-init-dll-failed';
      case ReturnCode.FailedToConnectOtdr:
        return 'i18n.ft.otdr-connect-failed';
      case ReturnCode.OtdrInitializationFailed:
        return 'i18n.ft.otdr-init-failed';
      case ReturnCode.RtuUnauthorizedAccess:
        return 'i18n.ft.rtu-unauthorized';

      case ReturnCode.MeasurementError:
        return 'i18n.ft.measurement-error';
      case ReturnCode.MeasurementEndedNormally:
        return 'i18n.ft.measurement-ended';
      case ReturnCode.MeasurementTimeoutExpired:
        return 'i18n.ft.measurement-timeout';

      case ReturnCode.ClientRegisteredSuccessfully:
        return 'OK';
      case ReturnCode.NoSuchUserOrWrongPassword:
        return 'i18n.ft.auth-failed';
      case ReturnCode.NoLicenseHasBeenAppliedYet:
        return 'i18n.ft.no-license';

      case ReturnCode.BaseRefAssignedSuccessfully:
        return 'i18n.ft.base-ref-assigned';
      case ReturnCode.BaseRefAssignmentFailed:
        return 'i18n.ft.base-ref-failed';

      case ReturnCode.FetchMeasurementFromRtu4000Failed:
        return 'i18n.ft.fetch-measurement-failed';

      default:
        return 'i18n.ft.unknown';
    }
  }
}
