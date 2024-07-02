using FluentValidation;

namespace Fibertest30.Application;

public class DeleteAlarmProfileValidator : AbstractValidator<DeleteAlarmProfileCommand>
{
    public DeleteAlarmProfileValidator(IAlarmProfileRepository repository)
    {
        RuleFor(x => x.AlarmProfileId)
            .GreaterThan(1).WithMessage("Default alarm profile cannot be removed");
    }
}