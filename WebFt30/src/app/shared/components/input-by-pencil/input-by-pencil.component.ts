import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'rtu-input-by-pencil',
  templateUrl: './input-by-pencil.component.html'
})
export class InputByPencilComponent {
  @ViewChild('inputElement') inputElement: ElementRef<any> | undefined;

  private _fieldValue = '';
  get fieldValue() {
    return this._fieldValue;
  }
  @Input() set fieldValue(val: string) {
    this._fieldValue = val;
  }

  @Output() changedValueEvent = new EventEmitter<string>();

  isEditMode = false;
  @Input() hasPermission = false;

  constructor(private cdr: ChangeDetectorRef) {}

  onPencilClicked() {
    this.isEditMode = true;
    this.cdr.detectChanges();
    this.inputElement?.nativeElement.focus();
    this.inputElement?.nativeElement.select();
  }

  onEnterSignClicked() {
    this.fieldValue = this.inputElement?.nativeElement.value;
    this.isEditMode = false;
    this.changedValueEvent.emit(this.fieldValue);
  }

  tryCloseInput() {
    this.fieldValue = this.inputElement?.nativeElement.value;
    if (this.isEditMode) {
      this.isEditMode = false;
      this.changedValueEvent.emit(this.fieldValue);
    }
  }
}
