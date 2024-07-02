using FluentValidation;

namespace Fibertest30.Application;

public class DeleteUserValidator : AbstractValidator<DeleteUserCommand>
{
    public DeleteUserValidator(ICurrentUserService currentUserService)
    {
        RuleFor(x => x.UserId).NotNull().NotEmpty();
        RuleFor(x => x.UserId).NotEqual(currentUserService.UserId);
    }
}
