using FluentValidation;

namespace Fibertest30.Application;

public class DiscoverOsmOtauValidator : AbstractValidator<DiscoverOsmOtauQuery>
{
    public DiscoverOsmOtauValidator()
    {
        OtauSharedValidationRules.ValidateChainAddress(RuleFor(x => x.ChainAddress));
    }
}

