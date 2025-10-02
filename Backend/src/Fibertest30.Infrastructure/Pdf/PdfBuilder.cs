using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.Logging;
using PdfSharp.Pdf;

namespace Fibertest30.Infrastructure
{
    public class PdfBuilder(ILogger<PdfBuilder> logger) : IPdfBuilder
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
                logger.LogError(e, "Fialed to GenerateUserActionsReport");
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
                logger.LogError(e, "Fialed to GenerateCurrentOpticalEventsReport");
                return null;
            }
        }

        public byte[]? GenerateOpticalEventsForPeriodReport(GetOpticalEventsReportPdfQuery query, 
            List<MeasurementWrap> wrapped, Dictionary<EventStatus, Dictionary<FiberState, int>> totals, 
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
                logger.LogError(e, "Fialed to GenerateOpticalEventsForPeriodReport");
                return null;
            }
        }

        public byte[]? GenerateMonitoringSystemReport(Model writeModel, ServerInfo serverInfo, string culture)
        {
            var generator = new MonitoringSystemReportGenerator(writeModel, culture);
            try
            {
                var pdfDocument = generator.GenerateReport(serverInfo);
                return PdfReportToBytes(pdfDocument);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Fialed to GenerateMonitoringSystemReport");
                return null;
            }
        }

        private byte[]? PdfReportToBytes(PdfDocument pdfDocument)
        {
            try
            {
                // Сохраняем PDF в память
                using var stream = new MemoryStream();
                pdfDocument.Save(stream); 
                byte[] pdfBytes = stream.ToArray();
                return pdfBytes;
            }
            catch (Exception e)
            {
                logger.LogError(e, "Fialed to PdfReportToBytes");
                return null;
            }
        }
    }
}
