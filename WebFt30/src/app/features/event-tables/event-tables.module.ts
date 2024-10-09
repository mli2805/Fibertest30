import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { EventTablesComponent } from './event-tables.component';
import { EventTablesRoutingModule } from './event-tables-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { NoDataOrLoadMoreComponent } from '../../shared/components/no-data-or-load-more/no-data-or-load-more.component';
import { InverseCdkScrollOffsetDirective } from '../../shared/components/inverse-rendered-offset.directive';

@NgModule({
  imports: [
    EventTablesRoutingModule,
    SharedModule,
    FiberizerCoreModule,
    ScrollingModule,
    TranslateModule.forChild()
  ],
  exports: [],
  declarations: [EventTablesComponent, NoDataOrLoadMoreComponent, InverseCdkScrollOffsetDirective],
  providers: []
})
export class EventTablesModule {}
