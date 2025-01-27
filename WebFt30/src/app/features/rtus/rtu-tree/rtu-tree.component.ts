import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, RtuTreeSelectors } from 'src/app/core';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { GisMapService } from '../../gis/gis-map.service';

@Component({
  selector: 'rtu-rtu-tree',
  templateUrl: './rtu-tree.component.html',
  providers: [GisMapService],
  styles: [':host { overflow-y: auto; display: flex; width: 100%; height: 100%; }']
})
export class RtuTreeComponent {
  rtus$ = this.store.select(RtuTreeSelectors.selectRtuArray);
  inProgress$ = this.store.select(RtuMgmtSelectors.selectRtuOperationInProgress);
  loading$ = this.store.select(RtuTreeSelectors.selectLoading);
  hasEditPermission$ = this.store.select(AuthSelectors.selectHasEditGraphPermission);

  constructor(private store: Store<AppState>, public gisMapService: GisMapService) {}
}
