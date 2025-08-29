namespace Fibertest30.Application;

public interface IPdfBuilder
{
    byte[]? GenerateUserActionsReport(List<UserActionLine> lines, string culture);

}