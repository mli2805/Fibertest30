using FluentValidation;

namespace Fibertest30.Application;

public class DiscoverOxcOtauValidator : AbstractValidator<DiscoverOxcOtauQuery>
{
    public DiscoverOxcOtauValidator()
    {
        SharedValidationRules.ValidateIpAddress(RuleFor(x => x.IpAddress));
        SharedValidationRules.ValidateTcpPort(RuleFor(x => x.Port));
    }
}