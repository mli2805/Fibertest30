namespace Fibertest30.Infrastructure
{
    public class PdfBuilder() : IPdfBuilder
    {
        public byte[]?  GenerateUserActionsReport(List<UserActionLine> logLines, string culture)
        {
            var generator = new UserActionsReportGenerator();
            try
            {
                var pdfDocument = generator.GenerateReport(logLines, culture);
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
