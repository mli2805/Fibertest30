import { Component, Input } from '@angular/core';
import { Trace } from 'src/grpc-generated/rtu_tree';

@Component({
  selector: 'rtu-detached-trace',
  templateUrl: './detached-trace.component.html',
  styleUrls: ['./detached-trace.component.scss']
})
export class DetachedTraceComponent {
  @Input() trace!: Trace;
}
