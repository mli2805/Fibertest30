using Iit.Fibertest.Graph;

namespace Fibertest30.Infrastructure
{
    public class PdfBuilder(Model writeModel) : IPdfBuilder
    {
        public void CreateUserActionsReport(Guid userId, DateTimeFilter dateTimeFilter, List<int> operationCodes)
        {
            var logLines = writeModel.GetFilteredUserActions(userId, dateTimeFilter, operationCodes);
            var userCulture = "ru-RU"; // TODO получать по userId из настроек

            var generator = new UserActionsReportGenerator();
            generator.GenerateReport(logLines, @"c:/temp/user-actions.pdf", userCulture);
        }
    }
}
