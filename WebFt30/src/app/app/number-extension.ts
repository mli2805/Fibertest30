declare global {
  interface Number {
    frmt(integerLength: number, decimalPlaces: number): string;
    validInteger(min: number, max: number): boolean;
  }
}

Number.prototype.frmt = function (integerLength: number, decimalPlaces: number): string {
  const num = this as number;
  const sign = num < 0 ? '-' : '';
  const formatted = Math.abs(num).toFixed(decimalPlaces); // округляет а не отбрасывает лишнее
  const fullWidth = decimalPlaces === 0 ? integerLength : integerLength + decimalPlaces + 1;
  const padded = formatted.padStart(fullWidth, '0');
  return `${sign}${padded}`;
};

Number.prototype.validInteger = function (min: number, max: number): boolean {
  const num = this as number;
  if (!Number.isInteger(num)) return false;
  return num >= min && num <= max;
};

export {};
