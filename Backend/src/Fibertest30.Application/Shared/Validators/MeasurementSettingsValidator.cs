using Fibertest30.Domain.Utils;
using FluentValidation;

namespace Fibertest30.Application;

public class MeasurementSettingsValidator : AbstractValidator<MeasurementSettings> {
    private readonly IOtdr _otdr;

    public MeasurementSettingsValidator(IOtdr otdr)
    {
        _otdr = otdr;

        RuleFor(x => x.BackscatterCoeff)
            .InclusiveBetween(DefaultParameters.BackscatteringCoeffMin, 
                DefaultParameters.BackscatteringCoeffMax);

        RuleFor(x => x.RefractiveIndex)
            .InclusiveBetween(DefaultParameters.RefractiveIndexMin, 
                DefaultParameters.RefractiveIndexMax);

        RuleFor(x => x.Laser)
            .Must(BeAValidLaser)
            .WithMessage("Invalid laser type.")
            .DependentRules(() =>
            {
                RuleFor(x => x)
                    .Must(HaveRequiredManualSettingIfManualMode)
                    .WithMessage(
                        "DistanceRange, AveragingTime, Pulse and SamplingResolution must be set in Manual mode.");

                RuleFor(x => x)
                    .Must(HaveASupportedDistanceRange)
                    .WithMessage("DistanceRange is not supported")
                    .DependentRules(() =>
                    {
                        RuleFor(x => x)
                            .Must(HaveASupportedAveragingTime)
                            .WithMessage("AveragingTime is not supported");

                        RuleFor(x => x)
                            .Must(HaveASupportedPulse)
                            .WithMessage("Pulse is not supported");

                        RuleFor(x => x)
                            .Must(HaveASupportedSamplingResolution)
                            .WithMessage("SamplingResolution is not supported");
                    });
            });
        
        
        RuleFor(x => x.EventLossThreshold)
            .InclusiveBetween(DefaultParameters.EventLossThresholdMin, 
                DefaultParameters.EventLossThresholdMax);
        
        RuleFor(x => x.EventReflectanceThreshold)
            .InclusiveBetween(DefaultParameters.EventReflectanceThresholdMin, 
                DefaultParameters.EventReflectanceThresholdMax);
        
        RuleFor(x => x.EndOfFiberThreshold)
            .InclusiveBetween(DefaultParameters.EndOfFiberThresholdMin, 
                DefaultParameters.EndOfFiberThresholdMax);

        RuleFor(x => x.Splitter1Db)
            .GreaterThanOrEqualTo(0);
        
        RuleFor(x => x.Splitter2Db)
            .GreaterThanOrEqualTo(0);
        
        RuleFor(x => x.Mux)
            .GreaterThanOrEqualTo(1);
    }
    
    private bool BeAValidLaser(string laser)
    {
        return _otdr.SupportedMeasurementParameters.LaserUnits.ContainsKey(laser);
    }
    
    private bool HaveRequiredManualSettingIfManualMode(MeasurementSettings settings)
    {
        if (settings.MeasurementType == MeasurementType.Manual)
        {
            return !string.IsNullOrWhiteSpace(settings.DistanceRange)
                   && !string.IsNullOrWhiteSpace(settings.AveragingTime)
                   && !string.IsNullOrWhiteSpace(settings.Pulse)
                   && !string.IsNullOrWhiteSpace(settings.SamplingResolution);
        }
    
        return true;
    }

    private bool HaveASupportedDistanceRange(MeasurementSettings settings)
    {
        if (settings.MeasurementType == MeasurementType.Auto)
        {
            return true;
        }
        
        var laser = _otdr.SupportedMeasurementParameters.LaserUnits[settings.Laser];
        return laser.DistanceRanges.TryGetValue(settings.DistanceRange, out _);
    }

    private bool HaveASupportedAveragingTime(MeasurementSettings settings)
    {
        if (settings.MeasurementType == MeasurementType.Auto)
        {
            return true;
        }
        
        var laser = _otdr.SupportedMeasurementParameters.LaserUnits[settings.Laser];
        var distanceRange = laser.DistanceRanges[settings.DistanceRange];
        return settings.FastMeasurement
            ? distanceRange.LiveAveragingTimes.Contains(settings.AveragingTime)
            : distanceRange.AveragingTimes.Contains(settings.AveragingTime);
    }
    
    private bool HaveASupportedPulse(MeasurementSettings settings)
    {
        if (settings.MeasurementType == MeasurementType.Auto)
        {
            return true;
        }
        
        var laser = _otdr.SupportedMeasurementParameters.LaserUnits[settings.Laser];
        var distanceRange = laser.DistanceRanges[settings.DistanceRange];
        return distanceRange.PulseDurations.Contains(settings.Pulse);
    }
    
    private bool HaveASupportedSamplingResolution(MeasurementSettings settings)
    {
        if (settings.MeasurementType == MeasurementType.Auto)
        {
            return true;
        }
        
        var laser = _otdr.SupportedMeasurementParameters.LaserUnits[settings.Laser];
        var distanceRange = laser.DistanceRanges[settings.DistanceRange];
        return distanceRange.Resolutions.Contains(settings.SamplingResolution);
    }
}