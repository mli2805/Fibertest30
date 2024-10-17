import { NgModule } from '@angular/core';
import { StsEvntsComponent } from './sts-evnts/sts-evnts.component';
import { StatusEventsComponent } from './status-events/status-events.component';
import { StsEvntsRoutingsModule } from './sts-evnts-routings';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [StsEvntsRoutingsModule, SharedModule],
  exports: [],
  declarations: [StsEvntsComponent, StatusEventsComponent],
  providers: []
})
export class StsEvntsModule {}
