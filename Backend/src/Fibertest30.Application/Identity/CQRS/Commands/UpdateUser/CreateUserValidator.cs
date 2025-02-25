using FluentValidation;

namespace Fibertest30.Application;

public class CreateUserValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Patch).NotNull();
        RuleFor(x => x.Patch.UserName).NotNull().MaximumLength(100);
        RuleFor(x => x.Patch.FirstName).NotNull().MaximumLength(100);
        RuleFor(x => x.Patch.Role).NotNull().NotEmpty();
        RuleFor(x => x.Patch.Email)
            .EmailAddress().When(x => !string.IsNullOrEmpty(x.Patch.Email));
        RuleFor(x => x.Patch.PhoneNumber)
            .Must(x => x!.IsValidPhoneNumber()).When(x => !string.IsNullOrEmpty(x.Patch.PhoneNumber));
        RuleFor(x => x.Patch.Password).NotNull().NotEmpty().Must(x=>x!.IsValidPassword());
    }
}