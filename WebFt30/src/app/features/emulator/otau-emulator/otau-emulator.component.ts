import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { OtauEmulatorSetting } from '../emulator/otau-emulator-config';

@Component({
  selector: 'rtu-otau-emulator',
  templateUrl: 'otau-emulator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtauEmulatorComponent {
  @Input() otau!: OtauEmulatorSetting;
  @Output() otauChange: EventEmitter<any> = new EventEmitter();

  @Input() exceptionExpanded = false;
  @Output() exceptionExpandedChange: EventEmitter<any> = new EventEmitter();

  toggleOffline() {
    this.otau.Offline = !this.otau.Offline;
    this.notifyChanged();
  }

  toggleSupportBlink() {
    this.otau.SupportBlink = !this.otau.SupportBlink;
    this.notifyChanged();
  }

  onPortCountChange(portCount: number) {
    this.otau.PortCount = portCount;
    this.notifyChanged();
  }

  toggleDiscover() {
    this.otau.Exceptions.Discover = !this.otau.Exceptions.Discover;
    this.notifyChanged();
  }

  togglePing() {
    this.otau.Exceptions.Ping = !this.otau.Exceptions.Ping;
    this.notifyChanged();
  }

  toggleConnect() {
    this.otau.Exceptions.Connect = !this.otau.Exceptions.Connect;
    this.notifyChanged();
  }

  toggleDisconnect() {
    this.otau.Exceptions.Disconnect = !this.otau.Exceptions.Disconnect;
    this.notifyChanged();
  }

  toggleSetPort() {
    this.otau.Exceptions.SetPort = !this.otau.Exceptions.SetPort;
    this.notifyChanged();
  }

  toggleBlink() {
    this.otau.Exceptions.Blink = !this.otau.Exceptions.Blink;
    this.notifyChanged();
  }

  toggleUnknowModel() {
    this.otau.Exceptions.UnknownOsmModel = !this.otau.Exceptions.UnknownOsmModel;
    this.notifyChanged();
  }

  notifyChanged() {
    this.otauChange.emit();
  }
  onExceptionExpandedChange() {
    this.exceptionExpandedChange.emit();
  }

  getSetExceptionsCount(): number {
    let count = 0;
    if (this.otau.Exceptions.Discover) {
      count++;
    }
    if (this.otau.Exceptions.Ping) {
      count++;
    }
    if (this.otau.Exceptions.Connect) {
      count++;
    }
    if (this.otau.Exceptions.Disconnect) {
      count++;
    }
    if (this.otau.Exceptions.SetPort) {
      count++;
    }
    if (this.otau.Exceptions.Blink) {
      count++;
    }
    return count;
  }
}
