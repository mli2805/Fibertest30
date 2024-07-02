using FluentValidation;

namespace Fibertest30.Application;

public class StartOnDemandCommandValidator : AbstractValidator<StartOnDemandCommand>
{
    public StartOnDemandCommandValidator(IOtdr otdr)
    {
        RuleFor(x => x.MeasurementSettings).SetValidator(new MeasurementSettingsValidator(otdr));
    }
}