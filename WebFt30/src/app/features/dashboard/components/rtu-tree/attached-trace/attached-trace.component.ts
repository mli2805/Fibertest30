import { Component, Input } from '@angular/core';
import { Trace } from 'src/grpc-generated/rtu_tree';

@Component({
  selector: 'rtu-attached-trace',
  templateUrl: './attached-trace.component.html',
  styleUrls: ['./attached-trace.component.scss']
})
export class AttachedTraceComponent {
  @Input() trace!: Trace;
}
