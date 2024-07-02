using FluentValidation;

namespace Fibertest30.Application;

public class AddOsmOtauCommandValidator : AbstractValidator<AddOsmOtauCommand>
{
    public AddOsmOtauCommandValidator()
    {
        OtauSharedValidationRules.ValidateChainAddress(RuleFor(x => x.ChainAddress));
    }
}