using FluentValidation;

namespace Fibertest30.Application;

public class UpdateAlarmProfileValidator : AbstractValidator<UpdateAlarmProfileCommand>
{
    public UpdateAlarmProfileValidator(IAlarmProfileRepository repository)
    {
        RuleFor(x => x.AlarmProfile)
            .NotNull()
            .Must(repository.UniqueName)
            .Must(repository.DefaultNameInviolable);

        RuleFor(x => x.AlarmProfile.Name).NotNull().NotEmpty();
        RuleFor(x => x.AlarmProfile.Thresholds).NotNull();

        RuleForEach(x => x.AlarmProfile.Thresholds).SetValidator(new ThresholdValidator());
    }
}