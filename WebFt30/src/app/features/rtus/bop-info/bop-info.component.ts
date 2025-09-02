import { Component, Input, OnInit } from '@angular/core';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { Bop } from 'src/app/core/store/models/ft30/bop';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

@Component({
    selector: 'rtu-bop-info',
    templateUrl: './bop-info.component.html',
    standalone: false
})
export class BopInfoComponent implements OnInit {
  @Input() windowId!: string;
  @Input() zIndex!: number;

  @Input() payload!: any;
  bop!: Bop;
  rtu!: Rtu;

  constructor(private windowService: WindowService) {}

  ngOnInit(): void {
    this.bop = this.payload.bop;
    this.rtu = this.payload.rtu;
  }

  close() {
    this.windowService.unregisterWindow(this.windowId, 'BopInfo');
  }
}
