using FluentValidation;

namespace Fibertest30.Application;

public class AddOxcOtauCommandValidator : AbstractValidator<AddOxcOtauCommand>
{
    public AddOxcOtauCommandValidator()
    {
        SharedValidationRules.ValidateIpAddress(RuleFor(x => x.IpAddress));
        SharedValidationRules.ValidateTcpPort(RuleFor(x => x.Port));
    }
}