import { AlarmProfile } from 'src/app/core/store/models/alarm-profile';
import { Threshold, ThresholdParameter } from 'src/app/core/store/models/threshold';

export class AlarmProfilesFactory {
  static createOriginalDefaultProfile() {
    const profile = new AlarmProfile();
    profile.id = 0;

    for (const param of Object.keys(ThresholdParameter).filter((k) => !isNaN(Number(k)))) {
      const threshold = this.createOriginalDefaultThreshold(+param);
      profile.thresholds.push(threshold);
    }

    return profile;
  }

  static createOriginalDefaultThreshold(param: ThresholdParameter): Threshold {
    const threshold = new Threshold(param);
    threshold.id = 0;

    if (param === ThresholdParameter.SectionAttenuation) {
      threshold.minor = 0.3;
      threshold.major = 0.5;
      threshold.critical = 0.7;
    } else {
      threshold.minor = 0.5;
      threshold.major = 0.7;
      threshold.critical = 1;
    }

    return threshold;
  }
}
