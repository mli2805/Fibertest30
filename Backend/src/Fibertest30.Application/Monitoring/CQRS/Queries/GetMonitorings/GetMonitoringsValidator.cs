using FluentValidation;

namespace Fibertest30.Application;

public class GetMonitoringsValidator : AbstractValidator<GetMonitoringsQuery>
{
    public GetMonitoringsValidator()
    {
        RuleFor(x => x.DateTimeFilter).ValidateDateTimeFilter();
    }
}