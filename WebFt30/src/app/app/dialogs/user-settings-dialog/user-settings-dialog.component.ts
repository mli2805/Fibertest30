import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, AuthSelectors, SettingsActions, SettingsSelectors, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { AudioService } from 'src/app/core/services/audio.service';

@Component({
  selector: 'rtu-user-settings-dialog',
  templateUrl: 'user-settings-dialog.component.html',
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class UserSettingsDialogComponent implements OnInit {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  public store: Store<AppState> = inject(Store);
  user$!: Observable<User | null>;
  saveUserSettingsError$!: Observable<string | null>;

  isSuspicionSignallingChecked!: boolean;
  isRtuStatusSignallingChecked!: boolean;

  constructor(private audioService: AudioService) {
    this.user$ = this.store.select(AuthSelectors.selectUser);
    this.saveUserSettingsError$ = this.store.select(SettingsSelectors.selectSaveUserSettingsError);
  }

  async ngOnInit() {
    this.isSuspicionSignallingChecked = CoreUtils.getCurrentState(
      this.store,
      SettingsSelectors.selectSwitchOffSuspicionSignalling
    );
    this.isRtuStatusSignallingChecked = CoreUtils.getCurrentState(
      this.store,
      SettingsSelectors.selectSwitchOffRtuStatusEventsSignalling
    );
  }

  onChangeSuspicionSignalling() {
    console.log(this.isSuspicionSignallingChecked);
    this.store.dispatch(
      SettingsActions.changeSwitchOffSuspicionSignalling({
        value: this.isSuspicionSignallingChecked
      })
    );
  }

  onChangeRtuStatusSignalling() {
    console.log(this.isRtuStatusSignallingChecked);
    this.store.dispatch(
      SettingsActions.changeSwitchOffRtuStatusEventsSignalling({
        value: this.isRtuStatusSignallingChecked
      })
    );
  }

  isAudioOn = false;
  testAudio() {
    console.log(`testAudio`);
    this.isAudioOn = !this.isAudioOn;
    if (this.isAudioOn) {
      this.audioService.playAlarm();
    } else {
      this.audioService.stopAlarm();
    }
  }
}
