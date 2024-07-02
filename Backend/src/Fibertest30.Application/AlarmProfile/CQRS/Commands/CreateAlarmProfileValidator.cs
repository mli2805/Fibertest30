using FluentValidation;

namespace Fibertest30.Application;
public class CreateAlarmProfileValidator : AbstractValidator<CreateAlarmProfileCommand>
{

    public CreateAlarmProfileValidator(IAlarmProfileRepository repository)
    {
        RuleFor(x => x.AlarmProfile).NotNull().Must(repository.UniqueName);
        RuleFor(x => x.AlarmProfile.Name).NotNull().NotEmpty();
        RuleFor(x => x.AlarmProfile.Thresholds).NotNull();

        RuleForEach(x => x.AlarmProfile.Thresholds).SetValidator(new ThresholdValidator());
    }
}