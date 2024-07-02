import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'rtu-input-password-with-eye',
  templateUrl: './input-password-with-eye.component.html'
})
export class InputPasswordWithEyeComponent {
  @Input() showPlaceholder!: boolean;
  @Input() placeholder!: string;
  @Output() changedValueEvent = new EventEmitter<string>();

  @ViewChild('inp') inputElement!: ElementRef;
  passwordVisible = false;
  passwordInputType = 'password';
  onPasswordEyeClicked() {
    this.passwordVisible = !this.passwordVisible;
    this.passwordInputType = this.passwordVisible ? 'text' : 'password';
  }

  getResult(): string {
    return this.inputElement.nativeElement.value;
  }

  onInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.changedValueEvent.emit(newValue);
  }
}
