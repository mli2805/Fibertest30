import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'signedNumber'
})
export class SignedNumberPipe implements PipeTransform {
  transform(value: any): any {
    if (value === null || value === undefined) return value;
    const num = parseFloat(value);
    if (isNaN(num)) {
      return value;
    }

    return num > 0 ? `+${num}` : num.toString();
  }
}
