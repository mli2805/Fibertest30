import { NgModule } from '@angular/core';
import { StsEvntsComponent } from './sts-evnts/sts-evnts.component';
import { StatusEventsComponent } from './status-events/status-events.component';
import { StsEvntsRoutingsModule } from './sts-evnts-routings';

@NgModule({
  imports: [StsEvntsRoutingsModule],
  exports: [],
  declarations: [StsEvntsComponent, StatusEventsComponent],
  providers: []
})
export class StsEvntsModule {}
