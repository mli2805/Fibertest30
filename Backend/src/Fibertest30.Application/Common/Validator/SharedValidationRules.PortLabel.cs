using FluentValidation;

namespace Fibertest30.Application;

public static partial class SharedValidationRules
{
    public static void ValidatePortLabelName<T>(IRuleBuilder<T, string> ruleBuilder)
    {
        ruleBuilder
            .NotEmpty()
            .MaximumLength(50);
    }
    
    public static void ValidatePortLabelHexColor<T>(IRuleBuilder<T, string> ruleBuilder)
    {
        ruleBuilder
            .NotEmpty()
            .MaximumLength(7)
            .Matches("^#[0-9A-Fa-f]{6}$").WithMessage("Port HexColor must be in HEX format");
    }
}