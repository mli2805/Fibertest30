import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
  inject
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, debounceTime } from 'rxjs';
import { AppState, OtausSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { OtauPortPath } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-ports-filter',
  templateUrl: './ports-filter.component.html',
  styleUrls: ['./ports-filter.component.css']
})
export class PortsFilterComponent implements OnInit {
  private store: Store<AppState> = inject(Store<AppState>);
  @ViewChild('trigger', { read: ElementRef, static: false }) trigger!: ElementRef;
  public open = false;

  public get triggerWidth(): number {
    return this.trigger.nativeElement.offsetWidth - 3;
  }

  public selectedItem: any = null;

  @Output() public selectedPortsChanged = new EventEmitter<any>();

  private backspaceSubject = new Subject();

  allPorts: (OtauPortPath | null)[] | undefined;
  selectedPorts: any[] = [];
  availablePorts: any[] = [];
  overlayItems: any[] = [];

  textBox!: any;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {
    this.allPorts = CoreUtils.getCurrentState(this.store, OtausSelectors.selectAllOnlinePorts);
    this.availablePorts = this.allPorts;
    this.overlayItems = this.availablePorts;
  }

  ngOnInit(): void {
    this.textBox = document.getElementById('textbox');
    this.textBox?.addEventListener('keyup', this.textboxKeyup.bind(this));

    this.backspaceSubject
      .pipe(debounceTime(1000))
      .subscribe(() => this.selectedPortsChanged.emit(this.selectedPorts));
  }

  textboxKeyup(value: any) {
    if (value.key === 'Enter' || value.keyCode === 13) {
      const current = this.textBox?.value.replace(/ /g, '');
      const otauPortPath = this.availablePorts.find(
        (o) => this.otauPortPathToString(o) === current
      );
      this.selectTag(otauPortPath);
    } else {
      if (!this.open) this.open = true;
      this.filterOverlayItemsFromAvailable();
    }

    this.cdr.detectChanges();
  }

  removeTag(event: MouseEvent, port: any) {
    const index = this.selectedPorts!.indexOf(port, 0);
    if (index > -1) {
      this.selectedPorts!.splice(index, 1);
      this.availablePorts!.push(port);
      this.availablePorts.sort(this.compareOtauPortPath);
      this.filterOverlayItemsFromAvailable();
      this.open = false;
    }

    this.selectedPortsChanged.emit(this.selectedPorts);
    event.stopPropagation();
  }

  filterOverlayItemsFromAvailable() {
    const current = this.textBox?.value.replace(/ /g, '');
    this.overlayItems = [];
    for (let index = 0; index < this.availablePorts.length; index++) {
      const str = this.otauPortPathToString(this.availablePorts[index]);
      if (String(str).includes(current)) this.overlayItems.push(this.availablePorts[index]);
    }
    if (this.overlayItems.length === 1) this.selectedItem = this.overlayItems[0];
  }

  onMenuClicked(event: MouseEvent, port: OtauPortPath) {
    this.selectTag(port);
  }

  triggerClicked(event: MouseEvent) {
    if (this.textBox.value.length > 0) {
      event.stopPropagation();
      return;
    }
    this.open = !this.open;
    if (this.open) this.textBox.focus();
    else this.textBox.blur();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    this.textBox.value = '';
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.open = false;
    }
    this.overlayItems = this.availablePorts;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.textBox.value.length > 0) return;

    if (event.key === 'Backspace' && this.selectedPorts.length > 0) {
      const lastSelected = this.selectedPorts.pop();
      this.availablePorts.push(lastSelected);
      this.filterOverlayItemsFromAvailable();

      this.backspaceSubject.next('');
    }
  }

  selectTag(port: OtauPortPath) {
    const index = this.availablePorts!.indexOf(port, 0);
    if (index > -1) {
      this.availablePorts!.splice(index, 1);
      this.selectedPorts!.push(port);
    }

    this.textBox.value = '';
    this.overlayItems = this.availablePorts;
    this.open = false;
    this.selectedItem = null;

    this.selectedPortsChanged.emit(this.selectedPorts);
  }

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }

  compareOtauPortPath(a: OtauPortPath, b: OtauPortPath): number {
    if (a.ocmPort.portIndex !== b.ocmPort.portIndex)
      return a.ocmPort.portIndex - b.ocmPort.portIndex;
    if (a.cascadePort !== null && b.cascadePort !== null)
      return a.cascadePort.portIndex - b.cascadePort.portIndex;
    return 0;
  }

  otauPortPathToString(p: OtauPortPath): string {
    let result = p.ocmPort.portIndex.toString();
    if (p.cascadePort !== null) {
      result = result + '/' + p.cascadePort.portIndex.toString();
    }
    return result;
  }
}
