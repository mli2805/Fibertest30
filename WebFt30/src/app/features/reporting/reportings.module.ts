import { NgModule } from '@angular/core';
import { ReportingRoutingModule } from './reporting-routing';
import { ReportingComponent } from './reporting/reporting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { SystemEventsComponent } from './system-events/system-events.component';

@NgModule({
  imports: [
    ReportingRoutingModule,
    SharedModule,
    FiberizerCoreModule,
    ScrollingModule,
    TranslateModule.forChild()
  ],
  exports: [],
  declarations: [ReportingComponent, SystemEventsComponent],
  providers: []
})
export class Reporting {}
