import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SyslogHost } from '../../../../../../../core/store/models/notification-settings';

@Component({
  selector: 'rtu-syslog-host-edit-dialog',
  templateUrl: './syslog-host-edit-dialog.component.html',
  styleUrls: ['./syslog-host-edit-dialog.component.css']
})
export class SyslogHostEditDialogComponent implements OnInit {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);

  syslogVersions: string[] = ['RFC3164', 'RFC5424'];
  syslogProtocols: string[] = ['TCP', 'UDP'];

  syslogHost: SyslogHost;
  form!: FormGroup;

  constructor(@Inject(DIALOG_DATA) private data: any) {
    this.syslogHost = data.syslogHost;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.syslogHost.name),
      version: new FormControl(this.syslogHost.version),
      protocol: new FormControl(this.syslogHost.transportProtocol),
      address: new FormControl(this.syslogHost.hostAddress)
    });
  }

  onAddClicked() {
    console.log();
  }

  onDiscardClicked() {
    this.dialogRef.close();
  }
}
