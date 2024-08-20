import { NgModule, inject } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { StartPageModule } from './app/pages/start-page/start-page.module';
import { ErrorPageComponent } from './app/pages/erorr-page/error-page.component';
import { LoginPageComponent } from './app/pages/login-page/login-page.component';
import { canActivateErrorPage } from './guards';
import { TestStandComponent } from './app/test-stand/test-stand.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => StartPageModule,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'demo',
    loadChildren: () => import('./features/demo/demo.module').then((m) => m.DemoModule)
  },

  {
    path: 'error',
    canActivate: [canActivateErrorPage],
    component: ErrorPageComponent
  },
  {
    path: 'test-stand',
    component: TestStandComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
