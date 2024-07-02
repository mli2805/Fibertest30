import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  Inject,
  inject,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { AppState, OtausActions, OtausSelectors } from 'src/app/core';
import { OxcAddressInputComponent } from '../oxc-address-input/oxc-address-input.component';
import { CoreService } from 'src/app/core/grpc/services/core.service';
import { GrpcUtils } from 'src/app/core/grpc/grpc.utils';
import {
  OtauDiscover,
  OtauDiscoverError,
  OtauDiscoverResult
} from 'src/app/core/store/models/otau-discover';
import { MapUtils } from 'src/app/core/map.utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'rtu-add-otau-dialog',
  templateUrl: './add-otau-dialog.component.html',
  styleUrls: ['./add-otau-dialog.component.css'],
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }
    `
  ]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddOtauDialogComponent {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  public store: Store<AppState> = inject(Store);
  addOtauError$!: Observable<string | null>;

  otauType = '';
  ocmPort: number;
  ocxAddress: any;

  @ViewChild('oxcAddressInput') oxcAddressInput: ElementRef<any> | undefined;

  @ViewChild(OxcAddressInputComponent)
  private oxcAddressInputComponent!: OxcAddressInputComponent;

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    private coreService: CoreService,
    private ts: TranslateService
  ) {
    this.addOtauError$ = this.store.select(OtausSelectors.selectErrorMessageId);
    this.ocmPort = data.portIndex;
  }

  onOsmClicked() {
    this.otauType = 'OSM';
    this.clean();
    this.showCheck = true;
  }

  onOxcClicked() {
    this.otauType = 'OXC';
    this.clean();
    this.showCheck = false;
  }

  discoveredOtau!: OtauDiscover | null;
  discoveredError!: number | null; // so far only UnsupportedOsmModuleConnected = 1
  errorMessage!: string | null;

  private clean() {
    this.discoveredOtau = null;
    this.errorMessage = null;
  }

  public onChangedOxcAddress() {
    this.clean();
    this.showCheck = this.oxcAddressInputComponent?.isFullIpAddressValid();
  }

  showCheck = false;
  discovering = false;

  async onCheckConnectionClicked() {
    this.clean();
    this.discovering = true;
    const discoverResult = await this.discoverOtau();
    this.discovering = false;

    if (discoverResult === null) {
      this.discoveredOtau = null;
    } else {
      this.discoveredOtau = discoverResult.discover;
    }

    if (this.errorMessage === null && this.discoveredOtau === undefined) {
      this.errorMessage = 'i18n.otau.otau-not-found';
    }
  }

  private async discoverOtau(): Promise<OtauDiscoverResult | null> {
    try {
      const result = await this.discover();
      if (result !== null) {
        if (result.discover !== null) {
          this.discoveredOtau = result.discover;
        }
        if (result.error !== null) {
          switch (result.error) {
            case OtauDiscoverError.OsmModuleNotFound: {
              this.errorMessage = 'i18n.otau.otau-not-found';
              break;
            }
            case OtauDiscoverError.UnsupportedOsmModuleConnected: {
              this.errorMessage = this.ts.instant('i18n.otau.an-unsupported-osm-module', {
                0: this.ocmPort
              });
              break;
            }
          }
        }
      }
      return result;
    } catch (error) {
      const serverError = GrpcUtils.toServerError(error);
      this.errorMessage = serverError.code;
      return null;
    }
  }

  private async discover(): Promise<OtauDiscoverResult | null> {
    if (this.otauType === 'OSM') {
      const response = await firstValueFrom(this.coreService.discoverOsmOtau(this.data.portIndex));
      console.log(response);
      if (response.discoverResult !== undefined) {
        return MapUtils.toOtauDiscoverResult(response.discoverResult);
      } else {
        return null;
      }
    }
    if (this.otauType === 'OXC') {
      this.ocxAddress = this.oxcAddressInputComponent?.getAddress();
      const response = await firstValueFrom(
        this.coreService.discoverOxcOtau(this.ocxAddress.ipAddress, this.ocxAddress.port)
      );
      if (response.discoverResult !== undefined) {
        return MapUtils.toOtauDiscoverResult(response.discoverResult);
      } else {
        return null;
      }
    }
    return null;
  }

  onAddOtauClicked() {
    if (this.otauType === 'OSM') {
      this.store.dispatch(
        OtausActions.addOsmOtau({ ocmPortIndex: this.ocmPort, chainAddress: this.ocmPort })
      );
    }
    if (this.otauType === 'OXC') {
      this.store.dispatch(
        OtausActions.addOxcOtau({
          ocmPortIndex: this.ocmPort,
          ipAddress: this.ocxAddress.ipAddress,
          port: this.ocxAddress.port
        })
      );
    }

    this.dialogRef.close();
  }

  onCancelClicked() {
    this.dialogRef.close();
  }
}
