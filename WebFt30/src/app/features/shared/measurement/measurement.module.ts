import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { OtdrTaskButtonComponent } from './components/otdr-task-button/otdr-task-button.component';
import { AlarmsWithEventsTableComponent } from './components/alarms-with-events-table/alarms-with-events-table.component';

@NgModule({
  imports: [SharedModule, RouterModule, TranslateModule.forChild()],
  declarations: [OtdrTaskButtonComponent, AlarmsWithEventsTableComponent],
  exports: [OtdrTaskButtonComponent, AlarmsWithEventsTableComponent],
  providers: []
})
export class MeasurementModule {}
