using FluentValidation;

namespace Fibertest30.Application;

public class AddAndAttachPortLabelValidator : AbstractValidator<AddAndAttachPortLabelCommand>
{
    public AddAndAttachPortLabelValidator()
    {
        SharedValidationRules.ValidatePortLabelName(RuleFor(x => x.Name));
        SharedValidationRules.ValidatePortLabelHexColor(RuleFor(x => x.HexColor));
    }
}