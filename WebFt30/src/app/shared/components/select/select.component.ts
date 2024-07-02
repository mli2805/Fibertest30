import {
  Component,
  Directive,
  Input,
  TemplateRef,
  ContentChild,
  HostListener,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[rtuSelectLabel]'
})
export class SelectLabelDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Directive({
  selector: '[rtuSelectItem]'
})
export class SelectItemDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'rtu-select',
  templateUrl: 'select.component.html',
  styles: [
    `
      :host {
        position: relative;
      }
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @ContentChild(SelectLabelDirective) labelTemplate!: SelectLabelDirective;
  @ContentChild(SelectItemDirective) itemTemplate!: SelectItemDirective;
  @ViewChild('selectButton', { read: ElementRef, static: false }) selectButton!: ElementRef;
  @ViewChild('overlayList') overlayList!: ElementRef;

  @Input() public disabled = false;
  @Input() public cols = 1;
  @Input() public items: any[] | null = null;
  @Input() public minimalistic = false;
  @Output() public selectedItemChange = new EventEmitter<any>();

  private _selectedItem: any = null;
  private _currentSelectedItemInput: any = null;

  @Input() set selectedItem(value: any) {
    this._selectedItem = value;
    this._currentSelectedItemInput = value;
  }

  get selectedItem(): any {
    return this._selectedItem;
  }

  private onChange!: (value: any) => void;
  private onTouched!: () => void;

  public open = false;
  public get selectButtonWidth(): number {
    return this.selectButton.nativeElement.offsetWidth;
  }

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  writeValue(value: any): void {
    this.setItem(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.open = false;
    }
  }

  resetToCurrentSelectedItemInput() {
    this._selectedItem = this._currentSelectedItemInput;
  }

  setItem(item: any) {
    this.open = false;

    if (this.selectedItem != item) {
      this._selectedItem = item;
      this.selectedItemChange.emit(this.selectedItem);

      if (this.onChange) {
        this.onChange(this.selectedItem);
      }
    }
  }

  toogleOpen() {
    this.open = !this.open;

    if (this.open === true) {
      this.cdr.detectChanges();
      this.scrollToSelected();
    }

    if (this.onTouched) {
      this.onTouched();
    }
  }

  scrollToSelected() {
    const selectedItem = this.overlayList.nativeElement.querySelector('.selected-item');
    if (selectedItem) {
      selectedItem.scrollIntoView();
    }
  }
}
