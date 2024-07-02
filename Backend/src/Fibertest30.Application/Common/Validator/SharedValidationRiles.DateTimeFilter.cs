using FluentValidation;

namespace Fibertest30.Application;

public static partial class SharedValidationRules
{
    public static void ValidateDateTimeFilter<T>(this IRuleBuilder<T, DateTimeFilter> ruleBuilder)
    {
        ruleBuilder
            .Must(MustHaveEitherSearchWindowOrRelativeFromNow)
            .WithMessage("DateTimeFilter must have either SearchWindow or RelativeFromNow")
            .Must(SearchWindowStartMustBeBeforeEnd)
            .WithMessage("SearchWindow start must be before end");
    }

    private static bool SearchWindowStartMustBeBeforeEnd(DateTimeFilter dateTimeFilter)
    {
        var searchWindow = dateTimeFilter.SearchWindow;
        if (searchWindow != null && searchWindow.Start >= searchWindow.End)
        {
            return false;
        }

        return true;
    }

    private static bool MustHaveEitherSearchWindowOrRelativeFromNow(DateTimeFilter dateTimeFilter)
    {
        if ((dateTimeFilter.SearchWindow != null && dateTimeFilter.RelativeFromNow != null)
            || (dateTimeFilter.SearchWindow == null && dateTimeFilter.RelativeFromNow == null))
        {
            return false;
        }

        return true;     
    }   
}