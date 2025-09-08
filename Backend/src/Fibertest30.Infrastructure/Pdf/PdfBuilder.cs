using PdfSharp.Pdf;

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
                return PdfReportToBytes(pdfDocument);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public byte[]? GenerateCurrentOpticalEventsReport(List<MeasurementWrap> wrapped, ServerInfo serverInfo, string culture)
        {
            var generator = new CurrentOpticalEventsReportGenerator();
            try
            {
                var pdfDocument = generator.GenerateReport(wrapped, serverInfo, culture);
                return PdfReportToBytes(pdfDocument);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public byte[]? GenerateOpticalEventsForPeriodReport(GetOpticalEventsReportPdfQuery query, 
            List<MeasurementWrap> wrapped, List<List<string>> totals, 
            ServerInfo serverInfo, UserSettings? userSettings)
        {
            var generator = new OpticalEventsForPeriodReportGenerator(query, userSettings);
            try
            {
                var pdfDocument = generator.GenerateReport(wrapped, totals, serverInfo);
                return PdfReportToBytes(pdfDocument);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        private byte[]? PdfReportToBytes(PdfDocument pdfDocument)
        {
            try
            {
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
