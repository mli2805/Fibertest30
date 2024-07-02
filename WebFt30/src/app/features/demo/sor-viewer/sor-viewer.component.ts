import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SorReader, SorTrace } from '@veex/sor';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'rtu-demo-sor-viewer',
  templateUrl: 'sor-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class DemoSorViewerComponent implements OnInit {
  sorTraces: SorTrace[] | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadSorFiles();
    this.cdr.markForCheck();
  }

  async loadSorFiles() {
    const url = `/assets/sample-sors/merged.vxsor`;
    const result$ = await this.http.get(url, {
      observe: 'response',
      responseType: 'arraybuffer'
    });

    const result = await firstValueFrom(result$);

    const sorData = await new SorReader().fromBytes(new Uint8Array(result!.body!));
    const sorTrace = new SorTrace(sorData, 'my trace name ', false);
    this.sorTraces = [sorTrace];
  }
}
