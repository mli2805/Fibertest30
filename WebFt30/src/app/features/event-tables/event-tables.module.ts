import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { EventTablesComponent } from './event-tables.component';
import { EventTablesRoutingModule } from './event-tables-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SystemEventsComponent } from './system-events/system-events.component';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { NoDataOrLoadMoreComponent } from './shared/no-data-or-load-more/no-data-or-load-more.component';
import { InverseCdkScrollOffsetDirective } from './shared/inverse-rendered-offset.directive';
import { OpticalEventsComponent } from './optical-events/optical-events.component';
import { NewtorkEventsComponent } from './newtork-events/newtork-events.component';
import { BopNetworkEventsComponent } from './bop-network-events/bop-network-events.component';
import { RtuStatusEventsComponent } from './rtu-status-events/rtu-status-events.component';

@NgModule({
  imports: [
    EventTablesRoutingModule,
    SharedModule,
    FiberizerCoreModule,
    ScrollingModule,
    TranslateModule.forChild()
  ],
  exports: [],
  declarations: [
    EventTablesComponent,
    SystemEventsComponent,
    NoDataOrLoadMoreComponent,
    InverseCdkScrollOffsetDirective,
    OpticalEventsComponent,
    NewtorkEventsComponent,
    BopNetworkEventsComponent,
    RtuStatusEventsComponent
  ],
  providers: []
})
export class EventTablesModule {}
