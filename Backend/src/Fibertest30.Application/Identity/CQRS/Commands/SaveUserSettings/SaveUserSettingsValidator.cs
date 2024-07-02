using FluentValidation;

namespace Fibertest30.Application;

public class SaveUserSettingsValidator : AbstractValidator<SaveUserSettingsCommand>
{
    private static string[] _themes = new []{ "dark", "light" };
    
    public SaveUserSettingsValidator()
    {
        RuleFor(x => x.Settings)
            .NotNull();

        RuleFor(x => x.Settings.Theme)
            .NotNull().NotEmpty()
            .Must(x => _themes.Contains(x));

        RuleFor(x => x.Settings.Language)
            .NotNull().NotEmpty()
            .MaximumLength(100).WithMessage("FirstName must not exceed 100 characters.");

        RuleFor(x => x.Settings.DateTimeFormat)
            .NotNull().NotEmpty();
    }
}