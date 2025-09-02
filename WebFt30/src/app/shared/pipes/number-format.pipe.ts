import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormat',
    standalone: false
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number, digitsAfterPeriod = 0, showZero = true): string {
    if (!showZero && value === 0) return '';
    return value.toFixed(digitsAfterPeriod);
  }
}
