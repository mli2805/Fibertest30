import { Component, Input, OnInit } from '@angular/core';
import {
  SyslogHost,
  SyslogNotificationSettings
} from '../../../../../../../core/store/models/notification-settings';
import { Dialog } from '@angular/cdk/dialog';
import { SyslogHostEditDialogComponent } from '../syslog-host-edit-dialog/syslog-host-edit-dialog.component';

@Component({
  selector: 'rtu-syslog-notification-settings',
  templateUrl: './syslog-notification-settings.component.html',
  styleUrls: ['./syslog-notification-settings.component.css']
})
export class SyslogNotificationSettingsComponent implements OnInit {
  @Input() syslogSettings!: SyslogNotificationSettings;
  @Input() hasPermission!: boolean;

  constructor(private dialog: Dialog) {}

  isEditEnabled = false;
  ngOnInit(): void {
    this.isEditEnabled = this.syslogSettings.enabled && this.hasPermission;
  }

  isSettingsOff() {
    !this.syslogSettings.enabled;
  }

  onEnabledChanged() {
    this.isEditEnabled = !this.isEditEnabled;
  }

  onEditSyslogHostClicked(syslogHost: SyslogHost) {
    if (!this.isEditEnabled) return;
    this.openDialog(syslogHost);
  }

  onAddSyslogHostClicked() {
    const syslogHost = new SyslogHost();
    syslogHost.name = 'new host';
    syslogHost.version = 'RFC3164';
    syslogHost.transportProtocol = 'TCP';
    syslogHost.hostAddress = '';
    this.openDialog(syslogHost);
  }

  openDialog(syslogHost: SyslogHost) {
    this.dialog.open(SyslogHostEditDialogComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      disableClose: true,
      data: { syslogHost }
    });
  }

  onDeleteSyslogHostClicked(syslogHost: SyslogHost) {
    if (!this.isEditEnabled) return;
    // here syslog host will be deleted
  }
}
