namespace Fibertest30.Application;

public interface IPdfBuilder
{
    void CreateUserActionsReport(Guid userId, DateTimeFilter dateTimeFilter, List<int> operationCodes);

}