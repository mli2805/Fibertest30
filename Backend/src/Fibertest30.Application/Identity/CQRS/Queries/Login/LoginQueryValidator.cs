
using FluentValidation;

namespace Fibertest30.Application;

public class LoginQueryValidator : AbstractValidator<LoginQuery>
{
    public LoginQueryValidator()
    {
        RuleFor(x => x.UserName)
            .NotNull().NotEmpty();

        RuleFor(x => x.Password)
            .NotNull().NotEmpty();
    }
}
