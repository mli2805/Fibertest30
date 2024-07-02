using FluentValidation;

namespace Fibertest30.Application;

public class BlinkOxcOtauValidator : AbstractValidator<BlinkOxcOtauQuery>
{
    public BlinkOxcOtauValidator()
    {
        SharedValidationRules.ValidateIpAddress(RuleFor(x => x.IpAddress));
        SharedValidationRules.ValidateTcpPort(RuleFor(x => x.Port));
    }
}