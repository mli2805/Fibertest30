import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rtu-net-evnts-bop',
  templateUrl: './net-evnts-bop.component.html',
  styles: [':host { overflow-y: auto; display: flex; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetEvntsBopComponent {}
