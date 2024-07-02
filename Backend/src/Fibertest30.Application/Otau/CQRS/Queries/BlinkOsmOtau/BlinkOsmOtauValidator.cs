using FluentValidation;

namespace Fibertest30.Application;

public class BlinkOsmOtauValidator : AbstractValidator<BlinkOsmOtauQuery>
{
    public BlinkOsmOtauValidator()
    {
        OtauSharedValidationRules.ValidateChainAddress(RuleFor(x => x.ChainAddress));
    }
}

