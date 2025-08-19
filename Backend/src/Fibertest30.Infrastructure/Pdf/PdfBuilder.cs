using Iit.Fibertest.Graph;

namespace Fibertest30.Infrastructure
{
    public class PdfBuilder(Model writeModel) : IPdfBuilder
    {
        public byte[]?  GenerateUserActionsReport(Guid userId, DateTimeFilter dateTimeFilter, List<int> operationCodes)
        {
            var logLines = writeModel.GetFilteredUserActions(userId, dateTimeFilter, operationCodes);
            var userCulture = "ru-RU"; // TODO получать по userId из настроек

            var generator = new UserActionsReportGenerator();
            try
            {
                var pdfDocument = generator.GenerateReport(logLines, userCulture);
                // Сохраняем PDF в память
                using var stream = new MemoryStream();
                pdfDocument.Save(stream, false); // false = leave stream open
                byte[] pdfBytes = stream.ToArray();
                return pdfBytes;
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }
}
