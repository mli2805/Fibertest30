import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { DemoGreeterComponent } from './greeter/components/demo-greeter.component';
import { DemoComponent } from './demo/demo.component';
import { DemoRoutingModule } from './demo-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FEATURE_NAME, reducers } from './demo.state';
import { GreeterEffects } from './greeter/greeter.effects';
import { DemoComponentsComponent } from './demo-components/demo-components.component';
import { DemoEffects } from './demo.effects';
import { RtuTranslateLoader } from 'src/app/shared/utils/rtu-translate-loader';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { DemoSorViewerComponent } from './sor-viewer/sor-viewer.component';

@NgModule({
  imports: [
    SharedModule,
    FiberizerCoreModule,
    DemoRoutingModule,
    StoreModule.forFeature(FEATURE_NAME, reducers),
    EffectsModule.forFeature([DemoEffects, GreeterEffects]),
    TranslateModule.forChild({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new RtuTranslateLoader(http, 'demo'),
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  exports: [],
  declarations: [
    DemoComponent,
    DemoGreeterComponent,
    DemoComponentsComponent,
    DemoSorViewerComponent
  ],
  providers: []
})
export class DemoModule {}
