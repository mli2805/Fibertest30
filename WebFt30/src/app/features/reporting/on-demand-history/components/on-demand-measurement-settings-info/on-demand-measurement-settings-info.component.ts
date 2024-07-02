import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { MeasurementSettings } from 'src/app/core/store/models';
import { NetworkType } from 'src/grpc-generated';

@Component({
  selector: 'rtu-on-demand-measurement-settings-info',
  templateUrl: 'on-demand-measurement-settings-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnDemandMeasurementSettingsInfoComponent {
  networkType = NetworkType;
  @Input() measSettings!: MeasurementSettings;
  @Input() mode: 'full' | 'short' = 'short';
}
