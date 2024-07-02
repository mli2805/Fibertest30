using FluentValidation;

namespace Fibertest30.Application;

public class UpdateUserValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserValidator(ICurrentUserService currentUserService)
    {
        RuleFor(x => x.UserId).NotNull().NotEmpty();
        RuleFor(x => x.Patch).NotNull();
        RuleFor(x => x.Patch).Must(HaveAtLeastOnePropertySet);
        RuleFor(x => x.Patch.UserName).Empty().WithMessage("UserName cannot be changed.");
        RuleFor(x => x.Patch.FirstName).MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Patch.FirstName));
        RuleFor(x => x.Patch.LastName).MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Patch.LastName));
        RuleFor(x => x.Patch.Role).Null().When(c => c.UserId == currentUserService.UserId);
        RuleFor(x => x.Patch.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Patch.Email));
        RuleFor(x => x.Patch.PhoneNumber).Must(x => x!.IsValidPhoneNumber()).When(x => !string.IsNullOrEmpty(x.Patch.PhoneNumber));
        RuleFor(x => x.Patch.Password).Must(x=>x!.IsValidPassword()).When(x => !string.IsNullOrEmpty(x.Patch.Password));
    }
    
    private bool HaveAtLeastOnePropertySet(ApplicationUserPatch patch)
    {
        return patch.GetType()
            .GetProperties()
            .Any(prop => prop.GetValue(patch) != null);
    }
}