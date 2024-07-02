import { ThresholdParameter } from 'src/app/core/store/models/threshold';

export class ThresholdLimits {
  static Limits = [
    { Threshold: ThresholdParameter.EventLoss, Precision: 2, Min: 0.5, Max: 6 },
    { Threshold: ThresholdParameter.TotalLoss, Precision: 2, Min: 0.5, Max: 6 },
    { Threshold: ThresholdParameter.EventReflectance, Precision: 2, Min: 0.5, Max: 6 },
    { Threshold: ThresholdParameter.SectionAttenuation, Precision: 2, Min: 0.3, Max: 6 },
    { Threshold: ThresholdParameter.SectionLoss, Precision: 2, Min: 0.5, Max: 6 },
    { Threshold: ThresholdParameter.SectionLengthChange, Precision: 2, Min: 0.5, Max: 6 },
    { Threshold: ThresholdParameter.PortHealth, Precision: 2, Min: 0.5, Max: 6 }
  ];

  static Get(thresholdParameter: ThresholdParameter) {
    return this.Limits.find((x) => x.Threshold == thresholdParameter);
  }
}
