using FluentValidation;

namespace Fibertest30.Application;

public class UpdatePortLabelValidator : AbstractValidator<AddAndAttachPortLabelCommand>
{
    public UpdatePortLabelValidator()
    {
        SharedValidationRules.ValidatePortLabelName(RuleFor(x => x.Name));
        SharedValidationRules.ValidatePortLabelHexColor(RuleFor(x => x.HexColor));
    }
}