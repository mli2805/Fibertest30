export class ValidationUtils {
  static FloatPattern = '^[-+]?[0-9]*.?[0-9]+([eE][-+]?[0-9]+)?$';

  static NumberWithLimitedDecimalPlaces = '^[-+]?[0-9]+(.[0-9]{0,n})?$';

  static DecimalsNoMoreThan(n: number): string {
    return this.NumberWithLimitedDecimalPlaces.replace('n', n.toString());
  }
}
