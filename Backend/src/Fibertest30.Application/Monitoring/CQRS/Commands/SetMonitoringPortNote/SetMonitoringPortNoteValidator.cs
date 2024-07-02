using FluentValidation;

namespace Fibertest30.Application;


public class SetMonitoringPortNoteValidator : AbstractValidator<SetMonitoringPortNoteCommand>
{
    public SetMonitoringPortNoteValidator()
    {
        RuleFor(x => x.Note).MaximumLength(1000);
    }
}