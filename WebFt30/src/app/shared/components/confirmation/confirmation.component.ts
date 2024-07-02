import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Type,
  ViewChild,
  ViewContainerRef,
  inject
} from '@angular/core';

type ConfirmationMode = 'yes-no' | 'remove';

@Component({
  selector: 'rtu-confirmation',
  templateUrl: './confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationComponent implements AfterViewInit {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  @ViewChild('titleContainer', { read: ViewContainerRef }) titleContainerRef!: ViewContainerRef;

  mode: ConfirmationMode;
  title: string | Type<any> | null = null;
  message: string | null = null;

  constructor(
    @Inject(DIALOG_DATA)
    private data: {
      title: string | Type<any> | undefined;
      titleInput: any;
      message: string;
      mode: ConfirmationMode | undefined;
    },
    private cdr: ChangeDetectorRef
  ) {
    this.title = data.title || null;
    this.message = data.message || null;
    this.mode = data.mode || 'yes-no';
  }

  ngAfterViewInit(): void {
    if (this.isComponent(this.data.title)) {
      this.loadComponent(this.titleContainerRef, this.data.title, this.data.titleInput);
    }
  }

  isComponent(val: any): val is Type<any> {
    return val instanceof Type;
  }

  loadComponent(containerRef: ViewContainerRef, component: Type<any>, componentInput?: any) {
    const componentRef = containerRef.createComponent(component);
    if (componentInput) {
      Object.assign(componentRef.instance, componentInput);
      this.cdr.detectChanges();
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onOk() {
    this.dialogRef.close(true);
  }
}
