namespace Fibertest30.Application;

public interface IPdfBuilder
{
    byte[]? GenerateUserActionsReport(Guid userId, DateTimeFilter dateTimeFilter, List<int> operationCodes);

}