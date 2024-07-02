using FluentValidation;

namespace Fibertest30.Application;

public class StartBaselineSetupCommandValidator : AbstractValidator<StartBaselineSetupCommand>
{
    public StartBaselineSetupCommandValidator(IOtdr otdr)
    {
        RuleFor(x => x.MeasurementSettings)
            .NotNull()
            .When(x => !x.FullAutoMode);

        RuleFor(x => x.MeasurementSettings)
            .Null()
            .When(x => x.FullAutoMode);

        RuleFor(x => x.MeasurementSettings)
#pragma warning disable CS8620
            .SetValidator(new MeasurementSettingsValidator(otdr))
#pragma warning restore CS8620
            .When(x => !x.FullAutoMode);
    }
}