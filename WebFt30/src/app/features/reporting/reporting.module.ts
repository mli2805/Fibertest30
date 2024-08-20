import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { ReportingComponent } from './reporting/reporting.component';
import { ReportingRoutingModule } from './reporting-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SystemEventsComponent } from './system-events/components/system-events/system-events.component';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { NoDataOrLoadMoreComponent } from './shared/no-data-or-load-more/no-data-or-load-more.component';
import { InverseCdkScrollOffsetDirective } from './shared/inverse-rendered-offset.directive';

@NgModule({
  imports: [
    ReportingRoutingModule,
    SharedModule,
    FiberizerCoreModule,
    ScrollingModule,
    TranslateModule.forChild()
  ],
  exports: [],
  declarations: [
    ReportingComponent,
    SystemEventsComponent,
    NoDataOrLoadMoreComponent,
    InverseCdkScrollOffsetDirective
  ],
  providers: []
})
export class ReportingModule {}
