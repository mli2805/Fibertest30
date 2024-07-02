import { NgModule } from '@angular/core';
import { VxSorViewerModule } from '@veex/sor';
import { VxLinkMapViewerModule } from '@veex/link-map';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  SorAreaProviderComponent,
  SorResultBaselineComponent,
  SorViewerRealtimeProviderComponent,
  LinkMapAreaProviderComponent
} from './components/viewer-providers';


@NgModule({
  imports: [SharedModule, VxSorViewerModule, VxLinkMapViewerModule],
  declarations: [
    SorAreaProviderComponent,
    SorViewerRealtimeProviderComponent,
    SorResultBaselineComponent,
    LinkMapAreaProviderComponent
  ],
  exports: [
    SorAreaProviderComponent,
    SorViewerRealtimeProviderComponent,
    SorResultBaselineComponent,
    LinkMapAreaProviderComponent
  ],
  providers: []
})
export class FiberizerCoreModule {}
